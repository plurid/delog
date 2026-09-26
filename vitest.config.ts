import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/*/src/**/*.test.ts', 'packages/delog-client/*/src/**/*.test.ts'],
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
