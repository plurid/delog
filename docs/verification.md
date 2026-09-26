# Modernization verification

Verified locally on 2026-09-05. The current application code is in `src/` and `ui/`.
Historical source/build-tool directories are excluded from the active checks.

| Check                                  | Result                                                                                                         |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `pnpm verify`                          | Passed: formatting, ESLint, TypeScript 7, tests, builds, browser checks, npm tarballs                          |
| TypeScript integration tests           | 32 passed across 7 files                                                                                       |
| Python unittest suite                  | 6 passed                                                                                                       |
| Rust tests                             | 4 passed                                                                                                       |
| Playwright workflows                   | 2 passed with isolated Chrome and temporary data roots                                                         |
| `pnpm pack:check`                      | Four tarballs install offline; ESM/CommonJS imports, public TypeScript declarations, and CLI entry points pass |
| Python wheel                           | Built successfully; imports directly from the wheel without runtime dependencies                               |
| `cargo package --locked --allow-dirty` | Crate packaged and compiled successfully; nothing published                                                    |
| Docker                                 | Final image builds; serves the UI and accepts records as a non-root user with a read-only root filesystem      |
| `pnpm audit --prod`                    | No advisories reported in the final production dependency graph                                                |
| `git diff --check HEAD`                | Passed                                                                                                         |

Server coverage includes lazy lifecycle, restart persistence, single-writer locks, rejection
of unknown schemas before DDL, owner isolation, ingestion/admin separation, session and
token revocation, custom/public authentication, legacy `/delog` GraphQL ingestion, ordinary
fragments and complexity limits, atomic batches/migration, online backup, test recovery,
notification retries and HTTP delivery, source traversal/size limits, pagination, and
analytics time buckets.

Browser workflows exercise rejected and successful login, record search and empty states,
project/token creation, tester editing, details, deletion cancellation, keyboard opening
and reopening of Plurid planes, public-mode administrator login, mobile overflow, and
logout. No uncaught page errors occurred in the tested workflows. Manual browser inspection
also checked desktop/mobile rendering, linked planes, project creation, and analytics.
At 390 pixels, the document stays within the viewport and the record table scrolls inside
its own container. The UI mechanical detector returned no findings.

The production build emits advisory warnings for intentional CommonJS compatibility
outputs and the optional Plurid bundle (about 544 kB minified, 153 kB gzip). The initial
list/login bundle is about 222 kB minified, 69 kB gzip; spatial code loads on demand.

Live GitHub/Bitbucket credentials and SMTP delivery were not exercised. Source adapters
were tested with controlled provider responses; HTTP notifications used a real local
receiver. No existing deployment, stored dataset, or production migration was used.
The CI workflow is added but has not been executed by GitHub Actions in this session.
