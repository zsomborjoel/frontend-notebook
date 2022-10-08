// eslint-disable-next-line no-use-before-define
import React from 'react';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import ReactDOM from 'react-dom';
import CodeCell from './conponents/CodeCell';

const App = (): any => (
    <div>
        <CodeCell />
    </div>
);

ReactDOM.render(<App />, document.querySelector('#root'));
