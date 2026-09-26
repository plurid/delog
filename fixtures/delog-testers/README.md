# Tester fixture

Create the `example` project and a tester with suite `requests`, scenario `success`, and
phases `request started` / `request finished` (both level `info`; second method `finish`).
Set `DELOG_ENDPOINT` and an ingestion `DELOG_TOKEN`, then run from the repository root:

```sh
pnpm --filter @delog-fixtures/testers start
```

Each run generates a new correlation ID and emits zero-based ordered phases through the
current workspace client. Build the workspace first.
