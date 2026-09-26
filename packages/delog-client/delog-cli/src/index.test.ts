import { afterEach, expect, it, vi } from 'vitest';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createProgram } from './index.js';
import { createDelog, type DelogApplication } from '../../../delog-server/src/application.js';

let directory: string | undefined;
let application: DelogApplication | undefined;

afterEach(async () => {
  await application?.close();
  if (directory) await rm(directory, { recursive: true, force: true });
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

it('signs in, records through a server origin, and revokes the saved session on logout', async () => {
  directory = await mkdtemp(join(tmpdir(), 'delog-cli-'));
  const path = join(directory, 'config.json');
  vi.stubEnv('DELOG_CONFIG', path);
  vi.stubEnv('DELOG_OWNER_KEY', 'cli-owner-password');
  vi.spyOn(console, 'log').mockImplementation(() => {});
  application = createDelog({
    dataRoot: join(directory, 'data'),
    port: 0,
    owner: { identonym: 'owner', key: 'cli-owner-password' },
    retentionDays: 0,
  });
  const url = await application.start();
  const run = (...args: string[]) => createProgram().parseAsync(args, { from: 'user' });
  await run('login', '--server', url);
  const raw = await readFile(path, 'utf8');
  expect(raw).not.toContain('cli-owner-password');
  expect((await stat(path)).mode & 0o777).toBe(0o600);
  const configuration = JSON.parse(raw);
  const token = configuration.profiles[configuration.default].token;
  await run('record', 'CLI record', '--level', 'error');
  const response = await fetch(url + '/api/records', {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect((await response.json()).records[0]).toMatchObject({ text: 'CLI record', level: 5 });
  await run('status');
  await run('logout');
  expect(
    (await fetch(url + '/api/records', { headers: { Authorization: `Bearer ${token}` } })).status,
  ).toBe(401);
  expect(JSON.parse(await readFile(path, 'utf8')).profiles).toEqual({});
});
