import type { Entity } from '@plurid/delog-contracts';
import { DelogError, integer, object, text } from './errors.js';
import type { Repository } from './repository.js';

async function boundedText(response: globalThis.Response, max = 2000000): Promise<string> {
  if (!response.ok) {
    await response.body?.cancel();
    throw new DelogError(
      'PROVIDER_ERROR',
      `Source provider returned HTTP ${response.status}.`,
      502,
    );
  }
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > max)
        throw new DelogError('SOURCE_TOO_LARGE', 'Source response exceeds 2 MB.', 413);
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(chunks).toString('utf8');
}
export class SourceService {
  constructor(private repository: Repository) {}
  private request(
    provider: Entity,
    url: string,
    accept = 'application/json',
  ): Promise<globalThis.Response> {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${String(provider.token)}`,
        Accept: accept,
        'User-Agent': 'delog/0.2',
      },
      signal: AbortSignal.timeout(10000),
      redirect: 'error',
    });
  }
  async repositories(owner: string, providerID: string): Promise<Entity[]> {
    const provider = this.repository.get('providers', owner, providerID);
    if (!provider) throw new DelogError('NOT_FOUND', 'Provider not found.', 404);
    const endpoint =
      provider.type === 'github'
        ? 'https://api.github.com/user/repos?per_page=100&sort=updated'
        : 'https://api.bitbucket.org/2.0/repositories?role=member&pagelen=100';
    const parsed: unknown = JSON.parse(await boundedText(await this.request(provider, endpoint)));
    const values = provider.type === 'github' ? parsed : object(parsed).values;
    if (!Array.isArray(values))
      throw new DelogError('PROVIDER_ERROR', 'Invalid provider response.', 502);
    return values.map((item) => {
      const repository = object(item);
      return {
        id: String(repository.id ?? repository.uuid),
        name: String(repository.full_name),
        isPrivate: Boolean(repository.private ?? repository.is_private),
      };
    });
  }
  async code(owner: string, input: unknown): Promise<{ lines: string[]; startLine: number }> {
    const value = object(input);
    const source = object(value.repository);
    const context = object(value.context);
    const name = text(source.name, 'repository', 512);
    const linked = this.repository.list('repositories', owner).find(
      (repository) =>
        repository.name === name &&
        (() => {
          const p = this.repository.get('providers', owner, String(repository.providerID));
          return p && [p.id, p.name, p.type].includes(source.provider);
        })(),
    );
    if (!linked)
      throw new DelogError(
        'NOT_FOUND',
        'Link this source repository before reading its files.',
        404,
      );
    const provider = this.repository.get('providers', owner, String(linked.providerID))!;
    const file = text(context.file, 'file', 2048).replace(/\\/g, '/');
    if (
      file.startsWith('/') ||
      file.split('/').some((part) => part === '..' || part === '.' || !part) ||
      [...file].some((character) => character.charCodeAt(0) < 32)
    )
      throw new DelogError('INVALID_INPUT', 'Source path must be relative to the repository.');
    const ref = text(source.commit || source.branch || 'HEAD', 'revision', 256);
    const encodedFile = file.split('/').map(encodeURIComponent).join('/');
    const url =
      provider.type === 'github'
        ? `https://api.github.com/repos/${name}/contents/${encodedFile}?ref=${encodeURIComponent(ref)}`
        : `https://api.bitbucket.org/2.0/repositories/${name}/src/${encodeURIComponent(ref)}/${encodedFile}`;
    const content = await boundedText(
      await this.request(
        provider,
        url,
        provider.type === 'github' ? 'application/vnd.github.raw+json' : 'text/plain',
      ),
    );
    const lines = content.split('\n');
    const line = integer(context.line, 'line', 1, 10000000);
    const startLine = Math.max(1, line - 20);
    return { lines: lines.slice(startLine - 1, line + 20), startLine };
  }
}
