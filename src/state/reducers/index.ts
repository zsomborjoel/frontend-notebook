import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';
import { reducer } from './bundlesReducer';

const reducers = combineReducers({
    cells: cellsReducer,
    bundles: reducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
