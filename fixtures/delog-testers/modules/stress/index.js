import { createDelogClient } from '@plurid/delog';

const count = Number(process.env.DELOG_STRESS_COUNT ?? 1000);
if (!Number.isInteger(count) || count < 1 || count > 1000000) {
  throw new Error('DELOG_STRESS_COUNT must be between 1 and 1000000.');
}

const client = createDelogClient({ project: 'example', space: 'stress' });
const concurrency = 10;
for (let offset = 0; offset < count; offset += concurrency) {
  const batch = Math.min(concurrency, count - offset);
  await Promise.all(
    Array.from({ length: batch }, (_, index) =>
      client.trace({ text: `Stress record ${offset + index}`, method: 'stress' }),
    ),
  );
}
await client.flush();
console.log(`Acknowledged ${count} records.`);
