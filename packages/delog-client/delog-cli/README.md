# @plurid/delog-cli

Shell client for Delog 0.2. Requires Node 24.15+.

```sh
export DELOG_OWNER_KEY='your-owner-password'
delog login --server http://127.0.0.1:56965 --identonym owner
delog status
delog record 'Service started' --project api --space worker
delog record -t 'Failed' --level error --error 'Connection refused'
printf 'first record\nsecond record\n' | delog record --stdin
delog logout
```

Login stores an eight-hour revocable session, never the owner password. Profiles are
written atomically with mode `0600` to `$XDG_CONFIG_HOME/delog/config.json` (normally
`~/.config/delog/config.json`). `DELOG_CONFIG` overrides the path. Logout revokes the server
session before removing its local profile.

Services should use ingestion tokens instead of owner sessions:

```sh
export DELOG_ENDPOINT=http://127.0.0.1:56965/graphql
export DELOG_TOKEN='your-ingestion-token'
delog record 'Job complete' --project jobs
```

A server origin is resolved through `/api/config`; an explicit GraphQL URL is used as-is.
`record` supports the original `-t/-l/-p/-s/-f/-m/-e/-x/-c/-r` options plus a positional
message and `--stdin`. Context is JSON. `setup --format <identifier>` saves a default format;
`setup --default true` selects the current profile. Invalid input or rejected records exit
nonzero. `--help` describes each command.

Old plaintext-password CLI configuration is not imported. Sign in again after upgrading.
