// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import bundle from '../bundler';
import Resizable from './Resizable';

const CodeCell = (): any => {
    const [code, setCode] = useState('');
    const [input, setInput] = useState('');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onClick = async (): Promise<void> => {
        const output = await bundle(input);
        setCode(output);
    };

    return (
        <Resizable direction="vertical">
            <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
                <Resizable direction="horizontal">
                    <CodeEditor initialValue="const a = 1;" onChange={(value) => setInput(value)} />
                </Resizable>
                <Preview code={code} />
            </div>
        </Resizable>
    );
};

export default CodeCell;
