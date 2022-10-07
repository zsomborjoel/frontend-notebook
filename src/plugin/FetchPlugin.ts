/* eslint-disable no-console */
import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

// For storing transpiled code in more compact way
const fileCache = localforage.createInstance({
    name: 'filecache',
});

/**
 * namespace -> specific files
 * onLoad
 * Hijacks / Intercepts es build to load files for trasnpiling (index.js)
 * 2) If there is any import figure out where the file is
 * 4) Attempt to load the file up
 */
export const fetchPlugin = (inputCode: string): any => ({
    name: 'fetch-plugin', // for debugging
    setup(build: esbuild.PluginBuild) {
        build.onLoad({ filter: /.*/ }, async (args: any) => {
            if (args.path === 'index.js') {
                return {
                    loader: 'jsx',
                    contents: inputCode,
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
