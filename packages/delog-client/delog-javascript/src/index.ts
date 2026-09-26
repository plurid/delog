import {
  RECORD_MUTATION,
  delogLevels,
  delogLevelsText,
  type DelogInputRecord,
  type DelogInputRecordContext,
  type DelogLevel,
  type SourceContext,
} from '@plurid/delog-contracts';
export * from '@plurid/delog-contracts';

export const DELOG_GROUND_LEVEL_NONE = 7;
export const DELOG_GROUND_LEVEL_ALL = 0;
export const DELOG_LEVEL_FATAL = 6;
export const DELOG_LEVEL_ERROR = 5;
export const DELOG_LEVEL_WARN = 4;
export const DELOG_LEVEL_INFO = 3;
export const DELOG_LEVEL_DEBUG = 2;
export const DELOG_LEVEL_TRACE = 1;
export type DelogLevels = typeof delogLevels;
export type DelogTestingContext = Omit<DelogInputRecordContext, 'call' | 'sharedOrder'>;
export interface DelogContextCall {
  depth?: number;
  repository?: Partial<SourceContext['repository']>;
  caller?: SourceContext['caller'];
}
export interface DelogContext extends Omit<DelogInputRecordContext, 'call'> {
  call?: DelogContextCall;
}
export type DelogContextCallRepository = Partial<SourceContext['repository']>;
export interface ClientOptions {
  endpoint?: string;
  token?: string;
  project?: string;
  space?: string;
  format?: string;
  groundLevel?: number | DelogLevel;
  context?: DelogContext;
  consoleFallback?: boolean;
  quiet?: boolean;
  timeoutMs?: number;
  fetch?: typeof globalThis.fetch;
}
export interface DelogData extends ClientOptions {
  text: string;
  level?: number | DelogLevel;
  time?: number;
  unit?: DelogInputRecord['unit'];
  tester?: boolean;
  method?: string;
  error?: unknown;
  extradata?: string;
  graphqlClient?: {
    mutate: (options: { mutation: unknown; variables: { input: DelogInputRecord } }) => Promise<{
      data?: { delogMutationRecord?: { status: boolean; error?: { message?: string } } };
    }>;
  };
}
export type RequiredDelogData = Omit<DelogData, 'level' | 'error'> & {
  endpoint: string;
  token: string;
  time: number;
  unit: NonNullable<DelogInputRecord['unit']>;
  level: number;
  groundLevel: number;
  consoleFallback: boolean;
  error?: string;
};
export class DelogClientError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'DelogClientError';
  }
}
export function stringifyError(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (value instanceof Error) {
    const seen = new WeakSet<object>();
    return JSON.stringify(
      { name: value.name, message: value.message, stack: value.stack, cause: value.cause },
      (_key, item: unknown) => {
        if (typeof item === 'bigint') return String(item);
        if (item && typeof item === 'object') {
          if (seen.has(item)) return '[Circular]';
          seen.add(item);
        }
        return item;
      },
    );
  }
  try {
    return (
      JSON.stringify(value, (_key, item) => (typeof item === 'bigint' ? String(item) : item)) ??
      String(value)
    );
  } catch {
    return String(value);
  }
}
const environment = (): Record<string, string | undefined> =>
  typeof process === 'undefined' ? {} : process.env;
const levelNumber = (value: number | DelogLevel | undefined, fallback: number, max = 6): number => {
  const result = typeof value === 'string' ? delogLevels[value] : (value ?? fallback);
  if (!Number.isInteger(result) || result < 0 || result > max)
    throw new DelogClientError(`Level must be between 0 and ${max}.`);
  return result;
};
function defaults(): ClientOptions {
  const env = environment();
  const ground = env.DELOG_GROUND_LEVEL;
  return {
    endpoint: env.DELOG_ENDPOINT,
    token: env.DELOG_TOKEN,
    project: env.DELOG_PROJECT,
    space: env.DELOG_SPACE,
    format: env.DELOG_FORMAT,
    groundLevel:
      ground && ground in delogLevels ? (ground as DelogLevel) : ground ? Number(ground) : 0,
    consoleFallback: env.DELOG_CONSOLE_FALLBACK === 'true',
    quiet: env.DELOG_QUIET === 'true',
  };
}
function callContext(
  call: DelogContextCall | undefined,
  stack: string | undefined,
): SourceContext | undefined {
  const env = environment();
  if (!call && env.DELOG_CALL_CONTEXT !== 'true') return undefined;
  const repository = {
    provider: env.DELOG_REPOSITORY_PROVIDER ?? '',
    name: env.DELOG_REPOSITORY_NAME ?? '',
    branch: env.DELOG_REPOSITORY_BRANCH ?? '',
    commit: env.DELOG_REPOSITORY_COMMIT ?? '',
    basePath: env.DELOG_REPOSITORY_BASEPATH ?? '',
    ...call?.repository,
  };
  if (call?.caller) return { repository, caller: call.caller };
  const frames =
    stack
      ?.split('\n')
      .filter((line) => /:(\d+):(\d+)\)?$/.test(line))
      .slice(call?.depth ?? 1) ?? [];
  const frame = frames.find(
    (line) => !line.includes('delog-javascript/') && !line.includes('/@plurid/delog/'),
  );
  const match = frame?.match(/(?:at .*?\(|at )(.*):(\d+):(\d+)\)?$/);
  if (!match) return undefined;
  let file = match[1]!.replace(/^file:\/\//, '');
  if (
    repository.basePath &&
    repository.basePath !== '__MATCH_CUT__' &&
    file.startsWith(repository.basePath.replace(/\/$/, '') + '/')
  )
    file = file.slice(repository.basePath.replace(/\/$/, '').length + 1);
  return { repository, caller: { file, line: Number(match[2]), column: Number(match[3]) } };
}
function makeRecord(value: DelogData, stack?: string): DelogInputRecord {
  const input: DelogInputRecord = {
    text: value.text,
    time: value.time ?? Date.now() * 1000,
    unit: value.unit ?? 'us',
    level: levelNumber(value.level, 3),
  };
  if (input.level < 1) throw new DelogClientError('Record level must be between 1 and 6.');
  if (typeof input.text !== 'string' || !Number.isFinite(input.time))
    throw new DelogClientError('Record requires text and a finite timestamp.');
  for (const field of ['project', 'space', 'format', 'method', 'extradata'] as const)
    if (value[field] !== undefined) input[field] = value[field];
  if (value.error !== undefined) input.error = stringifyError(value.error);
  const call = callContext(value.context?.call, stack);
  if (value.context || call) {
    const { call: _call, ...context } = value.context ?? {};
    input.context = { ...context, ...(call ? { call } : {}) };
  }
  return input;
}
function endpoint(value: string | undefined): string {
  if (!value) throw new DelogClientError('An endpoint is required.');
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new DelogClientError('Endpoint must be an absolute HTTP(S) URL.');
  }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password)
    throw new DelogClientError('Endpoint must use HTTP(S) without URL credentials.');
  return url.href;
}
export function createDelogClient(options: ClientOptions = {}) {
  const config = { ...defaults(), ...options };
  const pending = new Set<Promise<boolean>>();
  async function send(data: string | DelogData, stack?: string): Promise<boolean> {
    const value: DelogData =
      typeof data === 'string'
        ? { ...config, text: data }
        : { ...config, ...data, context: { ...config.context, ...data.context } };
    if (value.tester && value.context?.mode !== 'TESTING') return false;
    const level = levelNumber(value.level, 3);
    if (levelNumber(value.groundLevel, 0, 7) > level) return false;
    const input = makeRecord(value, stack);
    if (value.consoleFallback) {
      console.log(
        `[${delogLevelsText[level as keyof typeof delogLevelsText]} ${new Date(input.time / (input.unit === 's' ? 0.001 : input.unit === 'ms' ? 1 : 1000)).toISOString()}] ${input.text}${input.error ? ' · ' + input.error : ''}`,
      );
      return true;
    }
    if (value.graphqlClient) {
      // A tiny DocumentNode keeps the legacy injected Apollo client usable without
      // making Apollo (or React) dependencies of the logging client.
      const { parse } = await import('graphql');
      const result = await value.graphqlClient.mutate({
        mutation: parse(RECORD_MUTATION),
        variables: { input },
      });
      if (!result.data?.delogMutationRecord?.status)
        throw new DelogClientError(
          result.data?.delogMutationRecord?.error?.message ?? 'Server rejected the record.',
        );
      return true;
    }
    const timeout = value.timeoutMs ?? 10000;
    if (!Number.isInteger(timeout) || timeout < 1 || timeout > 300000)
      throw new DelogClientError('timeoutMs must be 1–300000.');
    const response = await (value.fetch ?? globalThis.fetch)(endpoint(value.endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(value.token ? { Authorization: `Bearer ${value.token}` } : {}),
      },
      body: JSON.stringify({ query: RECORD_MUTATION, variables: { input } }),
      signal: AbortSignal.timeout(timeout),
      redirect: 'error',
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new DelogClientError(`Delog returned HTTP ${response.status}.`, response.status);
    }
    const result = (await response.json()) as {
      errors?: { message: string }[];
      data?: { delogMutationRecord?: { status: boolean; error?: { message?: string } } };
    };
    if (result.errors?.length || !result.data?.delogMutationRecord?.status)
      throw new DelogClientError(
        result.errors?.[0]?.message ??
          result.data?.delogMutationRecord?.error?.message ??
          'Server rejected the record.',
      );
    return true;
  }
  function record(data: string | DelogData): Promise<boolean> {
    const promise = send(data, new Error().stack);
    pending.add(promise);
    void promise.then(
      () => pending.delete(promise),
      () => pending.delete(promise),
    );
    return promise;
  }
  const withLevel = (level: DelogLevel) => (data: string | Omit<DelogData, 'level'>) =>
    record(typeof data === 'string' ? { text: data, level } : { ...data, level });
  return {
    record,
    log: record,
    trace: withLevel('trace'),
    debug: withLevel('debug'),
    info: withLevel('info'),
    warn: withLevel('warn'),
    error: withLevel('error'),
    fatal: withLevel('fatal'),
    async flush() {
      const results = await Promise.allSettled([...pending]);
      const errors = results
        .filter((result) => result.status === 'rejected')
        .map((result) => result.reason);
      if (errors.length) throw new AggregateError(errors, 'Some records failed.');
    },
    child(childOptions: ClientOptions) {
      return createDelogClient({
        ...config,
        ...childOptions,
        context: { ...config.context, ...childOptions.context },
      });
    },
  };
}
export async function delog(data: string | DelogData): Promise<true | undefined> {
  try {
    return (await createDelogClient().record(data)) ? true : undefined;
  } catch (error) {
    if (!(typeof data === 'object' ? (data.quiet ?? defaults().quiet) : defaults().quiet))
      console.error('Delog Error :: ' + (error instanceof Error ? error.message : String(error)));
    return undefined;
  }
}
export default delog;
