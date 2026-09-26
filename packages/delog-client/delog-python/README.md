# delog for Python

Dependency-free synchronous client for Python 3.10+.

```sh
python -m pip install ./packages/delog-client/delog-python
```

```python
import os
from delog import Client, DelogError

client = Client(
    'http://127.0.0.1:56965/graphql',
    os.environ['DELOG_TOKEN'],
    project='api',
    timeout=10,
)

try:
    client.record('Database connected', level='info', space='database')
except DelogError as error:
    print(error)
```

`Client.record` returns `True` after acknowledgement, `False` when filtered, and raises
`DelogError` for delivery/rejection failures. Requests time out and never forward credentials
through redirects. Timestamps are epoch microseconds. Context is copied; legacy `shared_id`
and `shared_order` keys map to `sharedID` and `sharedOrder`.

The original `from delog import delog; delog('message', level=3)` API remains nonthrowing
for delivery errors and reads environment defaults when called. Configure `DELOG_ENDPOINT`,
`DELOG_TOKEN`, `DELOG_PROJECT`, `DELOG_SPACE`, `DELOG_FORMAT`, `DELOG_GROUND_LEVEL`, and
`DELOG_QUIET`. Ground level 0 includes all records; 7 disables logging.

Run tests from the repository root with `pnpm test:python`, or:

```sh
python -m unittest discover -s packages/delog-client/delog-python/tests
```
