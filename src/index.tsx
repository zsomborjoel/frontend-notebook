import * as esbuild from 'esbuild-wasm';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugin/UnpackagePlugin';
import { fetchPlugin } from './plugin/FetchPlugin';

const App = (): any => {
    const ref = useRef<any>();
    const iframe = useRef<any>();
    const [input, setInput] = useState<string>('');
    const [code, setCode] = useState<string>('');

    const startService = async (): Promise<void> => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm', // getting binary from unpkg.com
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
            plugins: [unpkgPathPlugin(), fetchPlugin(input)],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window',
            },
        });

        //setCode(result.outputFiles[0].text);

        iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
    };

    // double script tag will be split boundle - as browser looking for closed script tag
    const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            eval(event.data);
          }, false);
        </script>
      </body>
    </html>
  `;


    // iframe - sandbox we don't have direct acces between parent and child, only allows html like this by default
    // iframe - srcDoc using content from local file
    return (
        <div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} />
            <div>
                <button type="button" onClick={onClick}>
                    Submit
                </button>
            </div>
            <pre>{code}</pre>
            <iframe title="test" ref={iframe} sandbox="allow-scripts" srcDoc={html} />
        </div>
    );
};

ReactDOM.render(<App />, document.querySelector('#root'));
