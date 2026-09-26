# plurid_delog

Async Rust client for Delog 0.2. Rust 1.85+ (edition 2024); reqwest uses rustls.

```rust,no_run
use plurid_delog::{Client, DelogLevel, Record};

async fn record_start() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new(
        "http://127.0.0.1:56965/graphql",
        std::env::var("DELOG_TOKEN")?,
    )?;
    let mut record = Record::new("Service started", DelogLevel::Info);
    record.project = Some("api".into());
    client.record(&record).await?;
    Ok(())
}
```

`Client` reuses its HTTP connection pool, bounds responses and request duration, and checks
both HTTP status and GraphQL acknowledgement. It does not follow redirects. New records
use epoch microseconds. `Record.context` accepts `serde_json::Value` for correlation/source
metadata.

The original `delog(DelogCall::Str("message"))` and `DelogCall::Data(DelogData { .. })` forms
remain available, with defaults from `DELOG_ENDPOINT`, `DELOG_TOKEN`, `DELOG_PROJECT`,
`DELOG_SPACE`, and `DELOG_FORMAT`. These convenience calls create a client per call; reuse
`Client` for sustained logging. Failures now return the typed `DelogError` instead of only
`reqwest::Error`, so server rejections cannot be mistaken for successful delivery.

```sh
cargo test --manifest-path packages/delog-client/delog-rust/Cargo.toml
```
