import { afterEach, beforeEach, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Repository } from './repository.js';
import { DelogService, normalizeRecord } from './service.js';
import { Automation } from './automation.js';
import { doctor, migrate } from './operations.js';

let root: string;
let repository: Repository;
let service: DelogService;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'delog-service-'));
  repository = new Repository(root);
  service = new DelogService(repository);
});

afterEach(() => {
  repository.close();
  rmSync(root, { recursive: true, force: true });
});

it('normalizes time units and safely formats substitutions', () => {
  for (const [unit, time] of [
    ['s', 1700000000],
    ['ms', 1700000000000],
    ['us', 1700000000000000],
  ]) {
    expect(normalizeRecord({ text: 'hello', level: 3, unit, time }).time).toBe(1700000000000000);
  }
  service.create('formats', 'owner', { identifier: 'plain', transform: '%PROJECT: %TEXT %TEXT' });
  const records = service.ingest('owner', {
    text: '%LEVEL',
    project: 'api',
    level: 3,
    time: 1,
    format: 'plain',
  });
  expect(records[0]!.log).toBe('api: %LEVEL %LEVEL');
});

it('paginates equal timestamps without duplicates and scopes filters', () => {
  const input = { time: 1700000000000000, level: 3, project: 'api' };
  service.ingest(
    'owner',
    Array.from({ length: 7 }, (_, index) => ({ ...input, text: `record ${index}` })),
  );
  service.ingest('other', { ...input, text: 'private record' });
  const ids: string[] = [];
  let cursor: string | undefined;
  do {
    const page = repository.query('owner', { count: 2, start: cursor });
    ids.push(...page.records.map((record) => record.id));
    cursor = page.next ?? undefined;
  } while (cursor);
  expect(ids).toHaveLength(7);
  expect(new Set(ids).size).toBe(7);
  expect(repository.query('owner', { search: "' OR 1=1 --" }).records).toEqual([]);
  expect(() => repository.query('owner', { count: 100000 })).toThrow('count');
});

it('resumes durable tests, waits for missing phases, and checks level and method', () => {
  service.create('testers', 'owner', {
    name: 'request',
    project: 'api',
    suite: 'requests',
    scenario: 'success',
    configuration: JSON.stringify({
      phases: [
        { text: 'start', level: 'info' },
        { text: 'done', level: 'info', method: 'finish' },
      ],
      startDelay: 100,
      retryDelay: 100,
      timeout: 500,
    }),
  });
  const context = {
    mode: 'TESTING',
    suite: 'requests',
    scenario: 'success',
    sharedID: 'run',
    sharedOrder: 0,
  };
  service.ingest('owner', {
    text: 'start',
    level: 3,
    time: Date.now(),
    unit: 'ms',
    project: 'api',
    context,
  });
  const next = Number(repository.db.prepare('SELECT next_at FROM test_runs').get()!.next_at);
  repository.close();
  repository = new Repository(root);
  service = new DelogService(repository);
  const automation = new Automation(service, 0, () => {});
  automation.evaluateTests(next);
  expect(repository.tests('owner')).toEqual([]);
  service.ingest('owner', {
    text: 'done',
    method: 'wrong',
    level: 5,
    time: Date.now(),
    unit: 'ms',
    project: 'api',
    context: { ...context, sharedOrder: 1 },
  });
  automation.evaluateTests(next + 100);
  expect(repository.tests('owner')[0]).toMatchObject({ status: false, phasesStatus: [1, 0] });
  expect(repository.tests('other')).toEqual([]);
});

it('persists notification retries and does not expose destination secrets', async () => {
  const notifier = service.create('notifiers', 'owner', {
    name: 'receiver',
    type: 'api',
    notifyOn: ['RECORDED_ERROR'],
    data: JSON.stringify({ endpoint: 'http://127.0.0.1:3000/', secret: 'notification-secret' }),
  });
  expect(JSON.stringify(notifier)).not.toContain('notification-secret');
  service.ingest('owner', { text: 'failed', level: 5, time: 1700000000000000 });
  const failed = new Automation(
    service,
    0,
    () => {},
    async () => {
      throw new Error('offline');
    },
  );
  await failed.tick();
  expect(repository.db.prepare('SELECT attempts FROM outbox').get()?.attempts).toBe(1);
  repository.close();
  repository = new Repository(root);
  service = new DelogService(repository);
  const received: unknown[] = [];
  const recovered = new Automation(
    service,
    0,
    () => {},
    async (_notifier, payload) => {
      received.push(payload);
    },
  );
  await recovered.tick(Date.now() + 60000);
  expect(received).toHaveLength(1);
  expect(repository.db.prepare('SELECT count(*) AS count FROM outbox').get()?.count).toBe(0);
});

it('keeps records when their project is removed', () => {
  const project = service.create('projects', 'owner', { name: 'api' });
  service.create('spaces', 'owner', { name: 'database', project: 'api' });
  service.ingest('owner', { text: 'retained', level: 3, time: 1, project: 'api' });
  service.remove('projects', 'owner', project.id);
  expect(service.list('spaces', 'owner')).toEqual([]);
  expect(repository.query('owner').records).toHaveLength(1);
});

it('supports a migration dry-run and refuses an occupied destination', () => {
  const file = join(root, 'export.json');
  writeFileSync(
    file,
    JSON.stringify([{ id: 'legacy-id', text: 'legacy', time: 1700000000000000, level: 3 }]),
  );
  expect(migrate(root, file, 'owner')).toMatchObject({ records: 1, applied: false });
  repository.close();
  expect(migrate(root, file, 'owner', true)).toMatchObject({ records: 1, applied: true });
  expect(() => migrate(root, file, 'owner', true)).toThrow('empty');
  expect(doctor(root)).toMatchObject({ records: 1 });
});

it('fully validates migration dry-runs and rolls back every collection on failure', () => {
  const file = join(root, 'invalid-export.json');
  writeFileSync(
    file,
    JSON.stringify({
      records: [{ text: 'legacy', time: 1700000000000000, level: 3 }],
      projects: [{ id: 'project', name: 'api' }],
      spaces: [{ id: 'space', name: 'database', project: 'missing-project' }],
    }),
  );
  expect(() => migrate(root, file, 'owner')).toThrow();
  expect(repository.list('projects', 'owner')).toEqual([]);
  repository.close();
  expect(() => migrate(root, file, 'owner', true)).toThrow();
  repository = new Repository(root);
  expect(repository.list('projects', 'owner')).toEqual([]);
  expect(repository.query('owner').records).toEqual([]);
});

it('preserves migrated relationship ids and token credentials without replaying alerts', () => {
  const file = join(root, 'collections.json');
  writeFileSync(
    file,
    JSON.stringify({
      records: [{ id: 'old-record', text: 'old failure', time: 1700000000000000, level: 5 }],
      projects: [{ id: 'project', name: 'api' }],
      spaces: [{ id: 'space', name: 'database', project: 'api' }],
      tokens: [{ id: 'token', name: 'old-worker', value: 'legacy-ingestion-token' }],
      testers: [
        {
          id: 'tester',
          name: 'request',
          project: 'api',
          suite: 'requests',
          scenario: 'success',
          configuration: {
            phases: [{ text: 'done' }],
            startDelay: 100,
            retryDelay: 100,
            timeout: 1000,
          },
        },
      ],
      notifiers: [
        {
          id: 'notifier',
          name: 'registrations',
          type: 'api',
          notifyOn: ['ENTITY_REGISTRATION'],
          data: { endpoint: 'http://127.0.0.1:3000' },
        },
      ],
      providers: [{ id: 'provider', name: 'code', type: 'github', token: 'legacy-provider' }],
      tests: [{ id: 'run', tester: 'tester', time: 1700000000, status: true, phasesStatus: [1] }],
    }),
  );
  repository.close();
  expect(migrate(root, file, 'owner', true)).toMatchObject({ records: 1, entities: 6, tests: 1 });
  repository = new Repository(root);
  service = new DelogService(repository);
  expect(repository.get('spaces', 'owner', 'space')).toMatchObject({ project: 'api' });
  expect(repository.get('tokens', 'owner', 'token')).toHaveProperty('hash');
  expect(repository.get('tokens', 'owner', 'token')).not.toHaveProperty('value');
  expect(repository.tests('owner')[0]).toMatchObject({ id: 'run', tester: 'tester' });
  expect(repository.db.prepare('SELECT count(*) AS count FROM outbox').get()?.count).toBe(0);
});

it('groups analytics into integer time buckets and scopes project and owner totals', () => {
  const hour = 3600000000;
  const previousHour = Math.floor((Date.now() * 1000) / hour) * hour - hour;
  service.ingest('owner', [
    { text: 'first', project: 'api', level: 3, time: previousHour + 1000000 },
    { text: 'second', project: 'api', level: 5, time: previousHour + 2000000 },
    { text: 'earlier', project: 'api', level: 3, time: previousHour - hour + 1000000 },
    { text: 'another project', project: 'worker', level: 5, time: previousHour },
  ]);
  service.ingest('other', { text: 'another owner', project: 'api', level: 5, time: previousHour });
  const analytics = service.analytics('owner', 'api', 'day');
  expect(analytics.total).toBe(3);
  expect(analytics.faults).toBe(1);
  expect(analytics.timeline).toEqual([
    { time: previousHour - hour, total: 1, faults: 0 },
    { time: previousHour, total: 2, faults: 1 },
  ]);
});
