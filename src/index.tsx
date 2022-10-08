// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import ReactDOM from 'react-dom';
import CodeEditor from './conponents/CodeEditor';
import Preview from './conponents/Preview';
import bundle from './bundler';

const App = (): any => {
    const [input, setInput] = useState<string>('');
    const [code, setCode] = useState<string>('');

    const onClick = async (): Promise<void> => {
        const output = await bundle(input);
        setCode(output);
    };

    return (
        <div>
            <CodeEditor initialValue="const a = 1;" onChange={(value) => setInput(value)} />
            <textarea value={input} onChange={(e) => setInput(e.target.value)} />
            <div>
                <button type="button" onClick={onClick}>
                    Submit
                </button>
            </div>
            <Preview code={code} />
        </div>
    );
};

ReactDOM.render(<App />, document.querySelector('#root'));
