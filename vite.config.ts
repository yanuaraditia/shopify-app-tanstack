import fs from 'node:fs';
import path from 'node:path';
import {builtinModules} from 'node:module';

import {defineConfig} from 'vite';

import pkg from './package.json';

const adapterBasePath = path.resolve(__dirname, 'src/server/adapters');

const adapterEntries = fs
  .readdirSync(adapterBasePath, {withFileTypes: true})
  .filter((dirent) => dirent.isDirectory() && dirent.name !== '__tests__')
  .reduce<Record<string, string>>((entries, {name}) => {
    entries[`server/adapters/${name}/index`] = path.resolve(
      adapterBasePath,
      name,
      'index.ts',
    );

    return entries;
  }, {});

const input = {
  'server/index': path.resolve(__dirname, 'src/server/index.ts'),
  'server/test-helpers/index': path.resolve(
    __dirname,
    'src/server/test-helpers/index.ts',
  ),
  'react/index': path.resolve(__dirname, 'src/react/index.ts'),
  ...adapterEntries,
};

const externalDeps = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.optionalDependencies ?? {}),
  ...builtinModules,
  ...builtinModules.map((moduleName) => `node:${moduleName}`),
];

export default defineConfig(({mode}) => {
  const isEsm = mode === 'esm';

  return {
    build: {
      target: 'es2022',
      sourcemap: true,
      minify: false,
      emptyOutDir: false,
      outDir: isEsm ? 'dist/esm' : 'dist/cjs',
      rollupOptions: {
        input,
        external: externalDeps,
        output: {
          format: isEsm ? 'es' : 'cjs',
          entryFileNames: isEsm ? '[name].mjs' : '[name].js',
          chunkFileNames: isEsm
            ? 'chunks/[name]-[hash].mjs'
            : 'chunks/[name]-[hash].js',
          exports: 'auto',
        },
      },
    },
  };
});