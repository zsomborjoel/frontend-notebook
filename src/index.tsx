import * as esbuild from 'esbuild-wasm';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugin/UnpackagePlugin';

const App = (): any => {
    const ref = useRef<any>();
    const [input, setInput] = useState<string>('');
    const [code, setCode] = useState<string>('');

    const startService = async (): Promise<void> => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm',
        });
    };

    useEffect(() => {
        startService();
    }, []);

    const onClick = async (): Promise<void> => {
        // Only allow user to make click work when service available
        if (!ref.current) {
            return;
        }

        const result = await ref.current.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window',
            },
        });

        setCode(result.code);
    };

    return (
        <div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} />
            <div>
                <button type="button" onClick={onClick}>
                    Submit
                </button>
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.querySelector('#root'));
