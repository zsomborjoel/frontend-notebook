// eslint-disable-next-line no-use-before-define
import React from 'react';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import ReactDOM from 'react-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import CodeCell from './conponents/CodeCell';
import TextEditor from './conponents/TextEditor';

const App = (): any => (
    <div>
        <TextEditor />
    </div>
);

ReactDOM.render(<App />, document.querySelector('#root'));
