import { afterEach, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Repository } from './repository.js';
import { DelogService } from './service.js';
import { SourceService } from './source.js';

const directories: string[] = [];
const repositories: Repository[] = [];

afterEach(() => {
  vi.unstubAllGlobals();
  for (const repository of repositories.splice(0)) repository.close();
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

function setup() {
  const root = mkdtempSync(join(tmpdir(), 'delog-source-'));
  directories.push(root);
  const repository = new Repository(root);
  repositories.push(repository);
  const service = new DelogService(repository);
  const provider = service.create('providers', 'owner', {
    name: 'code',
    type: 'github',
    token: 'source-secret',
  });
  service.create('repositories', 'owner', {
    providerID: provider.id,
    nameWithOwner: 'cluster/api',
  });
  return new SourceService(repository);
}

it('reads a bounded source window using the fixed provider host and linked credentials', async () => {
  const source = setup();
  const fetcher = vi
    .fn<typeof fetch>()
    .mockResolvedValue(
      new Response(Array.from({ length: 100 }, (_, index) => `line ${index + 1}`).join('\n')),
    );
  vi.stubGlobal('fetch', fetcher);
  const result = await source.code('owner', {
    repository: { provider: 'github', name: 'cluster/api', branch: 'feature/example' },
    context: { file: 'src/file name.ts', line: 50 },
  });
  expect(result.startLine).toBe(30);
  expect(result.lines).toHaveLength(41);
  expect(result.lines[20]).toBe('line 50');
  expect(fetcher).toHaveBeenCalledWith(
    'https://api.github.com/repos/cluster/api/contents/src/file%20name.ts?ref=feature%2Fexample',
    expect.objectContaining({
      redirect: 'error',
      headers: expect.objectContaining({ Authorization: 'Bearer source-secret' }),
    }),
  );
});

it('rejects traversal, unlinked repositories, other owners, and oversized responses', async () => {
  const source = setup();
  const fetcher = vi.fn<typeof fetch>();
  vi.stubGlobal('fetch', fetcher);
  const input = {
    repository: { provider: 'github', name: 'cluster/api' },
    context: { file: '../secret', line: 1 },
  };
  await expect(source.code('owner', input)).rejects.toThrow('relative');
  await expect(source.code('other', input)).rejects.toThrow('Link');
  await expect(
    source.code('owner', { ...input, repository: { provider: 'github', name: 'other/repo' } }),
  ).rejects.toThrow('Link');
  expect(fetcher).not.toHaveBeenCalled();
  fetcher.mockResolvedValue(new Response('x'.repeat(2000001)));
  await expect(
    source.code('owner', { ...input, context: { file: 'file.ts', line: 1 } }),
  ).rejects.toThrow('2 MB');
});
