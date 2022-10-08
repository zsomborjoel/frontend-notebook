// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import bundle from '../bundler';

const CodeCell = (): any => {
    const [code, setCode] = useState('');
    const [input, setInput] = useState('');

    const onClick = async (): Promise<void> => {
        const output = await bundle(input);
        setCode(output);
    };

    return (
        <div>
            <CodeEditor initialValue="const a = 1;" onChange={(value) => setInput(value)} />
            <div>
                <button type="button" onClick={onClick}>
                    Submit
                </button>
            </div>
            <Preview code={code} />
        </div>
    );
};

export default CodeCell;
