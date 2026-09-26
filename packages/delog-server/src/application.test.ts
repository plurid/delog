import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import { createDelog, type DelogApplication } from './application.js';
import { createDelogClient } from '../../delog-client/delog-javascript/src/index.js';
import { resolveConfig } from './config.js';
import { schema } from './graphql.js';

const applications: DelogApplication[] = [];
const directories: string[] = [];
const credentials = { identonym: 'operator', key: 'test-owner-password' };

function createApplication(options: Parameters<typeof createDelog>[0] = {}) {
  const dataRoot = mkdtempSync(join(tmpdir(), 'delog-test-'));
  directories.push(dataRoot);
  const application = createDelog({
    dataRoot,
    port: 0,
    owner: credentials,
    ingestToken: 'test-ingestion-token',
    notificationIntervalMs: 60000,
    ...options,
  });
  applications.push(application);
  return application;
}

async function signIn(url: string) {
  const response = await fetch(url + '/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  expect(response.status).toBe(200);
  const body = (await response.json()) as { token: string };
  return body.token;
}

async function jsonRequest(url: string, path: string, token?: string, body?: unknown) {
  const response = await fetch(url + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return { status: response.status, body: await response.json() };
}

afterEach(async () => {
  await Promise.all(applications.splice(0).map((application) => application.close()));
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

describe('application lifecycle and contracts', () => {
  it('requires explicit credentials and does not create resources until start', async () => {
    expect(() => resolveConfig({}, {})).toThrow('DELOG_OWNER_KEY');
    expect(() => resolveConfig({ owner: credentials, ingestToken: credentials.key }, {})).toThrow(
      'must be different',
    );
    const application = createApplication();
    expect(existsSync(join(application.config.dataRoot, 'delog.sqlite'))).toBe(false);
    const [first, second] = await Promise.all([application.start(), application.start()]);
    expect(first).toBe(second);
    expect((await fetch(first + '/ready')).status).toBe(200);
    await Promise.all([application.close(), application.close()]);
    expect(existsSync(join(application.config.dataRoot, '.delog.lock'))).toBe(false);
    expect(await application.start()).toMatch(/^http:/);
  });

  it('locks a data root and releases a failed startup', async () => {
    const first = createApplication();
    await first.start();
    const second = createApplication({ dataRoot: first.config.dataRoot });
    await expect(second.start()).rejects.toThrow('locked');
    await first.close();
    await second.start();
    expect(second.url).toBeDefined();
  });

  it('retains every legacy operation in a valid GraphQL schema', () => {
    expect(schema.getMutationType()?.getFields()).toHaveProperty('delogMutationRecord');
    for (const name of [
      'generateToken',
      'generateProject',
      'generateSpace',
      'generateTester',
      'generateNotifier',
      'addProvider',
      'linkRepository',
      'obliterateRecords',
    ]) {
      expect(schema.getMutationType()?.getFields()).toHaveProperty(name);
    }
    expect(schema.getQueryType()?.getFields()).toHaveProperty('getAnalyticsLastPeriod');
  });
});

describe('authenticated logging', () => {
  it('accepts the SDK and legacy wire contract, commits before acknowledgement, and survives restart', async () => {
    const application = createApplication();
    const url = await application.start();
    const client = createDelogClient({ endpoint: url + '/graphql', token: 'test-ingestion-token' });
    expect(
      await client.error({ text: 'database disconnected', project: 'api', space: 'database' }),
    ).toBe(true);
    const admin = await signIn(url);
    const records = await jsonRequest(url, '/api/records', admin);
    expect(records.body.records).toHaveLength(1);
    expect(records.body.records[0]).toMatchObject({
      text: 'database disconnected',
      level: 5,
      project: 'api',
      unit: 'us',
    });

    const legacy = await jsonRequest(url, '/delog', 'test-ingestion-token', {
      query:
        'mutation($input: DelogInputRecord!) { delogMutationRecord(input: $input) { status } }',
      variables: { input: { text: 'legacy seconds', time: 1700000000, unit: 's', level: 3 } },
    });
    expect(legacy.body.data.delogMutationRecord.status).toBe(true);
    await application.close();
    const restartedUrl = await application.start();
    const persisted = await jsonRequest(restartedUrl, '/api/records', admin);
    expect(persisted.body.records).toHaveLength(2);
    expect(
      persisted.body.records.find((record: { text: string }) => record.text === 'legacy seconds')
        .time,
    ).toBe(1700000000000000);
  });

  it('keeps ingestion credentials out of administration and supports token revocation', async () => {
    const application = createApplication();
    const url = await application.start();
    expect((await jsonRequest(url, '/api/records')).status).toBe(401);
    expect((await jsonRequest(url, '/api/records', 'test-ingestion-token')).status).toBe(403);
    expect(
      (await jsonRequest(url, '/api/entities/tokens', 'test-ingestion-token', { name: 'bad' }))
        .status,
    ).toBe(403);

    const admin = await signIn(url);
    const created = await jsonRequest(url, '/api/entities/tokens', admin, { name: 'worker' });
    expect(created.status).toBe(201);
    const token = created.body.value as string;
    const listed = await jsonRequest(url, '/api/entities/tokens', admin);
    expect(JSON.stringify(listed.body)).not.toContain(token);
    expect(listed.body[0]).not.toHaveProperty('hash');
    const client = createDelogClient({ endpoint: url + '/graphql', token });
    await client.info('accepted');
    await fetch(url + '/api/entities/tokens/' + created.body.id, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${admin}` },
    });
    await expect(client.info('rejected')).rejects.toThrow();

    await fetch(url + '/api/session', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${admin}` },
    });
    expect((await jsonRequest(url, '/api/records', admin)).status).toBe(401);
  });

  it('rejects cross-origin writes and invalid batches atomically', async () => {
    const application = createApplication();
    const url = await application.start();
    const crossOrigin = await fetch(url + '/api/session', {
      method: 'POST',
      headers: { Origin: 'https://other.example', 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    expect(crossOrigin.status).toBe(403);
    const admin = await signIn(url);
    const response = await jsonRequest(url, '/api/records', admin, [
      { text: 'valid', time: Date.now(), unit: 'ms', level: 3 },
      { text: 'invalid', time: Date.now(), unit: 'ms', level: 42 },
    ]);
    expect(response.status).toBe(400);
    expect((await jsonRequest(url, '/api/records', admin)).body.records).toHaveLength(0);
  });

  it('supports legacy GraphQL owner fields and scoped CRUD', async () => {
    const application = createApplication();
    const url = await application.start();
    const admin = await signIn(url);
    const response = await jsonRequest(url, '/graphql', admin, {
      query: 'mutation { generateProject(input:{value:"api"}) { status data { id name } } }',
    });
    expect(response.body.data.generateProject.data.name).toBe('api');
    const owner = await jsonRequest(url, '/graphql', admin, {
      query:
        '{ getCurrentOwner { status data { id projects { id name } tokens { startsWith } analytics { size { value } } } } }',
    });
    expect(owner.body.errors).toBeUndefined();
    expect(owner.body.data.getCurrentOwner.data.projects).toHaveLength(1);
  });

  it('isolates custom owners even when record and entity identifiers are known', async () => {
    const application = createApplication({
      mode: 'custom',
      accessPolicy: {
        async authenticate(request) {
          const owner = request.headers.authorization;
          return owner ? { owner, role: 'admin' } : null;
        },
        authorize: () => true,
      },
    });
    const url = await application.start();
    const created = await jsonRequest(url, '/api/records', 'alice', {
      text: 'alice secret',
      time: Date.now(),
      unit: 'ms',
      level: 3,
    });
    const id = created.body.records[0].id as string;
    expect((await jsonRequest(url, '/api/records', 'bob')).body.records).toEqual([]);
    expect((await jsonRequest(url, '/api/records/' + id, 'bob')).status).toBe(404);
    const removed = await fetch(url + '/api/records', {
      method: 'DELETE',
      headers: { Authorization: 'Bearer bob', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] }),
    });
    expect((await removed.json()).deleted).toBe(0);
    expect((await jsonRequest(url, '/api/records', 'alice')).body.records).toHaveLength(1);
  });
});

it('uses custom login identities for revocable local admin sessions', async () => {
  const application = createApplication({
    mode: 'custom',
    accessPolicy: {
      authenticate: async () => null,
      authorize: (principal, action) => principal.owner === 'custom-owner' && action !== 'ingest',
      login: async (identonym, key) =>
        identonym === credentials.identonym && key === credentials.key
          ? { owner: 'custom-owner', role: 'admin' }
          : null,
    },
  });
  const url = await application.start();
  const token = await signIn(url);
  expect((await jsonRequest(url, '/api/session', token)).body.owner).toBe('custom-owner');
  expect((await jsonRequest(url, '/api/records', token)).status).toBe(200);
  expect(
    (await jsonRequest(url, '/api/records', token, { text: 'blocked', level: 3, time: 1 })).status,
  ).toBe(403);
  await fetch(url + '/api/session', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  expect((await jsonRequest(url, '/api/records', token)).status).toBe(401);
});

it('delivers HTTP notifications with stable identifiers and the configured secret', async () => {
  const received = Promise.withResolvers<{
    secret?: string;
    delivery?: string;
    payload: unknown;
  }>();
  const receiver = createServer(async (request, response) => {
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    response.writeHead(204).end();
    received.resolve({
      secret: request.headers['delog-secret'] as string | undefined,
      delivery: request.headers['delog-delivery'] as string | undefined,
      payload: JSON.parse(Buffer.concat(chunks).toString('utf8')),
    });
  });
  receiver.listen(0, '127.0.0.1');
  await once(receiver, 'listening');
  try {
    const port = (receiver.address() as AddressInfo).port;
    const application = createApplication({ notificationIntervalMs: 10 });
    const url = await application.start();
    const admin = await signIn(url);
    await jsonRequest(url, '/api/entities/notifiers', admin, {
      name: 'receiver',
      type: 'api',
      notifyOn: ['RECORDED_ERROR'],
      data: JSON.stringify({ endpoint: `http://127.0.0.1:${port}`, secret: 'delivery-secret' }),
    });
    await jsonRequest(url, '/api/records', 'test-ingestion-token', {
      text: 'delivery example',
      level: 5,
      time: Date.now(),
      unit: 'ms',
    });
    const notification = await received.promise;
    expect(notification.secret).toBe('delivery-secret');
    expect(notification.delivery).toMatch(/^[0-9a-f-]{36}$/);
    expect(notification.payload).toMatchObject({ text: 'delivery example', level: 5 });
    await application.close();
  } finally {
    receiver.closeAllConnections();
    await new Promise<void>((resolve) => receiver.close(() => resolve()));
  }
});

it('allows anonymous public reads while keeping writes and provider configuration private', async () => {
  const application = createApplication({ mode: 'public' });
  const url = await application.start();
  expect((await jsonRequest(url, '/api/session')).body.role).toBe('reader');
  expect((await jsonRequest(url, '/api/records')).status).toBe(200);
  expect((await jsonRequest(url, '/api/entities/providers')).status).toBe(403);
  expect(
    (await jsonRequest(url, '/api/records', undefined, { text: 'blocked', level: 3, time: 1 }))
      .status,
  ).toBe(403);
  const admin = await signIn(url);
  expect((await jsonRequest(url, '/api/entities/providers', admin)).status).toBe(200);
});
