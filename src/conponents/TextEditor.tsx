// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef, useState } from 'react';
import './text-editor.css';
import MDEditor from '@uiw/react-md-editor';
import { Cell } from '../state';
import { useActions } from '../hooks/UseActions';

interface TextEditorProps {
    cell: Cell;
}

/**
 * Responsible for initialize a text editor MDEditor where code can be written
 * @param param0
 * @returns
 */
const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [editing, setEditing] = useState(false);
    const { updateCell } = useActions();

    // Toggling where is click
    useEffect(() => {
        const listener = (event: MouseEvent): void => {
            if (ref.current && event.target && ref.current.contains(event.target as Node)) {
                // Inside editor
                return;
            }

            setEditing(false);
        };

        document.addEventListener('click', listener, { capture: true });

        return () => {
            document.removeEventListener('click', listener, { capture: true });
        };
    }, []);

    if (editing) {
        return (
            <div className="text-editor" ref={ref}>
                <MDEditor value={cell.content} onChange={(v) => updateCell(cell.id, v || '')} />
            </div>
        );
    }

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div className="text-editor card" onClick={() => setEditing(true)}>
            <div className="card.content">
                <MDEditor.Markdown source={cell.content || 'Click to edit'} />
            </div>
        </div>
    );
};

export default TextEditor;
