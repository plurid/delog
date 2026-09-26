import { createDelogClient } from '@plurid/delog';

const client = createDelogClient({
  project: 'delog',
  space: 'fixtures',
  context: { call: { repository: { basePath: process.cwd() } } },
});

await client.info({ text: 'Logged from a nested file', method: 'subfolder' });
