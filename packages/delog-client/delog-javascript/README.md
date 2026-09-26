# @plurid/delog

JavaScript / TypeScript client for Delog 0.2. Requires Node 24.15+ and uses native fetch.
ESM, CommonJS, and declarations are included.

```ts
import { createDelogClient } from '@plurid/delog';

const log = createDelogClient({
  endpoint: 'http://127.0.0.1:56965/graphql',
  token: process.env.DELOG_TOKEN,
  project: 'api',
  timeoutMs: 10000,
});

await log.info('Started');
await log.child({ space: 'database' }).error({
  text: 'Connection failed',
  error: new Error('Connection refused'),
});
await log.flush();
```

`record`, `log`, `trace`, `debug`, `info`, `warn`, `error`, and `fatal` resolve to `true` after
server acknowledgement, or `false` when filtered. Transport, HTTP, and GraphQL failures
reject. `flush` awaits requests that are still pending; callers should handle each record’s
promise. Delivery is not retried automatically, avoiding duplicate events after uncertain
acknowledgement.

`groundLevel` filters lower severities (0=all, 7=none). Context is copied across child
clients and records; `tester: true` skips records unless `context.mode` is `TESTING`.
`consoleFallback: true` writes to the console without contacting a server.

The original callable API remains available:

```ts
import delog from '@plurid/delog';

await delog('Started');
await delog({ text: 'Failed', level: 'error', error: new Error('Offline') });
```

This wrapper returns `true` or `undefined`, reports failures without throwing, and reads
`DELOG_ENDPOINT`, `DELOG_TOKEN`, `DELOG_PROJECT`, `DELOG_SPACE`, `DELOG_FORMAT`,
`DELOG_GROUND_LEVEL`, `DELOG_QUIET`, and `DELOG_CONSOLE_FALLBACK` when called. Explicit
clients snapshot environment defaults when created. A supplied `graphqlClient.mutate`
remains supported for legacy integrations.

Source context uses `context.call.repository` and `context.call.caller`. Set a repository
base path to turn absolute stack paths into repository-relative paths. The server only
reads files from explicitly linked repositories.
