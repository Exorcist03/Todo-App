import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Loginsignup from './components/Loginsignup/Loginsignup';
import Landingpage from './components/Landingpage/Landingpage';

function App() {
  return (
    <Router>
      <div className="App">
      <Routes>
        <Route path='/' element = {<Loginsignup/>}></Route>
        <Route path='/land' element = {<Landingpage/>} />
      </Routes>
    </div>
    </Router>
    
  );
}

export default App;
