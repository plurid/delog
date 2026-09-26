import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [react()],
  root: 'ui',
  server: {
    port: 56964,
    proxy: { '/api': 'http://127.0.0.1:56965', '/graphql': 'http://127.0.0.1:56965' },
  },
  build: { outDir: '../build/client', emptyOutDir: false, sourcemap: true },
});
