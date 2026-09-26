import { expect, it } from 'vitest';
import { mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { Repository } from './repository.js';
import { DelogService } from './service.js';
import { backupDatabase } from './operations.js';

it('backs up committed WAL data and preserves an existing destination', async () => {
  const root = mkdtempSync(join(tmpdir(), 'delog-backup-'));
  const repository = new Repository(root);
  const destination = join(root, 'backup.sqlite');
  try {
    new DelogService(repository).ingest('owner', { text: 'durable', level: 3, time: 1 });
    await backupDatabase(root, destination);
    expect(statSync(destination).mode & 0o777).toBe(0o600);
    await expect(backupDatabase(root, destination)).rejects.toThrow();
    const backup = new DatabaseSync(destination, { readOnly: true });
    try {
      expect(backup.prepare('SELECT count(*) AS count FROM records').get()?.count).toBe(1);
      expect(backup.prepare('PRAGMA quick_check').get()?.quick_check).toBe('ok');
    } finally {
      backup.close();
    }
  } finally {
    repository.close();
    rmSync(root, { recursive: true, force: true });
  }
});

it('rejects an unknown schema before changing its tables or indexes', () => {
  const root = mkdtempSync(join(tmpdir(), 'delog-future-schema-'));
  const file = join(root, 'delog.sqlite');
  const future = new DatabaseSync(file);
  future.exec('CREATE TABLE metadata (key TEXT, value TEXT)');
  future.prepare('INSERT INTO metadata VALUES (?,?)').run('schema', '2');
  future.close();
  try {
    expect(() => new Repository(root)).toThrow('Unsupported database schema');
    const inspection = new DatabaseSync(file, { readOnly: true });
    try {
      expect(inspection.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()).toEqual(
        [{ name: 'metadata' }],
      );
    } finally {
      inspection.close();
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
