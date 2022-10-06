/* eslint-disable no-console */
import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

// For storing transpiled code in more compact way
const fileCache = localforage.createInstance({
    name: 'filecache',
});

export const unpkgPathPlugin = (): any => ({
    name: 'unpkg-path-plugin', // for debugging
    setup(build: esbuild.PluginBuild) {
        /**
         * onResolve
         * Hijacks / Intercepts es build natural process where the file stored
         * 1) Figure out where the index.js file stored
         * 3) Attempt to load up the index.js file
         *
         * namespace -> specific files
         */
        build.onResolve({ filter: /.*/ }, async (args: any) => {
            console.log('onResole', args);

            if (args.path === 'index.js') {
                return { path: args.path, namespace: 'a' };
            }

            if (args.path.includes('./') || args.path.includes('../')) {
                return {
                    namespace: 'a',
                    path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
                };
            }

            return {
                namespace: 'a',
                path: `https://unpkg.com/${args.path}`,
            };

            /*
            if (args.path === 'tiny-test-pkg') {
                return {
                    path: 'https://unpkg.com/tiny-test-pkg@1.0.0/index.js',
                    namespace: 'a',
                };
            }
            */
        });

        /**
         * onLoad
         * Hijacks / Intercepts es build to load files for trasnpiling (index.js)
         * 2) If there is any import figure out where the file is
         * 4) Attempt to load the file up
         */
        build.onLoad({ filter: /.*/ }, async (args: any) => {
            console.log('onLoad', args);

            if (args.path === 'index.js') {
                return {
                    loader: 'jsx',
                    contents: `
              const message = require('react');
              console.log(message);
            `,
                };
            }

            // Check if we already fetched this file
            // and if its in the chache
            const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

            // if it is, return
            if (cachedResult) {
                return cachedResult;
            }

            const { data, request } = await axios.get(args.path);

            const result: esbuild.OnLoadResult = {
                loader: 'jsx',
                contents: data,
                resolveDir: new URL('./', request.responseURL).pathname,
            };

            // store response in cache
            await fileCache.setItem(args.path, result);

            return result;
        });
    },
});
