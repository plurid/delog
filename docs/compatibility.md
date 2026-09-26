# Compatibility and migration to 0.2

## Preserved surface

The packages remain `@plurid/delog`, `@plurid/delog-cli`, `@plurid/delog-server`, Python
`delog`, and Rust `plurid_delog`. JavaScript adds `@plurid/delog-contracts` for shared types.
The callable JavaScript/Python logging functions remain; JavaScript also offers an explicit
client with rejected promises on delivery failures. All JavaScript packages have ESM,
CommonJS, and declaration entry points.

The original `/delog` endpoint and `delogMutationRecord(DelogInputRecord)` operation remain,
alongside `/graphql`. Existing
record fields and numeric levels are retained. Seconds, milliseconds, and microseconds are
normalized to stored epoch microseconds. The GraphQL schema retains operation names for
owner/login/logout, setup, records, tokens, projects, spaces, formats, testers, tests,
notifiers, providers, repositories, source code, and analytics.

The original server default export and `delogSetup(logic, options)` remain lazy. The old
custom logic’s `checkOwnerToken`, `getOwnerToken`, and `getCurrentOwner` are adapted to
owner authentication. New deployments should use `createDelog` and `AccessPolicy` directly.
Provider registration hooks and a custom logger are not runtime storage/provider adapters;
provider credentials/configuration now belong to Delog’s repository.

## Deliberate changes

| Area               | 0.2 behavior                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| Runtime            | Node 24.15+, React 19, Vite, pnpm workspace; Python 3.10+, Rust edition 2024                              |
| Storage            | One local SQLite data root; MongoDB/S3 adapters are retired                                               |
| Authentication     | Owner password signs in; service tokens only ingest; no built-in credentials                              |
| Public mode        | Anonymous read access only; mutation/configuration requires authentication                                |
| CLI                | Revocable sessions in a versioned profile file; old password files are not imported                       |
| Validation         | Invalid levels, units, shapes, URLs, paths, excessive bodies, and complex queries are rejected            |
| GraphQL deletion   | Supply explicit IDs; arbitrary filter expressions are rejected                                            |
| Test configuration | JSON phases and millisecond timing; executable/DEON configuration is retired                              |
| Formatting         | Text substitutions only; user transforms are not evaluated as code                                        |
| Source             | Bounded authenticated provider API reads from explicitly linked repositories                              |
| Rust failures      | Typed `DelogError` includes transport, HTTP, GraphQL, and invalid acknowledgement failures                |
| Time/retention     | New receipt time controls expiration; imported records retain event time but start a new receipt lifetime |

Legacy environment aliases `DELOG_PRIVATE_OWNER_IDENTONYM`, `DELOG_PRIVATE_OWNER_KEY`,
`DELOG_PRIVATE_TOKEN`, `DELOG_PRIVATE_USAGE`, `DELOG_CUSTOM_LOGIC_USAGE`, and `PORT` remain
recognized. Explicit modern configuration takes precedence. Unsupported storage settings
fail with migration instructions instead of silently opening a different database.

The UI preserves Delog’s Plurid workflow and adds a conventional list fallback. Plane
routes/definitions and initial view are stable module-level values; Delog state lives in
React/API resources, while Plurid owns spatial navigation. Published Plurid 0.0.0-37 is used
without patches. The unpublished adjacent development checkout is reference, not a build
dependency. Spatial assets load only when the spatial view is requested.

## Migrating stored data

1. Stop ingestion to the old deployment and back up its complete data/configuration.
2. Export a **single owner’s** records and optional collections as plain JSON. Convert BSON
   IDs/wrappers to string IDs and timestamps to numbers; remove Mongo-specific wrappers.
3. Convert old tester configuration to the documented JSON form and keep only safe format
   substitutions. Match the current provider/notifier inputs. Keep original entity IDs so
   repositories and tests retain relationships.
4. Validate without writing to the destination, then apply to a new empty root:

```sh
node packages/delog-server/build/cli.mjs migrate ./export.json --owner owner --data-root ./new-data
node packages/delog-server/build/cli.mjs migrate ./export.json --owner owner --data-root ./new-data --apply
node packages/delog-server/build/cli.mjs doctor --data-root ./new-data
```

Accepted inputs are a records array, records NDJSON, or an object containing `records` and
optional `projects`, `spaces`, `tokens`, `formats`, `testers`, `notifiers`, `providers`,
`repositories`, and `tests` arrays. Imports are limited to 100 MB. Split larger datasets
into an external preparation step; the importer intentionally requires an empty destination
and does not append multiple chunks.

Dry runs validate the complete collection graph in an isolated temporary database. Apply
validates through the same service and commits every collection in one transaction. A
validation failure rolls everything back. The destination must be offline and empty.
All imported data is assigned to the explicitly supplied owner; multi-owner exports must
be separated before import. Tokens with legacy plaintext `value` retain that credential
as a hash; create/rotate credentials for exports that do not include their value. Existing
sessions and pending notification/test work are not imported from the legacy runtime.
Import does not replay historical notifications or tests.

5. Start 0.2 against the new root, verify record counts, filters, entity relationships, and
   representative client submissions. Point clients at the new endpoint/token, then resume
   normal ingestion. Keep the old deployment offline with its original data for rollback.

No automatic in-place migration is performed. A 0.2 SQLite backup is restored using the
operations guide, not re-imported as a legacy export. Versioned schema checks reject future
unknown SQLite schemas; rollback uses the backup and matching runtime together.
