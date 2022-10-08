/* eslint-disable no-console */
import * as esbuild from 'esbuild-wasm';

/**
 * onResolve
 * Hijacks / Intercepts es build natural process where the file stored
 * 1) Figure out where the index.js file stored
 * 3) Attempt to load up the index.js file
 */
export const unpkgPathPlugin = (): any => ({
    name: 'unpkg-path-plugin', // for debugging
    setup(build: esbuild.PluginBuild) {
        // Handle root entry file of index.js
        build.onResolve({ filter: /(^index\.js$)/ }, () => ({ path: 'index.js', namespace: 'a' }));

        // Handle relative path in a module
        build.onResolve({ filter: /^\.+\// }, (args: any) => ({
            namespace: 'a',
            path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
        }));

        // Handle main file a main file of a module
        build.onResolve({ filter: /.*/ }, async (args: any) => ({
            namespace: 'a',
            path: `https://unpkg.com/${args.path}`,
        }));
    },
});
