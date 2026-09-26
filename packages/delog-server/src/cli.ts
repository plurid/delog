#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { createDelog } from './application.js';
import { backupDatabase, doctor, migrate } from './operations.js';
import { Repository } from './repository.js';

async function main(): Promise<void> {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      'data-root': { type: 'string' },
      owner: { type: 'string' },
      apply: { type: 'boolean' },
      days: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
  });
  const [command = 'serve', file] = positionals;
  const root = resolve(values['data-root'] ?? process.env.DELOG_DATA_ROOT ?? './data');
  if (values.help) {
    console.log(
      'delog-server serve | doctor | backup <file> | migrate <export.json> --owner <owner> [--apply] | prune --days <days> [--apply]\nAll commands accept --data-root. Migration and pruning default to dry-run.',
    );
    return;
  }
  if (command === 'doctor') {
    console.log(JSON.stringify(doctor(root), null, 2));
    return;
  }
  if (command === 'backup') {
    if (!file) throw new Error('Supply a backup destination.');
    await backupDatabase(root, resolve(file));
    console.log('Backup completed.');
    return;
  }
  if (command === 'migrate') {
    if (!file || !values.owner) throw new Error('Supply an export file and --owner.');
    console.log(JSON.stringify(migrate(root, resolve(file), values.owner, values.apply), null, 2));
    return;
  }
  if (command === 'prune') {
    const days = Number(values.days);
    if (!Number.isInteger(days) || days < 1 || days > 36500)
      throw new Error('--days must be 1–36500.');
    const repo = new Repository(root);
    try {
      const cutoff = Date.now() - days * 86400000;
      const count = repo.db
        .prepare(
          'SELECT count(*) AS count FROM records WHERE received_at<? AND NOT EXISTS (SELECT 1 FROM test_runs WHERE test_runs.owner=records.owner AND test_runs.id=records.shared_id)',
        )
        .get(cutoff)?.count;
      console.log(
        JSON.stringify({
          eligible: Number(count),
          deleted: values.apply ? repo.prune(days) : 0,
          applied: values.apply ?? false,
        }),
      );
    } finally {
      repo.close();
    }
    return;
  }
  if (command !== 'serve') throw new Error(`Unknown command ${command}. Use --help.`);
  const application = createDelog({ dataRoot: root });
  const url = await application.start();
  console.log(`Delog listening on ${url}`);
  const shutdown = () => {
    process.off('SIGINT', shutdown);
    process.off('SIGTERM', shutdown);
    void application.close().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
