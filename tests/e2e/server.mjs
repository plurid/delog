import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDelog } from '../../packages/delog-server/build/index.mjs';

const dataRoot = mkdtempSync(join(tmpdir(), 'delog-e2e-'));
const application = createDelog({
  dataRoot,
  port: 56966,
  owner: { identonym: 'owner', key: 'e2e-owner-password' },
  ingestToken: 'e2e-ingestion-token',
  retentionDays: 0,
});
await application.start();
console.log('Delog browser test server ready.');
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  await application.close();
  rmSync(dataRoot, { recursive: true, force: true });
}
process.on('SIGTERM', () => void close());
process.on('SIGINT', () => void close());
