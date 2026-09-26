import { createDelogClient } from '@plurid/delog';

const client = createDelogClient({
  project: 'example',
  space: 'caller',
  context: { call: { repository: { basePath: process.cwd() } } },
});

export async function anotherFunction() {
  await client.error({ text: 'Caller context example', method: 'anotherFunction' });
}

export async function someFunction() {
  await anotherFunction();
}
