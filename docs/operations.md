# Operating Delog

## Deployment boundary

Run one Node 24.15+ process per data root on local disk. All clients in the cluster send
logs to that process. SQLite WAL and the `.delog.lock` file enforce the local writer
boundary. Do not share a data root between replicas or mount it over a network filesystem.

The Node CLI loads exported environment variables. The root `pnpm start` command also
loads `.env`. The Docker image runs as the `node` user and stores state in `/data`.

| Variable                 | Default     | Meaning                                            |
| ------------------------ | ----------- | -------------------------------------------------- |
| `DELOG_HOST`             | `127.0.0.1` | Listen address; container uses `0.0.0.0`           |
| `DELOG_PORT`             | `56965`     | HTTP port                                          |
| `DELOG_DATA_ROOT`        | `./data`    | SQLite and lock directory                          |
| `DELOG_MODE`             | `private`   | `private`, `public`, or programmatic `custom`      |
| `DELOG_OWNER_IDENTONYM`  | `owner`     | Administrator identity                             |
| `DELOG_OWNER_KEY`        | required    | Administrator sign-in password                     |
| `DELOG_INGEST_TOKEN`     | empty       | Optional bootstrap ingestion credential            |
| `DELOG_RETENTION_DAYS`   | `30`        | Record lifetime after receipt; `0` disables expiry |
| `DELOG_ENDPOINT_GRAPHQL` | `/graphql`  | Additional compatibility ingestion path            |

Create revocable per-service tokens in the UI. Tokens are shown once and stored as hashes.
The bootstrap token is configured outside the database and is revoked by changing the
environment and restarting. Owner keys and ingestion tokens must differ.

Private mode requires authentication for all data. Public mode permits anonymous record,
test, and analytics reads; writes and administration still require credentials. Custom
mode requires an explicit `AccessPolicy` in `createDelog` with `authenticate` and `authorize`;
optional `login` returns an administrator principal for the browser/CLI sign-in flow.
Custom authorization is checked on each operation, including local sessions.

Sessions expire after eight hours and are revocable. Browser cookies are HttpOnly and
SameSite=Strict. TLS requests receive Secure cookies. Put HTTPS termination in front of
Delog for access beyond localhost. For a reverse proxy, configure `trustProxy` programmatically
to the specific proxy address/hop and pass the original Host and protocol. Do not blindly
trust forwarded headers from untrusted clients. Same-origin checks protect browser writes.

The Compose example exposes localhost only. Bind it to your cluster’s private interface
when needed and restrict ingress to the intended services/operators. Persist the named
volume across container replacement. One container uses that volume at a time.

## Health and shutdown

`GET /health` returns liveness; `GET /ready` returns 200 after startup and 503 while stopping.
SIGINT/SIGTERM stop accepting connections, drain HTTP work, await current background jobs,
close SQLite, and release the process lock. Allow at least 30 seconds for graceful shutdown.
An import does not start the server; embedding applications call `start()` and `close()`.

`delog-server doctor --data-root ./data` reports existence, SQLite quick-check results,
record count, pending/failed notification counts, database size, and lock PID liveness.
Doctor is read-only and can inspect a running instance. A stale lock is never removed
automatically. Verify the owning process has stopped before manually removing only
`.delog.lock`; a reused PID must not be mistaken for permission to start a second writer.

## Backup and restore

Use SQLite’s online backup API, which includes committed WAL data:

```sh
node packages/delog-server/build/cli.mjs backup ./backup.sqlite --data-root ./data
```

The command refuses an existing destination and creates mode-0600 files. Backups include
records, configuration, sessions, tests, and queued work. Treat them as secrets: provider
credentials and notification destinations must remain recoverable by the server and are
stored in the protected database. They are redacted from normal API responses, not
cryptographically encrypted at rest.

To restore, stop the server and place the backup at `delog.sqlite` in a **new, empty** local
data root owned by the server user (directory mode 0700, database mode 0600). Run doctor
against that root, then start the same release with `DELOG_DATA_ROOT` pointing to it. Keep
the previous data root intact until verification is complete. Never copy a live database
file without its WAL; never overlay a backup onto live database/WAL files.

The Records **Export** action streams matching records as NDJSON, respecting active
filters. It does not export entities or queued work; use backup for complete recovery.

## Retention and manual deletion

Automatic retention removes records by receipt time, once per hour, unless disabled.
Records participating in a pending test are retained until evaluation completes. Test
results and configuration remain; deleting a project removes its spaces but keeps logs.

Inspect an offline root before pruning:

```sh
node packages/delog-server/build/cli.mjs prune --days 90 --data-root ./data
node packages/delog-server/build/cli.mjs prune --days 90 --data-root ./data --apply
```

Pruning is an operator action across the data root’s owners. API deletion is owner-scoped;
the UI requests confirmation for selected IDs. Explicit IDs make concurrent ingestion
independent of the selection being deleted. Back up before intentional bulk deletion.

## Tests and notifications

A tester has project, suite, scenario, and JSON configuration:

```json
{
  "phases": [
    { "text": "request started", "level": "info" },
    { "text": "request finished", "level": "info", "method": "finish" }
  ],
  "startDelay": 1000,
  "retryDelay": 500,
  "timeout": 10000
}
```

Send records with `context.mode: "TESTING"`, matching `suite` and `scenario`, the same
`sharedID`, and zero-based `sharedOrder`. Phase text, severity, and method are matched
exactly. Timing values are milliseconds. Missing phases are retried until the deadline;
completed mismatches fail immediately. Pending tests and their configuration survive
process restarts.

Notifications are enqueued in the same transaction as the triggering event. HTTP delivery
sends JSON with `Delog-Secret` and a stable `Delog-Delivery` identifier. Receivers should
use that identifier for deduplication: delivery is at least once. Redirects are rejected;
requests time out after ten seconds. Email uses explicit SMTP configuration and a stable
message ID. Retries use exponential backoff, with eight total attempts. Failed deliveries
remain persisted and their count appears in Analytics and doctor. There is no automatic
replay after the eighth failure; retain the database and investigate the destination.

Supported events are exposed by the Notifiers form. Destinations can be local cluster
services. Only administrators may configure them. Deleting a notifier cancels its pending
work. Use the dependency-free [receiver fixture](../fixtures/delog-notification-receiver)
and [test fixture](../fixtures/delog-testers) to exercise a local setup.

## Source context

Link a GitHub or Bitbucket provider and the exact `owner/repository`. Records may include
repository revision and a repository-relative caller path. Source reads are administrator
only, use the provider’s fixed HTTPS API host, reject traversal, bound content to 2 MiB,
and time out after ten seconds. They do not clone or execute repositories. Provider tokens
need read access only. Repository discovery currently returns the first 100 results; the
UI also accepts an explicit repository name.
