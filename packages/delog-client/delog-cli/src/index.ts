import { Command } from 'commander';
import { mkdir, readFile, writeFile, rename, chmod } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { createInterface } from 'node:readline';
import { createDelogClient, type DelogData, type DelogLevel } from '@plurid/delog';

interface Profile {
  server: string;
  identonym: string;
  token?: string;
  format?: string;
}
interface Configuration {
  version: 1;
  default?: string;
  profiles: Record<string, Profile>;
}
const configPath = () =>
  process.env.DELOG_CONFIG ??
  join(process.env.XDG_CONFIG_HOME ?? join(homedir(), '.config'), 'delog', 'config.json');
async function readConfiguration(): Promise<Configuration> {
  try {
    const data = JSON.parse(await readFile(configPath(), 'utf8')) as Configuration;
    if (data.version !== 1 || !data.profiles) throw new Error('Unsupported CLI configuration.');
    return data;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')
      return { version: 1, profiles: {} };
    throw error;
  }
}
async function writeConfiguration(configuration: Configuration): Promise<void> {
  const path = configPath();
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const temporary = `${path}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(configuration, null, 2) + '\n', { mode: 0o600 });
  await chmod(temporary, 0o600);
  await rename(temporary, path);
}
function api(server: string, path: string): string {
  const url = new URL(server);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password)
    throw new Error('Server must be an HTTP(S) URL without credentials.');
  return new URL('/api/' + path, url).href;
}
async function request(
  server: string,
  path: string,
  method = 'GET',
  token?: string,
  body?: unknown,
): Promise<Record<string, unknown>> {
  const response = await fetch(api(server, path), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(10000),
    redirect: 'error',
  });
  const value = (await response.json()) as Record<string, unknown>;
  if (!response.ok)
    throw new Error(
      (value.error as { message?: string } | undefined)?.message ??
        `Server returned HTTP ${response.status}.`,
    );
  return value;
}
async function profile(options: {
  server?: string;
  identonym?: string;
  token?: string;
}): Promise<Profile> {
  const config = await readConfiguration();
  const selected = Object.values(config.profiles).find(
    (item) =>
      (options.server ? item.server === options.server : true) &&
      (options.identonym ? item.identonym === options.identonym : true) &&
      (options.server || options.identonym),
  );
  const current = selected ?? (config.default ? config.profiles[config.default] : undefined);
  const server = options.server ?? process.env.DELOG_ENDPOINT ?? current?.server;
  if (!server) throw new Error('Supply --server, set DELOG_ENDPOINT, or run delog login.');
  return {
    server,
    identonym: options.identonym ?? current?.identonym ?? 'owner',
    token:
      options.token ??
      process.env.DELOG_TOKEN ??
      (current?.server === server ? current.token : undefined),
    format: current?.format,
  };
}
export function createProgram(): Command {
  const program = new Command()
    .name('delog')
    .description('Centralized logging for your local cluster')
    .version('0.2.0', '-v, --version');
  program
    .command('login')
    .description('Sign in and store a session, never your password')
    .requiredOption('-s, --server <server>')
    .option('-i, --identonym <identonym>', 'owner identonym', 'owner')
    .option('-k, --key <key>', 'owner key (or DELOG_OWNER_KEY)')
    .action(async (options: { server: string; identonym: string; key?: string }) => {
      const key = options.key ?? process.env.DELOG_OWNER_KEY;
      if (!key) throw new Error('Set DELOG_OWNER_KEY or supply --key.');
      const result = await request(options.server, 'session', 'POST', undefined, {
        identonym: options.identonym,
        key,
      });
      const config = await readConfiguration();
      const id = `${options.server}|${options.identonym}`;
      config.profiles[id] = {
        server: options.server,
        identonym: options.identonym,
        token: String(result.token),
      };
      config.default = id;
      await writeConfiguration(config);
      console.log(`Signed in to ${new URL(options.server).host} as ${options.identonym}.`);
    });
  program
    .command('logout')
    .option('-s, --server <server>')
    .option('-i, --identonym <identonym>')
    .action(async (options: { server?: string; identonym?: string }) => {
      const selected = await profile(options);
      await request(selected.server, 'session', 'DELETE', selected.token);
      const config = await readConfiguration();
      const id = `${selected.server}|${selected.identonym}`;
      delete config.profiles[id];
      if (config.default === id) delete config.default;
      await writeConfiguration(config);
      console.log('Signed out.');
    });
  program
    .command('setup')
    .option('-s, --server <server>')
    .option('-i, --identonym <identonym>')
    .option('-d, --default <default>')
    .option('-f, --format <format>')
    .action(
      async (options: {
        server?: string;
        identonym?: string;
        default?: string;
        format?: string;
      }) => {
        const selected = await profile(options);
        const config = await readConfiguration();
        const id = `${selected.server}|${selected.identonym}`;
        config.profiles[id] = {
          ...selected,
          ...(options.format ? { format: options.format } : {}),
        };
        if (options.default === 'true' || !config.default) config.default = id;
        await writeConfiguration(config);
        console.log('Configuration saved.');
      },
    );
  program
    .command('status')
    .option('-s, --server <server>')
    .option('-k, --token <token>')
    .action(async (options: { server?: string; token?: string }) => {
      const selected = await profile(options);
      const status = await request(selected.server, 'session', 'GET', selected.token);
      if (!status.role) throw new Error('Not authenticated.');
      console.log(
        JSON.stringify(
          { server: selected.server, owner: status.owner, role: status.role },
          null,
          2,
        ),
      );
    });
  program
    .command('record')
    .argument('[message]')
    .option('-t, --text <text>')
    .option('--stdin', 'read one record per input line')
    .option('--server <server>')
    .option('--identonym <identonym>')
    .option('-k, --token <token>')
    .option('-l, --level <level>', 'severity', 'info')
    .option('-p, --project <project>')
    .option('-s, --space <space>')
    .option('-f, --format <format>')
    .option('-m, --method <method>')
    .option('-e, --error <error>')
    .option('-x, --extradata <extradata>')
    .option('-c, --context <context>', 'JSON context')
    .option('-r, --tester [tester]')
    .action(
      async (
        message: string | undefined,
        options: Record<string, string | boolean | undefined>,
      ) => {
        const selected = await profile(
          options as { server?: string; token?: string; identonym?: string },
        );
        const endpoint = new URL(selected.server);
        if (endpoint.pathname === '/') {
          const configuration = await request(selected.server, 'config');
          endpoint.pathname = String(configuration.graphqlPath ?? '/graphql');
        }
        const client = createDelogClient({
          endpoint: endpoint.href,
          token: selected.token,
          format: typeof options.format === 'string' ? options.format : selected.format,
        });
        const data: Omit<DelogData, 'text'> = {
          level: /^[1-6]$/.test(String(options.level))
            ? Number(options.level)
            : (options.level as DelogLevel),
        };
        for (const field of ['project', 'space', 'method', 'error', 'extradata'] as const)
          if (typeof options[field] === 'string') data[field] = options[field];
        if (options.context)
          data.context = JSON.parse(String(options.context)) as DelogData['context'];
        data.tester = options.tester === true || options.tester === 'true';
        if (options.stdin) {
          const lines = createInterface({ input: process.stdin, crlfDelay: Infinity });
          for await (const line of lines) await client.record({ ...data, text: line });
        } else {
          const value = options.text ?? message;
          if (typeof value !== 'string')
            throw new Error('Supply text with -t, a message, or --stdin.');
          await client.record({ ...data, text: value });
        }
        await client.flush();
      },
    );
  return program;
}
export async function cli(argv = process.argv): Promise<void> {
  await createProgram().parseAsync(argv);
}
