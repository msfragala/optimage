import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { resolve } from 'path';

export default defineConfig({
  plugins: [solidPlugin()],
  root: resolve('./src/web/'),
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
  build: {
    outDir: resolve('./dist'),
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
