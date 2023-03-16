import React from 'react';
import logo from './logo.svg';
import './App.css';

import axios, { AxiosResponse } from './axios'
const baseURL = 'http://localhost:4000'
interface USER {
  name: string,
  age: number
}
const user: USER = {
  name: 'well',
  age: 18
}
axios({
  method: 'get',
  url: baseURL + '/todos',
  params: user
}).then((response: AxiosResponse) => {
  console.log(response)
}).catch((err: any) => {
  console.log(err)
})

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
