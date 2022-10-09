/* eslint-disable react/prop-types */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import './cell-list-item.css';
import { Cell } from '../state';
import CodeCell from './CodeCell';
import TextEditor from './TextEditor';
import ActionBar from './ActionBar';

interface CellListItemProps {
    cell: Cell;
}

/**
 * Responsible for wrapping together Cell and related components
 * @param param0
 * @returns
 */
const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
    let child: JSX.Element;

    if (cell.type === 'code') {
        child = (
            <>
                <div className="action-bar-wrapper">
                    <ActionBar id={cell.id} />
                </div>
                <CodeCell cell={cell} />
            </>
        );
    } else {
        child = (
            <>
                <TextEditor cell={cell} />
                <ActionBar id={cell.id} />
            </>
        );
    }

    return <div className="cell-list-item">{child}</div>;
};

export default CellListItem;
