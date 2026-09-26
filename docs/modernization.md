# Delog modernization

The reference is the adjacent Hypod 0.2 workspace. Delog remains a self-hosted logging
service with a Plurid administration interface. The supported deployment is one Node 24+
process per local data root; clients across a cluster submit logs to that process.

## Existing contracts

- Packages: `@plurid/delog-server`, `@plurid/delog`, `@plurid/delog-cli`, Python `delog`, Rust `plurid_delog`.
- `delogMutationRecord` receives the existing `DelogInputRecord` over GraphQL. Levels
  remain trace=1 through fatal=6. Stored timestamps remain epoch microseconds.
- Owner, tokens, projects, spaces, records, formats, testers, tests, notifiers, code
  providers, repositories, and analytics retain their GraphQL operation names.
- JavaScript retains the callable default `delog` export. The server retains the default
  server and `delogSetup` compatibility entry points, with lazy resource acquisition.
- Plurid is a spatial DOM engine. Delog uses public plane, link, configuration, and camera
  APIs; business state stays in Delog. Stable plane definitions avoid store reconstruction.

## Implementation

The active implementation lives in package `src/` directories and `delog-server/ui/`.
The old `source/` trees are historical reference, excluded from build and verification.
Shared contracts, a transactional SQLite repository, application lifecycle, authentication,
GraphQL/HTTP adapters, durable test and notification processing, clients, and operations
are independently exercised through their public interfaces.

Verification and the final compatibility/migration details are recorded in the operations
and compatibility documents. No deployment, publication, or existing data mutation is
part of this source modernization.
