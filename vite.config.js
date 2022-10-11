import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import preprocess from 'svelte-preprocess';

export default defineConfig({
  publicDir: resolve('./public'),
  plugins: [svelte({ preprocess: preprocess() })],
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
