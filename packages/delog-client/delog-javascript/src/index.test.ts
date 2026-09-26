import { afterEach, expect, it, vi } from 'vitest';
import delog, { createDelogClient, stringifyError } from './index.js';

afterEach(() => vi.unstubAllEnvs());

function receiver() {
  const inputs: Record<string, unknown>[] = [];
  const fetcher: typeof fetch = async (_url, init) => {
    inputs.push(JSON.parse(String(init?.body)).variables.input);
    return Response.json({ data: { delogMutationRecord: { status: true } } });
  };
  return { inputs, fetcher };
}

it('copies child context, maps severities, and filters before network activity', async () => {
  const { inputs, fetcher } = receiver();
  const context = { sharedID: 'run', mode: 'TESTING' as const };
  const client = createDelogClient({
    endpoint: 'http://localhost/graphql',
    fetch: fetcher,
    project: 'api',
    groundLevel: 'warn',
    context,
  });
  expect(await client.info('filtered')).toBe(false);
  await client.child({ space: 'database' }).error('failed');
  await client.warn('slow');
  await client.flush();
  expect(inputs).toHaveLength(2);
  expect(inputs[0]).toMatchObject({
    level: 5,
    project: 'api',
    space: 'database',
    unit: 'us',
    context,
  });
  expect(inputs[1]).not.toHaveProperty('space');
  expect(context).toEqual({ sharedID: 'run', mode: 'TESTING' });
});

it('reports HTTP and GraphQL rejection through the explicit client', async () => {
  for (const response of [
    new Response('', { status: 401 }),
    Response.json({ errors: [{ message: 'forbidden' }] }),
    Response.json({ data: { delogMutationRecord: { status: false } } }),
  ]) {
    const client = createDelogClient({
      endpoint: 'http://localhost/graphql',
      fetch: async () => response,
    });
    await expect(client.info('test')).rejects.toThrow();
  }
});

it('reads environment defaults at call time and keeps the legacy wrapper nonthrowing', async () => {
  vi.stubEnv('DELOG_ENDPOINT', 'http://localhost/graphql');
  vi.stubEnv('DELOG_PROJECT', 'dynamic-project');
  const { inputs, fetcher } = receiver();
  expect(await delog({ text: 'legacy', fetch: fetcher })).toBe(true);
  expect(inputs[0]).toHaveProperty('project', 'dynamic-project');
  expect(
    await delog({
      text: 'offline',
      quiet: true,
      fetch: async () => {
        throw new Error('offline');
      },
    }),
  ).toBeUndefined();
});

it('serializes errors with circular causes', () => {
  const error = new Error('database offline');
  error.cause = error;
  expect(stringifyError(error)).toContain('database offline');
  expect(stringifyError(error)).toContain('[Circular]');
});
