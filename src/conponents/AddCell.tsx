// eslint-disable-next-line no-use-before-define
import React from 'react';
import './add-cell.css';
import { useActions } from '../hooks/UseActions';

interface AddCellProps {
    previousCellId: string | null;
    forceVisible?: boolean;
}

/**
 * Resonsible for addig cells if user click on the realted button. Code / Text
 * @param param0 forceVisible - if user delets all cells
 * @returns
 */
const AddCell: React.FC<AddCellProps> = ({ forceVisible, previousCellId }) => {
    const { insertCellAfter } = useActions();

    return (
        <div className={`add-cell ${forceVisible && 'force-visible'}`}>
            <div className="add-buttons">
                <button
                    type="button"
                    className="button is-rounded is-primary is-small"
                    onClick={() => insertCellAfter(previousCellId, 'code')}
                >
                    <span className="icon is-small">
                        <i className="fas fa-plus" />
                    </span>
                    <span>Code</span>
                </button>
                <button
                    type="button"
                    className="button is-rounded is-primary is-small"
                    onClick={() => insertCellAfter(previousCellId, 'text')}
                >
                    <span className="icon is-small">
                        <i className="fas fa-plus" />
                    </span>
                    <span>Text</span>
                </button>
            </div>
            <div className="divider" />
        </div>
    );
};

export default AddCell;
