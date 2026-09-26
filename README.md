# delog

Delog centralizes logs from services in a local cluster. Run one self-hosted server,
send records from JavaScript, Python, Rust, or the CLI, and explore them in a Plurid
workspace. Projects and spaces organize records; correlated tests and notifications
connect logging to operations.

The 0.2 runtime follows Hypod’s local deployment model: explicit lifecycle, one process
per data root, SQLite persistence, shared contracts, and installable packages.

## Run from this checkout

Use Node **24.15+**, pnpm **11.25**, Python **3.10+**, and Rust **1.85+**. Python and Rust
are needed only for their respective clients and the complete verification suite.

```sh
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
cp .env.example .env
```

Set different values for `DELOG_OWNER_KEY` and `DELOG_INGEST_TOKEN` in `.env`. Generate
secrets with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`.
Then:

```sh
pnpm build
pnpm start
```

Open **http://127.0.0.1:56965** and sign in as `owner` using `DELOG_OWNER_KEY`. The server
stores data under `./data`. The default retention is **30 days after receipt**; set
`DELOG_RETENTION_DAYS=0` to disable automatic record expiration.

Create separate ingestion tokens in the console for your services. Ingestion tokens
can submit records but cannot read logs or administer the server.

```ts
import { createDelogClient } from '@plurid/delog';

const log = createDelogClient({
  endpoint: 'http://127.0.0.1:56965/graphql',
  token: process.env.DELOG_TOKEN,
  project: 'cluster-api',
  space: 'database',
});

await log.info('Database connection restored');
await log.flush();
```

Use `/?view=list` for the conventional table view. Spatial view opens records and source
in linked Plurid planes; the console remains their parent. All Plurid dependencies use
published packages. No package patch is required.

## Packages

| Package                                                   | Purpose                                  |
| --------------------------------------------------------- | ---------------------------------------- |
| [`@plurid/delog-server`](packages/delog-server)           | Server, web console, and maintenance CLI |
| [`@plurid/delog-contracts`](packages/delog-contracts)     | Wire types, levels, GraphQL schema       |
| [`@plurid/delog`](packages/delog-client/delog-javascript) | JavaScript / TypeScript client           |
| [`@plurid/delog-cli`](packages/delog-client/delog-cli)    | Login, profiles, and shell logging       |
| [`delog`](packages/delog-client/delog-python)             | Dependency-free Python client            |
| [`plurid_delog`](packages/delog-client/delog-rust)        | Async Rust client                        |

JavaScript packages provide ESM, CommonJS, and declaration files. The active code is in
`src/` and `delog-server/ui/`; the old `source/`, `scripts/`, `configurations/`, and `binder/`
directories remain historical reference and are excluded from current builds. Source
is kept readable and enforced by formatting checks; production assets may be minified.

## Develop and verify

After building, run `pnpm start` in one terminal and `pnpm dev` in another. Vite serves
http://127.0.0.1:56964 and proxies API calls to port 56965.

```sh
pnpm verify
```

This checks formatting, lint, TypeScript, server/SDK/CLI integration tests, Python and Rust
tests, production builds, browser flows, and offline installation of the four npm
tarballs. Local browser tests use installed Chrome. CI installs Playwright Chromium.
To use Playwright Chromium locally, run `pnpm exec playwright install chromium` and
`CI=1 pnpm test:e2e`.

Dependencies are centralized in `pnpm-workspace.yaml` and pinned by `pnpm-lock.yaml`.
TypeScript 7 performs type checks; the TypeScript 6 compiler library satisfies the current
ESLint parser and declaration bundler APIs. Rust has a committed Cargo lockfile.

## Operate and migrate

- [Operations](docs/operations.md): deployment, backups, recovery, retention, and notifications.
- [Compatibility and migration](docs/compatibility.md): retained contracts and explicit changes.
- [Architecture](docs/modernization.md): runtime boundaries and Plurid integration.
- [Domain context](CONTEXT.md): records, tests, credentials, and ownership invariants.

`docker compose up --build -d` runs the server with a persistent local volume and binds
port 56965 to localhost. Cluster access and reverse proxy settings are described in the
operations guide. The source changes do not migrate, deploy, or publish an existing instance.
