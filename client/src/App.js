import { useState } from 'react'

import LoginPage from './components/LoginPage';

import './App.css';

function App() {

  const [isLogged, setIsLogged] = useState(false)
  //const [apiCall, setApiCall] = useState({})

  //fetch("/api")
  //.then(rep => rep.json())
  //.then(data => setApiCall(data))

  return (
    <div id="App">
      {isLogged ? <p>Welcome</p> :  <LoginPage />}
    </div>
  );
}

export default App;
