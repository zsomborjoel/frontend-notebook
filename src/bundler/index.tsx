import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugin/UnpackagePlugin';
import { fetchPlugin } from './plugin/FetchPlugin';

let service: esbuild.Service;

// eslint-disable-next-line import/no-anonymous-default-export
export default async (rawCode: string): Promise<string> => {
    if (!service) {
        service = await esbuild.startService({
            worker: true,
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm', // getting binary from unpkg.com
        });
    }

    const result = await service.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
        define: {
            'process.env.NODE_ENV': '"production"',
            global: 'window',
        },
    });

    return result.outputFiles[0].text;
};
