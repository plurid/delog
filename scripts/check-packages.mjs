import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pnpm = join(root, 'node_modules/pnpm/bin/pnpm.mjs');
const temporary = mkdtempSync(join(tmpdir(), 'delog-packages-'));
const packages = [
  ['@plurid/delog-contracts', 'packages/delog-contracts'],
  ['@plurid/delog', 'packages/delog-client/delog-javascript'],
  ['@plurid/delog-cli', 'packages/delog-client/delog-cli'],
  ['@plurid/delog-server', 'packages/delog-server'],
];

function run(executable, args, cwd = root) {
  const result = spawnSync(executable, args, { cwd, encoding: 'utf8', timeout: 120000 });
  if (result.error || result.status !== 0) {
    throw new Error(
      result.error?.message ?? `${executable} failed:\n${result.stdout}\n${result.stderr}`,
    );
  }
  return result.stdout;
}

try {
  const dependencies = {};
  for (const [name, directory] of packages) {
    const archive = join(temporary, name.replace('@', '').replace('/', '-') + '.tgz');
    run(process.execPath, [pnpm, 'pack', '--out', archive], join(root, directory));
    const manifest = JSON.parse(run('tar', ['-xOf', archive, 'package/package.json']));
    assert.equal(manifest.name, name);
    for (const version of Object.values(manifest.dependencies ?? {})) {
      assert(!version.startsWith('workspace:') && !version.startsWith('catalog:'));
    }
    const entries = run('tar', ['-tzf', archive]).split('\n');
    assert(entries.some((entry) => entry.endsWith('build/index.mjs')));
    assert(entries.some((entry) => entry.endsWith('build/index.cjs')));
    assert(entries.some((entry) => entry.endsWith('build/index.d.mts')));
    assert(!entries.some((entry) => /(?:\.env|\.sqlite|\/src\/|\.test\.)/.test(entry)));
    dependencies[name] = 'file:' + archive;
  }

  const consumer = join(temporary, 'consumer');
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify(
      {
        name: 'delog-package-smoke',
        private: true,
        type: 'module',
        packageManager: 'pnpm@11.25.0',
        dependencies,
      },
      null,
      2,
    ),
  );
  writeFileSync(
    join(consumer, 'pnpm-workspace.yaml'),
    JSON.stringify({ overrides: dependencies }, null, 2),
  );
  run(
    process.execPath,
    [pnpm, 'install', '--offline', '--ignore-scripts', '--store-dir', join(root, '.pnpm-store')],
    consumer,
  );

  const smoke = `
    import assert from 'node:assert/strict';
    import { createRequire } from 'node:module';
    import { existsSync } from 'node:fs';
    import delog, { createDelogClient } from '@plurid/delog';
    import server, { createDelog } from '@plurid/delog-server';
    import { createProgram } from '@plurid/delog-cli';
    import { delogLevels } from '@plurid/delog-contracts';
    const require = createRequire(import.meta.url);
    for (const name of ${JSON.stringify(packages.map(([name]) => name))}) {
      assert(require(name));
    }
    assert.equal(typeof delog, 'function');
    assert.equal(typeof createDelogClient, 'function');
    assert.equal(typeof createDelog, 'function');
    assert.equal(typeof createProgram, 'function');
    assert.equal(server.instance, undefined);
    assert.equal(delogLevels.error, 5);
    assert.equal(existsSync('data'), false);
    const response = await delog({text: 'package smoke', consoleFallback: true});
    assert.equal(response, true);
  `;
  writeFileSync(join(consumer, 'smoke.mjs'), smoke);
  run(process.execPath, ['smoke.mjs'], consumer);
  writeFileSync(
    join(consumer, 'smoke.ts'),
    `
    import { createDelog, type AccessPolicy } from '@plurid/delog-server';
    import { createDelogClient, type DelogData } from '@plurid/delog';
    import { createProgram } from '@plurid/delog-cli';
    const policy: AccessPolicy = {
      authenticate: async () => null,
      authorize: () => false,
    };
    const application = createDelog({mode: 'custom', accessPolicy: policy});
    const record: DelogData = {text: 'typed'};
    const client = createDelogClient();
    void application;
    void record;
    void client;
    void createProgram;
  `,
  );
  writeFileSync(
    join(consumer, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2024',
          module: 'NodeNext',
          strict: true,
          noEmit: true,
          skipLibCheck: false,
        },
        files: ['smoke.ts'],
      },
      null,
      2,
    ),
  );
  run(
    process.execPath,
    [join(root, 'node_modules/@typescript/native/bin/tsc'), '-p', join(consumer, 'tsconfig.json')],
    consumer,
  );
  const cli = run(
    process.execPath,
    ['node_modules/@plurid/delog-cli/build/cli.mjs', '--version'],
    consumer,
  );
  assert.equal(cli.trim(), '0.2.0');
  const help = run(
    process.execPath,
    ['node_modules/@plurid/delog-server/build/cli.mjs', '--help'],
    consumer,
  );
  assert(help.includes('migrate'));
  const serverManifest = JSON.parse(
    readFileSync(join(consumer, 'node_modules/@plurid/delog-server/package.json')),
  );
  assert.equal(serverManifest.bin['delog-server'], './build/cli.mjs');
  console.log(
    'All four tarballs install offline; ESM, CommonJS, declarations, and CLI entry points pass.',
  );
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
