#!/usr/bin/env node
import { cli } from './index.js';
void cli().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
