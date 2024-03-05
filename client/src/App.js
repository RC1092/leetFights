/* eslint-disable no-template-curly-in-string */
'use strict';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from './homepage';
import FightPage from './fightPage';
import io from 'socket.io-client';
import './App.css';

function App() {


  const socket = io('http://localhost:9000');

  return (
   
    <Router>
   
      <Routes>
      <Route path="/" element={<FrontPage socket = {socket} />}>    
      </Route>
          <Route path="/fight" element={<FightPage socket = {socket}/>}/>      
      </Routes>
      
</Router>

  );
}

export default App;
