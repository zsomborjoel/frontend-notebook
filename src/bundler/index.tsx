import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugin/UnpackagePlugin';
import { fetchPlugin } from './plugin/FetchPlugin';

let service: esbuild.Service;

// eslint-disable-next-line import/no-anonymous-default-export
const bundle = async (rawCode: string): Promise<any> => {
    if (!service) {
        service = await esbuild.startService({
            worker: true,
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm', // getting binary from unpkg.com
        });
    }

    try {
        const result = await service.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window',
            },
            jsxFactory: '_React.createElement',
            jsxFragment: '_React.Fragment',
        });

        return {
            code: result.outputFiles[0].text,
            err: '',
        };
    } catch (err) {
        return {
            code: '',
            err: 'error on bundle',
        };
    }
};

export default bundle;
