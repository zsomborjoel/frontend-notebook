// eslint-disable-next-line no-use-before-define
import React, { Fragment } from 'react';
import './cell-list.css';
import { useTypedSelector } from '../hooks/UseTypesSelector';
import CellListItem from './CellListItem';
import AddCell from './AddCell';
import { Cell } from '../state';

const CellList: React.FC = () => {
    // @ts-ignore
    const cells = useTypedSelector(({ cells: { order, data } }) => order.map((id: string | number) => data[id]));

    const renderedCells = cells.map((cell: Cell) => (
        <Fragment key={cell.id}>
            <CellListItem cell={cell} />
            <AddCell previousCellId={cell.id} />
        </Fragment>
    ));

    return (
        <div className="cell-list">
            <AddCell forceVisible={cells.length === 0} previousCellId={null} />
            {renderedCells}
        </div>
    );
};

export default CellList;
