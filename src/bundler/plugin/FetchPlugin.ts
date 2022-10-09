import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

// For storing transpiled code in more compact way
const fileCache = localForage.createInstance({
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
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
        build.onLoad({ filter: /(^index\.js$)/ }, () => ({
            loader: 'jsx',
            contents: inputCode,
        }));

        // eslint-disable-next-line consistent-return
        build.onLoad({ filter: /.*/ }, async (args: any) => {
            const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

            if (cachedResult) {
                return cachedResult;
            }
        });

        // Check if we already fetched this file
        // and if its in the chache
        build.onLoad({ filter: /.css$/ }, async (args: any) => {
            const { data, request } = await axios.get(args.path);
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
            const { data, request } = await axios.get(args.path);

            const result: esbuild.OnLoadResult = {
                loader: 'jsx',
                contents: data,
                resolveDir: new URL('./', request.responseURL).pathname,
            };
            await fileCache.setItem(args.path, result);

            return result;
        });
    },
});
