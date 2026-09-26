import { resolve } from 'node:path';
import { DelogError, integer, text } from './errors.js';
import type { AccessPolicy } from './auth.js';

export interface DelogOptions {
  host?: string;
  port?: number;
  dataRoot?: string;
  mode?: 'private' | 'public' | 'custom';
  owner?: { identonym: string; key: string };
  ingestToken?: string;
  graphqlPath?: string;
  retentionDays?: number;
  accessPolicy?: AccessPolicy;
  serveAdmin?: boolean;
  trustProxy?: boolean | string | number;
  notificationIntervalMs?: number;
  onBackgroundError?: (error: unknown) => void;
}
export interface DelogConfig {
  host: string;
  port: number;
  dataRoot: string;
  mode: 'private' | 'public' | 'custom';
  owner: { identonym: string; key: string };
  ingestToken: string;
  graphqlPath: string;
  retentionDays: number;
  accessPolicy?: AccessPolicy;
  serveAdmin: boolean;
  trustProxy: boolean | string | number;
  notificationIntervalMs: number;
  onBackgroundError: (error: unknown) => void;
}
export function resolveConfig(
  options: DelogOptions = {},
  env: NodeJS.ProcessEnv = process.env,
): DelogConfig {
  const mode =
    options.mode ??
    env.DELOG_MODE ??
    (env.DELOG_CUSTOM_LOGIC_USAGE === 'true'
      ? 'custom'
      : env.DELOG_PRIVATE_USAGE === 'false'
        ? 'public'
        : 'private');
  if (!['private', 'public', 'custom'].includes(mode))
    throw new DelogError('CONFIGURATION', 'DELOG_MODE must be private, public, or custom.');
  if (mode === 'custom' && !options.accessPolicy)
    throw new DelogError('CONFIGURATION', 'Custom mode requires an accessPolicy.');
  const owner = options.owner ?? {
    identonym: env.DELOG_OWNER_IDENTONYM ?? env.DELOG_PRIVATE_OWNER_IDENTONYM ?? 'owner',
    key: env.DELOG_OWNER_KEY ?? env.DELOG_PRIVATE_OWNER_KEY ?? '',
  };
  if (mode !== 'custom' && !owner.key)
    throw new DelogError('CONFIGURATION', 'Set DELOG_OWNER_KEY before starting Delog.');
  const ingestToken =
    options.ingestToken ?? env.DELOG_INGEST_TOKEN ?? env.DELOG_PRIVATE_TOKEN ?? '';
  if (ingestToken && ingestToken === owner.key)
    throw new DelogError('CONFIGURATION', 'Owner password and ingestion token must be different.');
  const graphqlPath = options.graphqlPath ?? env.DELOG_ENDPOINT_GRAPHQL ?? '/graphql';
  if (
    !/^\/(?:[A-Za-z0-9_-]+\/?)*$/.test(graphqlPath) ||
    ['/api', '/health', '/ready'].includes(graphqlPath) ||
    graphqlPath.startsWith('/api/')
  )
    throw new DelogError(
      'CONFIGURATION',
      'GraphQL path must be an absolute URL path outside reserved routes.',
    );
  for (const key of ['DELOG_DATABASE_TYPE', 'DELOG_STORAGE_TYPE']) {
    if (env[key] && !['sqlite', 'filesystem'].includes(env[key]))
      throw new DelogError(
        'CONFIGURATION',
        `${key}=${env[key]} is legacy storage. Export and migrate it before starting the SQLite runtime.`,
      );
  }
  return {
    host: options.host ?? env.DELOG_HOST ?? '127.0.0.1',
    port: integer(options.port ?? Number(env.DELOG_PORT ?? env.PORT ?? 56965), 'port', 0, 65535),
    dataRoot: resolve(options.dataRoot ?? env.DELOG_DATA_ROOT ?? './data'),
    mode: mode as DelogConfig['mode'],
    owner: { identonym: text(owner.identonym, 'owner identonym'), key: owner.key },
    ingestToken,
    graphqlPath,
    retentionDays: integer(
      options.retentionDays ?? Number(env.DELOG_RETENTION_DAYS ?? 30),
      'retentionDays',
      0,
      36500,
    ),
    accessPolicy: options.accessPolicy,
    serveAdmin: options.serveAdmin ?? true,
    trustProxy: options.trustProxy ?? false,
    notificationIntervalMs: integer(
      options.notificationIntervalMs ?? 1000,
      'notificationIntervalMs',
      10,
      60000,
    ),
    onBackgroundError:
      options.onBackgroundError ??
      ((error) =>
        console.error(
          'Delog background operation failed:',
          error instanceof Error ? error.message : 'unknown error',
        )),
  };
}
