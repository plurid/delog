# Notification receiver

A dependency-free local HTTP receiver for manual integration checks:

```sh
pnpm --filter @delog-fixtures/notification-receiver start
```

Create an API notifier for `http://127.0.0.1:3000`. The receiver prints JSON payloads and
the stable `Delog-Delivery` identifier, then returns 204. `PORT` overrides port 3000.
It binds localhost, bounds requests to 1 MiB, and has no persistence. Production receivers
should authenticate `Delog-Secret` and deduplicate delivery IDs.
