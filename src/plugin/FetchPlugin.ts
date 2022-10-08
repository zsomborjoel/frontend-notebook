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
 *
 * onLoad only rans if filter matached. No need to return anything.
 * Eventually Es build need to find one onLoad at least which returns an object
 */
export const fetchPlugin = (inputCode: string): any => ({
    name: 'fetch-plugin', // for debugging
    setup(build: esbuild.PluginBuild) {
        build.onLoad({ filter: /.*/ }, async (args: any) => {
            const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

            if (cachedResult) {
                return cachedResult;
            }

            return null;
        });

        build.onLoad({ filter: /(^index\.js$)/ }, () => ({ loader: 'jsx', contents: inputCode }));

        build.onLoad({ filter: /.css$/ }, async (args: any) => {
            // Check if we already fetched this file
            // and if its in the chache
            const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

            // if it is, return
            if (cachedResult) {
                return cachedResult;
            }

            const { data, request } = await axios.get(args.path);

            // new line, double quote, single quote
            const escaped = data.replace(/\n/g, '').replace(/"/g, '\\"').replace(/'/g, "\\'");
            const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
            `;

            const result: esbuild.OnLoadResult = {
                loader: 'jsx',
                contents,
                resolveDir: new URL('./', request.responseURL).pathname,
            };

            // store response in cache
            await fileCache.setItem(args.path, result);

            return result;
        });

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
