import { randomUUID } from 'node:crypto';
import { createDelogClient } from '@plurid/delog';

const client = createDelogClient({
  project: 'example',
  context: {
    mode: 'TESTING',
    suite: 'requests',
    scenario: 'success',
    sharedID: randomUUID(),
  },
});

await client.info({ text: 'request started', context: { sharedOrder: 0 } });
await client.info({ text: 'request finished', method: 'finish', context: { sharedOrder: 1 } });
await client.flush();
console.log('Recorded both test phases.');
