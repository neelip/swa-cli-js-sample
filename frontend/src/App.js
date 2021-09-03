import logo from './logo.svg';
import './App.css';
import { useState } from 'react';


function App() {

  const [data, setData] = useState({});

  async function getData(e) {
    e.preventDefault();
    setData(await (await fetch("/api/data")).json());
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload! Hello
        </p>
        <a className="App-link" href="https://azure.microsoft.com" rel="noopener noreferrer" onClick={getData}>
          Get Data
        </a>
        <pre>{JSON.stringify(data ?? {})}</pre>
      </header>
    </div>
  );
}

export default App;
