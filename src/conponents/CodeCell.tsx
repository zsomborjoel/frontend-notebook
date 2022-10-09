// eslint-disable-next-line no-use-before-define
import React, { useEffect } from 'react';
import './code-cell.css';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import Resizable from './Resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/UseActions';
import { useTypedSelector } from '../hooks/UseTypesSelector';
import { useCumulativeCode } from '../hooks/UseCumulativeCode';

interface CodeCellProps {
    cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
    const { updateCell, createBundle } = useActions();
    const bundle = useTypedSelector((state) => state.bundles[cell.id]);
    const cumulativeCode = useCumulativeCode(cell.id);

    useEffect(() => {
        if (!bundle) {
            createBundle(cell.id, cumulativeCode);
            return;
        }

        const timer = setTimeout(async () => {
            createBundle(cell.id, cumulativeCode);
        }, 750);

        // Automatically called after next time use effect called
        // eslint-disable-next-line consistent-return
        return () => {
            clearTimeout(timer);
        };
    }, [cumulativeCode, cell.id, createBundle]);

    return (
        <Resizable direction="vertical">
            <div
                style={{
                    height: 'calc(100% - 10px)',
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <Resizable direction="horizontal">
                    <CodeEditor initialValue={cell.content} onChange={(value) => updateCell(cell.id, value)} />
                </Resizable>
                <div className="progress-wrapper">
                    {!bundle || bundle.loading ? (
                        <div className="progress-cover">
                            <progress className="progress is-small is-primary" max="100">
                                Loading
                            </progress>
                        </div>
                    ) : (
                        <Preview code={bundle.code} err={bundle.err} />
                    )}
                </div>
            </div>
        </Resizable>
    );
};

export default CodeCell;
