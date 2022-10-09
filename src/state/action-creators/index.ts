import { ActionType } from '../action-types';
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Action,
    UpdateCellAction,
    DeleteCellAction,
    MoveCellAction,
    InsertCellAfterAction,
    Direction,
} from '../actions';
import { CellTypes } from '../cell';

export const updateCell = (id: string, content: string): UpdateCellAction => ({
    type: ActionType.UPDATE_CELL,
    payload: {
        id,
        content,
    },
});

export const deleteCell = (id: string): DeleteCellAction => ({
    type: ActionType.DELETE_CELL,
    payload: id,
});

export const moveCell = (id: string, direction: Direction): MoveCellAction => ({
    type: ActionType.MOVE_CELL,
    payload: {
        id,
        direction,
    },
});

export const insertCellAfter = (id: string, cellType: CellTypes): InsertCellAfterAction => ({
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
        id,
        type: cellType,
    },
});
