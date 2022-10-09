// eslint-disable-next-line no-use-before-define
import React from 'react';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './state';
import CellList from './conponents/CellList';

const App = (): any => (
    <Provider store={store}>
        <div>
            <CellList />
        </div>
    </Provider>
);

ReactDOM.render(<App />, document.querySelector('#root'));
