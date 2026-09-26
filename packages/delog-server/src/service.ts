import { randomBytes, randomUUID } from 'node:crypto';
import {
  delogLevels,
  delogLevelsText,
  type Analytics,
  type DelogInputRecordContext,
  type Entity,
  type EntityKind,
  type LoggedRecord,
  type TesterConfiguration,
} from '@plurid/delog-contracts';
import { hash } from './auth.js';
import { DelogError, httpUrl, integer, object, text } from './errors.js';
import { Repository } from './repository.js';

const NOTIFICATIONS = [
  'RECORDED_FATAL',
  'RECORDED_ERROR',
  'RECORDED_WARN',
  'TEST_FAIL',
  'TEST_SUCCESS',
  'ENTITY_REGISTRATION',
  'ENTITY_DEREGISTRATION',
];
export function testerConfiguration(value: unknown): TesterConfiguration {
  let data: Record<string, unknown>;
  try {
    data = object(typeof value === 'string' ? JSON.parse(value) : value);
  } catch {
    throw new DelogError('INVALID_INPUT', 'Tester configuration must be valid JSON.');
  }
  if (!Array.isArray(data.phases) || data.phases.length < 1 || data.phases.length > 500)
    throw new DelogError('INVALID_INPUT', 'A tester needs 1–500 phases.');
  const phases = data.phases.map((value) => {
    const phase = object(value);
    const result: TesterConfiguration['phases'][number] = {
      text: text(phase.text, 'phase text', 65536, true),
    };
    if (phase.level !== undefined) result.level = severity(phase.level);
    if (phase.method !== undefined) result.method = text(phase.method, 'phase method', 1024, true);
    return result;
  });
  return {
    phases,
    startDelay: integer(data.startDelay ?? 5000, 'startDelay', 0, 3600000),
    retryDelay: integer(data.retryDelay ?? 1000, 'retryDelay', 10, 3600000),
    timeout: integer(data.timeout ?? 60000, 'timeout', 0, 86400000),
  };
}
export function severity(value: unknown): number {
  return integer(
    typeof value === 'string' && value in delogLevels
      ? delogLevels[value as keyof typeof delogLevels]
      : value,
    'level',
    1,
    6,
  );
}
export function normalizeRecord(input: unknown, now = Date.now()): LoggedRecord {
  const value = object(input);
  const unit = value.unit ?? 'us';
  if (!['s', 'ms', 'us'].includes(String(unit)))
    throw new DelogError('INVALID_INPUT', 'unit must be s, ms, or us.');
  if (typeof value.time !== 'number' || !Number.isFinite(value.time) || value.time < 0)
    throw new DelogError('INVALID_INPUT', 'time must be a finite epoch timestamp.');
  const time = integer(
    Math.round(value.time * (unit === 's' ? 1000000 : unit === 'ms' ? 1000 : 1)),
    'time',
    0,
    Number.MAX_SAFE_INTEGER,
  );
  const record: LoggedRecord = {
    id: randomUUID(),
    text: text(value.text, 'text', 65536, true),
    time,
    unit: 'us',
    level: severity(value.level),
    project: text(value.project ?? '', 'project', 256, true),
    space: text(value.space ?? '', 'space', 256, true),
    format: text(value.format || '%TIME - %SPACE - %LEVEL : %TEXT', 'format', 4096),
    log: '',
    receivedAt: now,
  };
  for (const field of ['method', 'error', 'extradata'] as const)
    if (value[field] != null)
      record[field] = text(value[field], field, field === 'method' ? 1024 : 65536, true);
  if (value.context != null) {
    const raw = object(value.context, 'context');
    const context: DelogInputRecordContext = {};
    if (raw.mode != null) {
      if (!['TESTING', 'LOGGING'].includes(String(raw.mode)))
        throw new DelogError('INVALID_INPUT', 'context.mode must be TESTING or LOGGING.');
      context.mode = raw.mode as DelogInputRecordContext['mode'];
    }
    for (const field of ['suite', 'scenario', 'sharedID'] as const)
      if (raw[field] != null) context[field] = text(raw[field], field, 256, true);
    if (raw.sharedOrder != null)
      context.sharedOrder = integer(raw.sharedOrder, 'sharedOrder', -1, 1000000);
    if (raw.call != null) {
      const call = object(raw.call);
      const repository = object(call.repository);
      const caller = object(call.caller);
      context.call = {
        repository: {
          provider: text(repository.provider ?? '', 'provider', 256, true),
          name: text(repository.name ?? '', 'repository', 512, true),
          branch: text(repository.branch ?? '', 'branch', 256, true),
          commit: text(repository.commit ?? '', 'commit', 256, true),
          basePath: text(repository.basePath ?? '', 'basePath', 2048, true),
        },
        caller: {
          file: text(caller.file, 'file', 2048),
          line: integer(caller.line, 'line', 1, 10000000),
          column: integer(caller.column, 'column', 0, 10000000),
        },
      };
    }
    record.context = context;
  }
  return record;
}
export function publicEntity(kind: EntityKind, entity: Entity): Entity {
  const result = { ...entity };
  delete result.hash;
  delete result.token;
  delete result.ownedBy;
  delete result.value;
  if (kind === 'notifiers') {
    const data =
      typeof result.data === 'string' ? object(JSON.parse(result.data)) : object(result.data);
    const copy = { ...data };
    if (typeof copy.secret === 'string') {
      copy.startsWith = copy.secret.slice(0, 7);
      delete copy.secret;
    }
    if (copy.authentication) {
      const auth = { ...object(copy.authentication) };
      delete auth.password;
      copy.authentication = auth;
    }
    result.data = JSON.stringify(copy);
  }
  return result;
}

export class DelogService {
  constructor(readonly repository: Repository) {}
  list(kind: EntityKind, owner: string): Entity[] {
    return this.repository.list(kind, owner).map((entity) => publicEntity(kind, entity));
  }
  create(kind: EntityKind, owner: string, input: unknown): Entity {
    const value = object(input);
    const entity: Entity = { id: randomUUID() };
    let key = '';
    let generatedToken: string | undefined;
    switch (kind) {
      case 'projects':
        entity.name = text(value.name ?? value.value, 'name');
        key = String(entity.name);
        break;
      case 'spaces': {
        entity.name = text(value.name, 'name');
        entity.project = text(value.project, 'project');
        if (
          !this.repository
            .list('projects', owner)
            .some((project) => project.id === entity.project || project.name === entity.project)
        )
          throw new DelogError('NOT_FOUND', 'Choose an existing project.', 404);
        key = JSON.stringify([entity.project, entity.name]);
        break;
      }
      case 'tokens': {
        entity.name = text(value.name, 'name');
        generatedToken = `dlg_${randomBytes(32).toString('base64url')}`;
        entity.hash = hash(generatedToken);
        entity.startsWith = generatedToken.slice(0, 11);
        key = String(entity.name);
        break;
      }
      case 'formats':
        entity.identifier = text(value.identifier, 'identifier', 128);
        entity.transform = text(value.transform, 'transform', 4096);
        key = String(entity.identifier);
        break;
      case 'testers': {
        entity.name = text(value.name, 'name');
        entity.project = text(value.project, 'project');
        entity.suite = text(value.suite, 'suite');
        entity.scenario = text(value.scenario, 'scenario');
        entity.configuration = JSON.stringify(testerConfiguration(value.configuration));
        key = JSON.stringify([entity.project, entity.suite, entity.scenario]);
        if (value.id) {
          const id = text(value.id, 'id');
          if (!this.repository.get('testers', owner, id))
            throw new DelogError('NOT_FOUND', 'Tester not found.', 404);
          entity.id = id;
        }
        break;
      }
      case 'notifiers': {
        entity.name = text(value.name, 'name');
        if (
          !Array.isArray(value.notifyOn) ||
          !value.notifyOn.length ||
          value.notifyOn.some((item) => !NOTIFICATIONS.includes(String(item)))
        )
          throw new DelogError('INVALID_INPUT', 'Choose valid notification events.');
        entity.notifyOn = [...new Set(value.notifyOn)];
        entity.type = value.type;
        let data: Record<string, unknown>;
        try {
          data = object(typeof value.data === 'string' ? JSON.parse(value.data) : value.data);
        } catch {
          throw new DelogError('INVALID_INPUT', 'Notifier data must be valid JSON.');
        }
        if (value.type === 'api')
          entity.data = {
            endpoint: httpUrl(data.endpoint, 'endpoint').href,
            secret: text(data.secret ?? '', 'secret', 1024, true),
          };
        else if (value.type === 'email') {
          const authentication = object(data.authentication);
          if (
            !Array.isArray(data.notifyTo) ||
            data.notifyTo.length < 1 ||
            data.notifyTo.length > 50
          )
            throw new DelogError('INVALID_INPUT', 'notifyTo needs 1–50 email addresses.');
          if (typeof authentication.secure !== 'boolean')
            throw new DelogError('INVALID_INPUT', 'SMTP secure must be a boolean.');
          entity.data = {
            notifyTo: data.notifyTo.map((item) => text(item, 'recipient', 320)),
            authentication: {
              host: text(authentication.host, 'SMTP host'),
              port: integer(authentication.port, 'SMTP port', 1, 65535),
              secure: authentication.secure,
              username: text(authentication.username ?? '', 'SMTP username', 1024, true),
              password: text(authentication.password ?? '', 'SMTP password', 4096, true),
              sender: text(authentication.sender, 'SMTP sender', 320),
            },
          };
        } else throw new DelogError('INVALID_INPUT', 'Notifier type must be api or email.');
        key = String(entity.name);
        break;
      }
      case 'providers': {
        entity.name = text(value.name, 'name');
        if (!['github', 'bitbucket'].includes(String(value.type)))
          throw new DelogError('INVALID_INPUT', 'Provider type must be github or bitbucket.');
        entity.type = value.type;
        entity.token = text(value.token, 'provider token', 4096);
        key = String(entity.name);
        break;
      }
      case 'repositories': {
        entity.providerID = text(value.providerID, 'providerID');
        entity.name = text(value.nameWithOwner ?? value.name, 'repository', 512);
        if (!/^[\w.-]+\/[\w.-]+$/.test(String(entity.name)))
          throw new DelogError('INVALID_INPUT', 'Repository must be owner/name.');
        if (!this.repository.get('providers', owner, String(entity.providerID)))
          throw new DelogError('NOT_FOUND', 'Provider not found.', 404);
        entity.isPrivate = true;
        key = JSON.stringify([entity.providerID, entity.name]);
        break;
      }
    }
    this.repository.transaction(() => {
      this.repository.put(kind, owner, entity, key);
      this.enqueue(owner, 'ENTITY_REGISTRATION', { kind, entity: publicEntity(kind, entity) });
    });
    const result = publicEntity(kind, entity);
    if (generatedToken) result.value = generatedToken;
    return result;
  }
  remove(kind: EntityKind, owner: string, id: string): void {
    const entity = this.repository.get(kind, owner, text(id, 'id'));
    if (!entity) throw new DelogError('NOT_FOUND', 'Entry not found.', 404);
    this.repository.transaction(() => {
      if (kind === 'projects') {
        for (const space of this.repository.list('spaces', owner))
          if (space.project === id || space.project === entity.name)
            this.repository.delete('spaces', owner, space.id);
      }
      if (
        kind === 'providers' &&
        this.repository
          .list('repositories', owner)
          .some((repository) => repository.providerID === id)
      )
        throw new DelogError('CONFLICT', 'Unlink this provider’s repositories first.', 409);
      if (kind === 'notifiers')
        this.repository.db
          .prepare('DELETE FROM outbox WHERE owner=? AND notifier=?')
          .run(owner, id);
      if (kind === 'testers')
        this.repository.db
          .prepare('DELETE FROM test_runs WHERE owner=? AND tester=?')
          .run(owner, id);
      this.repository.delete(kind, owner, id);
      this.enqueue(owner, 'ENTITY_DEREGISTRATION', { kind, entity: publicEntity(kind, entity) });
    });
  }
  ingest(owner: string, input: unknown | unknown[]): LoggedRecord[] {
    const values = Array.isArray(input) ? input : [input];
    if (values.length < 1 || values.length > 1000)
      throw new DelogError('INVALID_INPUT', 'A batch needs 1–1000 records.');
    const records = values.map((value) => normalizeRecord(value));
    const formats = this.repository.list('formats', owner);
    this.repository.transaction(() => {
      for (const record of records) {
        const stored = formats.find((format) => format.identifier === record.format);
        const template = stored ? String(stored.transform) : record.format;
        const replacements: Record<string, string> = {
          TIME: new Date(record.time / 1000).toISOString(),
          LEVEL: delogLevelsText[record.level as keyof typeof delogLevelsText],
          TEXT: record.text,
          PROJECT: record.project,
          SPACE: record.space,
          METHOD: record.method ?? '',
          ERROR: record.error ?? '',
          EXTRADATA: record.extradata ?? '',
        };
        record.log = template.replace(
          /%([A-Z]+)/g,
          (match, key: string) => replacements[key] ?? match,
        );
        this.repository.insertRecord(owner, record);
        if (record.level >= 4)
          this.enqueue(
            owner,
            `RECORDED_${delogLevelsText[record.level as keyof typeof delogLevelsText].toUpperCase()}`,
            record,
          );
        this.scheduleTest(owner, record);
      }
    });
    return records;
  }
  enqueue(owner: string, event: string, payload: unknown): void {
    for (const notifier of this.repository.list('notifiers', owner)) {
      if (Array.isArray(notifier.notifyOn) && notifier.notifyOn.includes(event))
        this.repository.db
          .prepare('INSERT INTO outbox (id,owner,notifier,body,next_at) VALUES (?,?,?,?,?)')
          .run(randomUUID(), owner, notifier.id, JSON.stringify(payload), Date.now());
    }
  }
  private scheduleTest(owner: string, record: LoggedRecord): void {
    const context = record.context;
    if (
      context?.mode !== 'TESTING' ||
      !context.sharedID ||
      !context.suite ||
      !context.scenario ||
      !record.project
    )
      return;
    if (
      this.repository.db
        .prepare('SELECT id FROM tests WHERE owner=? AND id=?')
        .get(owner, context.sharedID)
    )
      return;
    const tester = this.repository
      .list('testers', owner)
      .find(
        (tester) =>
          tester.project === record.project &&
          tester.suite === context.suite &&
          tester.scenario === context.scenario,
      );
    if (!tester) return;
    const config = testerConfiguration(tester.configuration);
    const now = Date.now();
    this.repository.db
      .prepare('INSERT OR IGNORE INTO test_runs VALUES (?,?,?,?,?,?,?,?,?,?)')
      .run(
        owner,
        context.sharedID,
        tester.id,
        record.project,
        context.suite,
        context.scenario,
        now,
        now + config.startDelay,
        now + config.startDelay + config.timeout,
        JSON.stringify(config),
      );
  }
  deleteRecords(owner: string, ids?: string[], tests = false): number {
    const table = tests ? 'tests' : 'records';
    if (ids !== undefined && (!Array.isArray(ids) || ids.length > 500))
      throw new DelogError('INVALID_INPUT', 'Supply at most 500 ids.');
    return this.repository.transaction(() => {
      if (!ids)
        return Number(
          this.repository.db.prepare(`DELETE FROM ${table} WHERE owner=?`).run(owner).changes,
        );
      return ids.reduce(
        (count, id) =>
          count +
          Number(
            this.repository.db
              .prepare(`DELETE FROM ${table} WHERE owner=? AND id=?`)
              .run(owner, text(id, 'id')).changes,
          ),
        0,
      );
    });
  }
  analytics(owner: string, project?: string, period = 'day'): Analytics {
    const hours = ({ hour: 1, day: 24, week: 168, month: 720 } as Record<string, number>)[period];
    if (!hours) throw new DelogError('INVALID_INPUT', 'Period must be hour, day, week, or month.');
    const projectClause = project && project !== 'all' ? ' AND project=?' : '';
    const parameters = projectClause ? [owner, project!] : [owner];
    const summary = this.repository.db
      .prepare(
        `SELECT count(*) AS total, coalesce(sum(level>=4),0) AS faults, coalesce(sum(length(CAST(body AS BLOB))),0) AS bytes FROM records WHERE owner=?${projectClause}`,
      )
      .get(...parameters)!;
    const since = (Date.now() - hours * 3600000) * 1000;
    const levels = this.repository.db
      .prepare(
        `SELECT level,count(*) AS count FROM records WHERE owner=?${projectClause} AND time>=? GROUP BY level`,
      )
      .all(...parameters, since);
    const buckets = Math.max(60000000, Math.floor((hours * 3600000000) / 24));
    const rows = this.repository.db
      .prepare(
        `SELECT CAST(time/? AS INTEGER)*? AS bucket_time,
                count(*) AS total,
                sum(level>=4) AS faults
           FROM records
          WHERE owner=?${projectClause} AND time>=?
          GROUP BY CAST(time/? AS INTEGER)
          ORDER BY bucket_time`,
      )
      .all(buckets, buckets, ...parameters, since, buckets);
    const outbox = this.repository.db
      .prepare(
        'SELECT coalesce(sum(attempts<8),0) AS pending,coalesce(sum(attempts>=8),0) AS failed FROM outbox WHERE owner=?',
      )
      .get(owner)!;
    return {
      total: Number(summary.total),
      faults: Number(summary.faults),
      bytes: Number(summary.bytes),
      levels: Object.entries(delogLevels).map(([name, level]) => ({
        name: name as keyof typeof delogLevels,
        value: Number(levels.find((row) => row.level === level)?.count ?? 0),
      })),
      timeline: rows.map((row) => ({
        time: Number(row.bucket_time),
        total: Number(row.total),
        faults: Number(row.faults),
      })),
      pendingNotifications: Number(outbox.pending),
      failedNotifications: Number(outbox.failed),
    };
  }
}
