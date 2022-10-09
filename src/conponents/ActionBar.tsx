// eslint-disable-next-line no-use-before-define
import React from 'react';
import './action-bar.css';
import { useActions } from '../hooks/UseActions';

interface ActionBarProps {
    id: string;
}

/**
 * Responsible for buttons on the right to move cells up and down or delete.
 * @param param0
 * @returns
 */
const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
    const { moveCell, deleteCell } = useActions();

    return (
        <div className="action-bar">
            <button type="button" className="button is-primary is-small" onClick={() => moveCell(id, 'up')}>
                <span className="icon">
                    <i className="fas fa-arrow-up" />
                    up
                </span>
            </button>
            <button type="button" className="button is-primary is-small" onClick={() => moveCell(id, 'down')}>
                <span className="icon">
                    <i className="fas fa-arrow-down" />
                    down
                </span>
            </button>
            <button type="button" className="button is-primary is-small" onClick={() => deleteCell(id)}>
                <span className="icon">
                    <i className="fas fa-times" />
                    del
                </span>
            </button>
        </div>
    );
};

export default ActionBar;
