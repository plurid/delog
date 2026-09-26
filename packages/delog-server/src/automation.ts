import mailer from 'nodemailer';
import type { Entity, LoggedRecord, TestResult } from '@plurid/delog-contracts';
import { DelogService, testerConfiguration } from './service.js';
import { object } from './errors.js';

export type NotificationDelivery = (
  notifier: Entity,
  payload: unknown,
  id: string,
) => Promise<void>;
export const deliverNotification: NotificationDelivery = async (notifier, payload, id) => {
  const data = object(notifier.data);
  if (notifier.type === 'api') {
    const response = await fetch(String(data.endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Delog-Secret': String(data.secret ?? ''),
        'Delog-Delivery': id,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
      redirect: 'error',
    });
    await response.body?.cancel();
    if (!response.ok) throw new Error(`Notifier returned HTTP ${response.status}.`);
  } else {
    const auth = object(data.authentication);
    const transport = mailer.createTransport({
      host: String(auth.host),
      port: Number(auth.port),
      secure: auth.secure === true,
      auth: auth.username
        ? { user: String(auth.username), pass: String(auth.password) }
        : undefined,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
    try {
      await transport.sendMail({
        from: String(auth.sender),
        to: (data.notifyTo as string[]).join(', '),
        subject: 'delog notification',
        text: JSON.stringify(payload, null, 2),
        messageId: `<${id}@delog.local>`,
      });
    } finally {
      transport.close();
    }
  }
};

export class Automation {
  private timer?: ReturnType<typeof setInterval>;
  private current?: Promise<void>;
  private lastPrune = 0;
  constructor(
    private service: DelogService,
    private retentionDays: number,
    private onError: (error: unknown) => void,
    private deliver: NotificationDelivery = deliverNotification,
  ) {}
  start(interval: number): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      void this.tick().catch(this.onError);
    }, interval);
    this.timer.unref();
  }
  tick(now = Date.now()): Promise<void> {
    if (this.current) return this.current;
    this.current = this.process(now).finally(() => {
      this.current = undefined;
    });
    return this.current;
  }
  private async process(now: number): Promise<void> {
    this.evaluateTests(now);
    const repository = this.service.repository;
    const jobs = repository.db
      .prepare('SELECT * FROM outbox WHERE attempts<8 AND next_at<=? ORDER BY next_at LIMIT 20')
      .all(now);
    // Bounded concurrency keeps an unavailable destination from exhausting sockets.
    for (let index = 0; index < jobs.length; index += 4)
      await Promise.all(
        jobs.slice(index, index + 4).map(async (job) => {
          const notifier = repository.get('notifiers', String(job.owner), String(job.notifier));
          if (!notifier) {
            repository.db.prepare('DELETE FROM outbox WHERE id=?').run(job.id!);
            return;
          }
          try {
            await this.deliver(notifier, JSON.parse(String(job.body)), String(job.id));
            repository.db.prepare('DELETE FROM outbox WHERE id=?').run(job.id!);
          } catch (error) {
            const attempts = Number(job.attempts) + 1;
            repository.db
              .prepare('UPDATE outbox SET attempts=?,next_at=?,last_error=? WHERE id=?')
              .run(
                attempts,
                now + Math.min(3600000, 1000 * 2 ** attempts),
                'Delivery failed; check the configured destination.',
                job.id!,
              );
            this.onError(error);
          }
        }),
      );
    if (now - this.lastPrune >= 3600000) {
      repository.prune(this.retentionDays, now);
      repository.db.prepare('DELETE FROM sessions WHERE expires<=?').run(now);
      this.lastPrune = now;
    }
  }
  evaluateTests(now = Date.now()): void {
    const repository = this.service.repository;
    const runs = repository.db
      .prepare('SELECT * FROM test_runs WHERE next_at<=? ORDER BY next_at LIMIT 100')
      .all(now);
    for (const run of runs) {
      const config = testerConfiguration(String(run.configuration));
      const rows = repository.db
        .prepare(
          "SELECT body FROM records WHERE owner=? AND shared_id=? AND project=? AND json_extract(body,'$.context.suite')=? AND json_extract(body,'$.context.scenario')=? ORDER BY time,id LIMIT 10000",
        )
        .all(run.owner!, run.id!, run.project!, run.suite!, run.scenario!);
      const records = rows.map((row) => JSON.parse(String(row.body)) as LoggedRecord);
      const ordered = new Map<number, LoggedRecord>();
      for (const record of records)
        if (record.context?.sharedOrder !== undefined && record.context.sharedOrder >= 0)
          ordered.set(record.context.sharedOrder, record);
      const phasesStatus = config.phases.map((phase, index) => {
        const record = ordered.get(index) ?? (ordered.size === 0 ? records[index] : undefined);
        return record &&
          record.text === phase.text &&
          (phase.method === undefined || phase.method === record.method) &&
          (phase.level === undefined || phase.level === record.level)
          ? 1
          : 0;
      });
      const allPresent = config.phases.every((_, index) =>
        ordered.size ? ordered.has(index) : Boolean(records[index]),
      );
      if (!allPresent && now < Number(run.deadline)) {
        repository.db
          .prepare('UPDATE test_runs SET next_at=? WHERE owner=? AND id=?')
          .run(Math.min(now + config.retryDelay, Number(run.deadline)), run.owner!, run.id!);
        continue;
      }
      const result: TestResult = {
        id: String(run.id),
        tester: String(run.tester),
        time: Math.floor(now / 1000),
        status: phasesStatus.every((value) => value === 1),
        phasesStatus,
      };
      repository.transaction(() => {
        repository.db
          .prepare('INSERT OR IGNORE INTO tests VALUES (?,?,?,?)')
          .run(run.owner!, result.id, result.time, JSON.stringify(result));
        repository.db
          .prepare('DELETE FROM test_runs WHERE owner=? AND id=?')
          .run(run.owner!, run.id!);
        this.service.enqueue(
          String(run.owner),
          result.status ? 'TEST_SUCCESS' : 'TEST_FAIL',
          result,
        );
      });
    }
  }
  async close(): Promise<void> {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    await this.current;
  }
}
