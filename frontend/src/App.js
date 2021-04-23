import logo from './logo.svg';
import './App.css';

function getData(e) {
  e.preventDefault();
  return fetch("/api/data");
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload!
        </p>
        <a className="App-link" href="https://azure.microsoft.com" rel="noopener noreferrer" onClick={getData}>
          Get Data
        </a>
      </header>
    </div>
  );
}

export default App;
