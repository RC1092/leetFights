/* eslint-disable no-template-curly-in-string */
import React, { useEffect ,useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import FrontPage from './homepage';
import FightPage from './fightPage';


//import Home from './Home';

//import logo from './logo.svg';
import './App.css';


function App() {



  return (
    <Router>
      <Routes>
      <Route path="/" element={<FrontPage/>}>    
      </Route>
          <Route path="/fight" element={<FightPage/>}/>
            
      
      </Routes>
    
</Router>
  );
}

export default App;
