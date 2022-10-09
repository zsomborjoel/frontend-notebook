// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
import { clearTimeout } from 'timers';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import bundle from '../bundler';
import Resizable from './Resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/UseActions';

interface CodeCellProps {
    cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }): any => {
    const [code, setCode] = useState('');
    const [err, setErr] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [input, setInput] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { updateCell } = useActions();

    useEffect(() => {
        const timer = setTimeout(async () => {
            const output = await bundle(cell.content);
            setCode(output.code);
            setErr(output.err);
        }, 750);

        // Automatically called after next time use effect called
        return () => {
            clearTimeout(timer);
        };
    }, [cell.content]);

    return (
        <Resizable direction="vertical">
            <div style={{ height: 'calc(100% - 10px)', display: 'flex', flexDirection: 'row' }}>
                <Resizable direction="horizontal">
                    <CodeEditor initialValue={cell.content} onChange={(value) => setInput(value)} />
                </Resizable>
                <Preview code={code} err={err} />
            </div>
        </Resizable>
    );
};

export default CodeCell;
