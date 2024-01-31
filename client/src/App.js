import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Sidebar from './sideBar';
import Topbar from './topBar';
//import Home from './Home';

//import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
    <div className="app">
        <Topbar />
        <Sidebar />
        <Routes>
        <Route path="/" exact component={<div></div>} />

        </Routes>
        {/* Add more routes as needed */}
    </div>
</Router>
  );
}

export default App;
