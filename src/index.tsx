import 'bulmaswatch/superhero/bulmaswatch.min.css';
import * as esbuild from 'esbuild-wasm';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugin/UnpackagePlugin';
import { fetchPlugin } from './plugin/FetchPlugin';
import CodeEditor from './conponents/CodeEditor';

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

    // double script tag will be split boundle - as browser looking for closed script tag
    const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch(err) {
              // when error happens put error in div
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
    `;

    const onClick = async (): Promise<void> => {
        // Only allow user to make click work when service available
        if (!ref.current) {
            return;
        }

        iframe.current.srcdoc = html;

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

        // setCode(result.outputFiles[0].text);

        iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
    };

    // iframe - sandbox we don't have direct acces between parent and child, only allows html like this by default
    // iframe - srcDoc using content from local file
    return (
        <div>
            <CodeEditor initialValue="const a = 1;" onChange={(value) => setInput(value)} />
            <textarea value={input} onChange={(e) => setInput(e.target.value)} />
            <div>
                <button type="button" onClick={onClick}>
                    Submit
                </button>
            </div>
            <pre>{code}</pre>
            <iframe title="code preview" ref={iframe} sandbox="allow-scripts" srcDoc={html} />
        </div>
    );
};

ReactDOM.render(<App />, document.querySelector('#root'));
