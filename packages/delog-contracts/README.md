# @plurid/delog-contracts

Shared Delog 0.2 wire types, record levels, GraphQL ingestion document, and compatibility
schema. This package has no runtime dependencies or import-time side effects.

```ts
import { delogLevels, type DelogInputRecord } from '@plurid/delog-contracts';

const record: DelogInputRecord = {
  text: 'ready',
  level: delogLevels.info,
  time: Date.now() * 1000,
  unit: 'us',
};
```

Times on stored records are epoch microseconds. Ingestion accepts `s`, `ms`, and `us` and
normalizes them. Levels remain trace=1, debug=2, info=3, warn=4, error=5, fatal=6.
