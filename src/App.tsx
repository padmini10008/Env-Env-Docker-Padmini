import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <p>Message from secret: {process.env.REACT_APP_MESSAGE}</p>
    </div>
  );
}

export default App;
