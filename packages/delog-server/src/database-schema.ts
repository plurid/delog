/** Schema version 1. All owner data is scoped explicitly, including queue work. */
export const databaseSchema = `
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = FULL;
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;

  CREATE TABLE IF NOT EXISTS metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  ) STRICT;

  CREATE TABLE IF NOT EXISTS records (
    owner TEXT NOT NULL,
    id TEXT NOT NULL,
    time INTEGER NOT NULL,
    received_at INTEGER NOT NULL,
    level INTEGER NOT NULL CHECK(level BETWEEN 1 AND 6),
    project TEXT NOT NULL,
    space TEXT NOT NULL,
    shared_id TEXT NOT NULL,
    body TEXT NOT NULL,
    PRIMARY KEY(owner, id)
  ) STRICT;
  CREATE INDEX IF NOT EXISTS records_time ON records(owner, time DESC, id DESC);
  CREATE INDEX IF NOT EXISTS records_project ON records(owner, project, time DESC, id DESC);
  CREATE INDEX IF NOT EXISTS records_correlation ON records(owner, shared_id);

  CREATE TABLE IF NOT EXISTS entities (
    owner TEXT NOT NULL,
    kind TEXT NOT NULL,
    id TEXT NOT NULL,
    unique_key TEXT NOT NULL,
    body TEXT NOT NULL,
    PRIMARY KEY(owner, kind, id),
    UNIQUE(owner, kind, unique_key)
  ) STRICT;

  CREATE TABLE IF NOT EXISTS sessions (
    hash TEXT PRIMARY KEY,
    owner TEXT NOT NULL,
    expires INTEGER NOT NULL
  ) STRICT;

  CREATE TABLE IF NOT EXISTS test_runs (
    owner TEXT NOT NULL,
    id TEXT NOT NULL,
    tester TEXT NOT NULL,
    project TEXT NOT NULL,
    suite TEXT NOT NULL,
    scenario TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    next_at INTEGER NOT NULL,
    deadline INTEGER NOT NULL,
    configuration TEXT NOT NULL,
    PRIMARY KEY(owner, id)
  ) STRICT;

  CREATE TABLE IF NOT EXISTS tests (
    owner TEXT NOT NULL,
    id TEXT NOT NULL,
    time INTEGER NOT NULL,
    body TEXT NOT NULL,
    PRIMARY KEY(owner, id)
  ) STRICT;

  CREATE TABLE IF NOT EXISTS outbox (
    id TEXT PRIMARY KEY,
    owner TEXT NOT NULL,
    notifier TEXT NOT NULL,
    body TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    next_at INTEGER NOT NULL,
    last_error TEXT
  ) STRICT;
  CREATE INDEX IF NOT EXISTS outbox_due ON outbox(next_at, attempts);
`;
