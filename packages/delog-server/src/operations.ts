import {
  closeSync,
  existsSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync, backup } from 'node:sqlite';
import {
  entityKinds,
  type Entity,
  type LoggedRecord,
  type TestResult,
} from '@plurid/delog-contracts';
import { Repository } from './repository.js';
import { DelogService, normalizeRecord } from './service.js';
import { DelogError, integer, object, text } from './errors.js';
import { hash } from './auth.js';

export function doctor(root: string): Record<string, unknown> {
  const path = join(root, 'delog.sqlite');
  const lock = join(root, '.delog.lock');
  let lockStatus: unknown = null;
  if (existsSync(lock)) {
    try {
      const data = object(JSON.parse(readFileSync(lock, 'utf8')));
      let alive = false;
      try {
        process.kill(Number(data.pid), 0);
        alive = true;
      } catch (error) {
        alive = Boolean(
          error && typeof error === 'object' && 'code' in error && error.code === 'EPERM',
        );
      }
      lockStatus = { pid: data.pid, alive };
    } catch {
      lockStatus = { invalid: true };
    }
  }
  if (!existsSync(path)) return { exists: false, lock: lockStatus };
  const db = new DatabaseSync(path, { readOnly: true });
  try {
    return {
      exists: true,
      lock: lockStatus,
      integrity: db.prepare('PRAGMA quick_check').get(),
      records: db.prepare('SELECT count(*) AS count FROM records').get()?.count,
      notifications: db.prepare('SELECT count(*) AS pending FROM outbox WHERE attempts<8').get()
        ?.pending,
      failedNotifications: db
        .prepare('SELECT count(*) AS failed FROM outbox WHERE attempts>=8')
        .get()?.failed,
      size: statSync(path).size,
    };
  } finally {
    db.close();
  }
}
export async function backupDatabase(root: string, destination: string): Promise<void> {
  const database = new DatabaseSync(join(root, 'delog.sqlite'), { readOnly: true });
  let reserved = false;
  try {
    // Reserve the name exclusively and restrict access before SQLite writes any secrets.
    closeSync(openSync(destination, 'wx', 0o600));
    reserved = true;
    await backup(database, destination);
  } catch (error) {
    if (reserved) rmSync(destination, { force: true });
    throw error;
  } finally {
    database.close();
  }
}

function importCollections(
  repository: Repository,
  document: Record<string, unknown>,
  records: LoggedRecord[],
  owner: string,
): void {
  const service = new DelogService(repository);
  repository.transaction(() => {
    for (const kind of entityKinds) {
      const values = document[kind] as unknown[] | undefined;
      const identifiers = new Set<string>();
      for (const rawEntity of values ?? []) {
        const value = { ...object(rawEntity) };
        const originalID = value.id === undefined ? undefined : text(value.id, 'entity id');
        if (originalID && identifiers.has(originalID)) {
          throw new DelogError('INVALID_IMPORT', `Duplicate ${kind} id in import.`);
        }
        if (originalID) identifiers.add(originalID);
        delete value.id;
        if (kind === 'notifiers' && typeof value.data !== 'string') {
          value.data = JSON.stringify(value.data);
        }
        if (kind === 'testers' && typeof value.configuration !== 'string') {
          value.configuration = JSON.stringify(value.configuration);
        }
        const created = service.create(kind, owner, value);
        const stored = repository.get(kind, owner, created.id)!;
        if (kind === 'tokens' && typeof value.value === 'string') {
          stored.hash = hash(text(value.value, 'token', 2048));
          stored.startsWith = value.value.slice(0, 11);
        }
        if (originalID || kind === 'tokens') {
          const key = repository.db
            .prepare('SELECT unique_key FROM entities WHERE owner=? AND kind=? AND id=?')
            .get(owner, kind, created.id)!.unique_key;
          repository.delete(kind, owner, created.id);
          repository.put(
            kind,
            owner,
            { ...stored, id: originalID ?? created.id } as Entity,
            String(key),
          );
        }
      }
    }
    for (const record of records) repository.insertRecord(owner, record);
    for (const rawTest of (document.tests as unknown[] | undefined) ?? []) {
      const value = object(rawTest);
      if (typeof value.status !== 'boolean' || !Array.isArray(value.phasesStatus)) {
        throw new DelogError('INVALID_IMPORT', 'Tests require a status and phasesStatus array.');
      }
      const tester = text(value.tester, 'tester');
      if (!repository.get('testers', owner, tester)) {
        throw new DelogError('INVALID_IMPORT', 'Test refers to an unknown tester.');
      }
      const test: TestResult = {
        id: text(value.id, 'test id'),
        time: integer(value.time, 'test time (seconds)', 0, 2147483647),
        status: value.status,
        tester,
        phasesStatus: value.phasesStatus.map((phase) => integer(phase, 'phase status', 0, 1)),
      };
      repository.db
        .prepare('INSERT INTO tests VALUES (?,?,?,?)')
        .run(owner, test.id, test.time, JSON.stringify(test));
    }
    // Historical registrations must not trigger deliveries after the import.
    repository.db.prepare('DELETE FROM outbox WHERE owner=?').run(owner);
  });
}

export function migrate(
  root: string,
  file: string,
  owner: string,
  apply = false,
): Record<string, number | boolean> {
  text(owner, 'owner');
  if (statSync(file).size > 100 * 1024 * 1024)
    throw new DelogError('IMPORT_TOO_LARGE', 'Split imports larger than 100 MB.');
  const raw = readFileSync(file, 'utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = raw
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line) as unknown);
  }
  const document = Array.isArray(parsed) ? { records: parsed } : object(parsed);
  if (!Array.isArray(document.records))
    throw new DelogError(
      'INVALID_IMPORT',
      'Import must be a records array, NDJSON, or a collection export containing records.',
    );
  const records = document.records.map((value) => {
    const source = object(value);
    const record = normalizeRecord(source);
    if (source.id) record.id = text(source.id, 'record id');
    if (typeof source.log === 'string') record.log = source.log;
    else record.log = record.text;
    return record;
  });
  if (new Set(records.map((record) => record.id)).size !== records.length)
    throw new DelogError('INVALID_IMPORT', 'Duplicate record ids in import.');
  let entities = 0;
  for (const kind of entityKinds) {
    const values = document[kind];
    if (values !== undefined && !Array.isArray(values))
      throw new DelogError('INVALID_IMPORT', `${kind} must be an array.`);
    entities += Array.isArray(values) ? values.length : 0;
  }
  if (document.tests !== undefined && !Array.isArray(document.tests)) {
    throw new DelogError('INVALID_IMPORT', 'tests must be an array.');
  }
  const tests = Array.isArray(document.tests) ? document.tests.length : 0;
  const stagingRoot = apply ? undefined : mkdtempSync(join(tmpdir(), 'delog-migration-'));
  let repository: Repository | undefined;
  try {
    repository = new Repository(stagingRoot ?? root);
    const existing = repository.db
      .prepare(
        `
      SELECT (SELECT count(*) FROM records)
           + (SELECT count(*) FROM entities)
           + (SELECT count(*) FROM tests) AS count
    `,
      )
      .get();
    if (Number(existing?.count) > 0) {
      throw new DelogError(
        'DESTINATION_NOT_EMPTY',
        'Migration requires an empty destination data root.',
      );
    }
    importCollections(repository, document, records, owner);
    return { records: records.length, entities, tests, applied: apply };
  } finally {
    repository?.close();
    if (stagingRoot) rmSync(stagingRoot, { recursive: true, force: true });
  }
}
