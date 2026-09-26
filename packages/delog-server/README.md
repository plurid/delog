# @plurid/delog-server

Self-hosted logging server with a Plurid console, transactional SQLite storage, GraphQL
compatibility, REST administration, durable tests, and HTTP/email notification delivery.
Requires Node 24.15+.

```ts
import { createDelog } from '@plurid/delog-server';

const application = createDelog({
  host: '127.0.0.1',
  port: 56965,
  dataRoot: './data',
  owner: { identonym: 'owner', key: process.env.DELOG_OWNER_KEY! },
  ingestToken: process.env.DELOG_INGEST_TOKEN,
  retentionDays: 30,
});

const url = await application.start();
console.log(url);
// During your application's shutdown:
await application.close();
```

Importing the package does not open files, bind ports, or schedule background work. Repeated
`start()` and `close()` calls are safe; each data root allows one writer. `port: 0` selects
an ephemeral port for integration tests. The default export retains `start` / `close`,
and `delogSetup` adapts the original custom-logic entry point.

The executable supports:

```sh
delog-server serve
delog-server doctor --data-root ./data
delog-server backup ./backup.sqlite --data-root ./data
delog-server migrate ./export.json --owner owner --data-root ./new-data
delog-server migrate ./export.json --owner owner --data-root ./new-data --apply
delog-server prune --days 90 --data-root ./data
delog-server prune --days 90 --data-root ./data --apply
```

Maintenance migration/pruning require an offline data root. Migration and pruning default
to dry runs. Backup can run while the server is active. Environment loading is explicit:
use `node --env-file=.env node_modules/@plurid/delog-server/build/cli.mjs serve` or export
variables through your process supervisor.

See the repository’s [operations](https://github.com/plurid/delog/blob/master/docs/operations.md)
and [compatibility](https://github.com/plurid/delog/blob/master/docs/compatibility.md) guides.
