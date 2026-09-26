import { databaseSchema } from './database-schema.js';
import {
  chmodSync,
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  realpathSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import type {
  Entity,
  EntityKind,
  LoggedRecord,
  RecordPage,
  RecordQuery,
  TestResult,
} from '@plurid/delog-contracts';
import { DelogError, integer, text } from './errors.js';

export class Repository {
  readonly db!: DatabaseSync;
  readonly root: string;
  private readonly lock: string;
  private readonly lockValue: string;
  private closed = false;

  constructor(dataRoot: string) {
    mkdirSync(dataRoot, { recursive: true, mode: 0o700 });
    this.root = realpathSync(dataRoot);
    this.lock = join(this.root, '.delog.lock');
    this.lockValue = JSON.stringify({ pid: process.pid, nonce: randomUUID() });
    try {
      const descriptor = openSync(this.lock, 'wx', 0o600);
      try {
        writeFileSync(descriptor, this.lockValue);
      } finally {
        closeSync(descriptor);
      }
    } catch {
      throw new DelogError(
        'DATA_ROOT_LOCKED',
        'This data root is locked. Stop its Delog process; use doctor to inspect stale locks.',
        409,
      );
    }
    try {
      this.db = new DatabaseSync(join(this.root, 'delog.sqlite'), { timeout: 5000 });
      chmodSync(join(this.root, 'delog.sqlite'), 0o600);
      const metadata = this.db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='metadata'")
        .get();
      if (metadata) {
        const version = this.db.prepare('SELECT value FROM metadata WHERE key=?').get('schema');
        if (version?.value !== '1') {
          throw new DelogError('SCHEMA_VERSION', 'Unsupported database schema version.');
        }
      }
      this.db.exec(databaseSchema);
      this.db.prepare('INSERT OR IGNORE INTO metadata VALUES (?,?)').run('schema', '1');
    } catch (error) {
      this.db?.close();
      unlinkSync(this.lock);
      throw error;
    }
  }
  transaction<T>(work: () => T): T {
    // Service operations can participate in the migration's outer transaction.
    if (this.db.isTransaction) return work();
    this.db.exec('BEGIN IMMEDIATE');
    try {
      const result = work();
      this.db.exec('COMMIT');
      return result;
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }
  list(kind: EntityKind, owner: string): Entity[] {
    return this.db
      .prepare('SELECT body FROM entities WHERE owner=? AND kind=? ORDER BY unique_key,id')
      .all(owner, kind)
      .map((row) => JSON.parse(String(row.body)) as Entity);
  }
  get(kind: EntityKind, owner: string, id: string): Entity | undefined {
    const row = this.db
      .prepare('SELECT body FROM entities WHERE owner=? AND kind=? AND id=?')
      .get(owner, kind, id);
    return row ? (JSON.parse(String(row.body)) as Entity) : undefined;
  }
  put(kind: EntityKind, owner: string, entity: Entity, key: string): void {
    try {
      this.db
        .prepare(
          'INSERT INTO entities VALUES (?,?,?,?,?) ON CONFLICT(owner,kind,id) DO UPDATE SET unique_key=excluded.unique_key,body=excluded.body',
        )
        .run(owner, kind, entity.id, key, JSON.stringify(entity));
    } catch (error) {
      if (error instanceof Error && error.message.includes('UNIQUE constraint'))
        throw new DelogError('CONFLICT', `That ${kind} name already exists.`, 409);
      throw error;
    }
  }
  delete(kind: EntityKind, owner: string, id: string): boolean {
    return (
      Number(
        this.db
          .prepare('DELETE FROM entities WHERE owner=? AND kind=? AND id=?')
          .run(owner, kind, id).changes,
      ) > 0
    );
  }
  insertRecord(owner: string, record: LoggedRecord): void {
    this.db
      .prepare('INSERT INTO records VALUES (?,?,?,?,?,?,?,?,?)')
      .run(
        owner,
        record.id,
        record.time,
        record.receivedAt,
        record.level,
        record.project,
        record.space,
        record.context?.sharedID ?? '',
        JSON.stringify(record),
      );
  }
  record(owner: string, id: string): LoggedRecord | undefined {
    const row = this.db.prepare('SELECT body FROM records WHERE owner=? AND id=?').get(owner, id);
    return row ? (JSON.parse(String(row.body)) as LoggedRecord) : undefined;
  }
  query(owner: string, query: RecordQuery = {}): RecordPage {
    const count = integer(query.count ?? 100, 'count', 1, 500);
    const where = ['owner=?'];
    const values: SQLInputValue[] = [owner];
    for (const [field, column] of [
      ['project', 'project'],
      ['space', 'space'],
      ['sharedID', 'shared_id'],
    ] as const) {
      if (query[field] !== undefined) {
        where.push(`${column}=?`);
        values.push(text(query[field], field, 256, true));
      }
    }
    if (query.level !== undefined) {
      where.push('level>=?');
      values.push(integer(query.level, 'level', 1, 6));
    }
    if (query.search) {
      where.push(
        "instr(lower(json_extract(body,'$.text') || ' ' || coalesce(json_extract(body,'$.error'),'')),lower(?))>0",
      );
      values.push(text(query.search, 'search', 512));
    }
    if (query.from !== undefined) {
      where.push('time>=?');
      values.push(integer(query.from, 'from', 0, Number.MAX_SAFE_INTEGER));
    }
    if (query.to !== undefined) {
      where.push('time<=?');
      values.push(integer(query.to, 'to', 0, Number.MAX_SAFE_INTEGER));
    }
    if (query.start) {
      const cursor = this.record(owner, text(query.start, 'start', 256));
      if (!cursor)
        throw new DelogError(
          'INVALID_CURSOR',
          'The pagination record no longer exists. Refresh the records.',
        );
      where.push('(time<? OR (time=? AND id<?))');
      values.push(cursor.time, cursor.time, cursor.id);
    }
    const records = this.db
      .prepare(
        `SELECT body FROM records WHERE ${where.join(' AND ')} ORDER BY time DESC,id DESC LIMIT ?`,
      )
      .all(...values, count + 1)
      .map((row) => JSON.parse(String(row.body)) as LoggedRecord);
    const hasMore = records.length > count;
    records.length = Math.min(records.length, count);
    return { records, next: hasMore ? records.at(-1)!.id : null };
  }
  tests(owner: string, count = 100, start?: string): TestResult[] {
    integer(count, 'count', 1, 500);
    const cursor = start
      ? this.db.prepare('SELECT time,id FROM tests WHERE owner=? AND id=?').get(owner, start)
      : undefined;
    if (start && !cursor) throw new DelogError('INVALID_CURSOR', 'Unknown test cursor.');
    const rows = cursor
      ? this.db
          .prepare(
            'SELECT body FROM tests WHERE owner=? AND (time<? OR (time=? AND id<?)) ORDER BY time DESC,id DESC LIMIT ?',
          )
          .all(owner, cursor.time!, cursor.time!, cursor.id!, count)
      : this.db
          .prepare('SELECT body FROM tests WHERE owner=? ORDER BY time DESC,id DESC LIMIT ?')
          .all(owner, count);
    return rows.map((row) => JSON.parse(String(row.body)) as TestResult);
  }
  prune(days: number, now = Date.now()): number {
    if (!days) return 0;
    return Number(
      this.db
        .prepare(
          'DELETE FROM records WHERE received_at<? AND NOT EXISTS (SELECT 1 FROM test_runs WHERE test_runs.owner=records.owner AND test_runs.id=records.shared_id)',
        )
        .run(now - days * 86400000).changes,
    );
  }
  close(): void {
    if (this.closed) return;
    this.closed = true;
    try {
      this.db.close();
    } finally {
      if (existsSync(this.lock) && readFileSync(this.lock, 'utf8') === this.lockValue)
        unlinkSync(this.lock);
    }
  }
}
