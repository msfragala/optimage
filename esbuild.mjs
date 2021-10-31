import esbuild from 'esbuild';
import { createRequire } from 'module';
import { globbySync } from 'globby';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

/** @type {import('esbuild').BuildOptions} */
const endpointOptions = {
  entryPoints: globbySync(['./src/server/*.ts']),
  outdir: './api',
};

/** @type {import('esbuild').BuildOptions} */
const workerOptions = {
  entryPoints: globbySync(['./src/server/workers/*.ts']),
  outdir: './api/_workers',
};

[endpointOptions, workerOptions].forEach(options => {
  esbuild.build({
    ...options,
    bundle: true,
    format: 'esm',
    external: Object.keys(pkg.dependencies),
    platform: 'node',
    target: 'node14',
    watch: process.argv.includes('-w'),
  });
});
