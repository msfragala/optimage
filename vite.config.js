import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: resolve('./public'),
  plugins: [preact()],
  root: resolve('./src/'),
  assetsInclude: ['**/*.{avif,png,jpg,jpeg,webp,wasm}'],
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
  build: {
    outDir: resolve('./dist'),
    target: 'modules',
    polyfillDynamicImport: false,
    emptyOutDir: true,
  },
});
