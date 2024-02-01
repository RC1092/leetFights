import React, { useEffect ,useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Sidebar from './sideBar';
import Topbar from './topBar';



//import Home from './Home';

//import logo from './logo.svg';
import './App.css';



function App() {

  const [backEndData,setBackEndData] = useState([{}])


    useEffect(()=>{
      fetch("/check",{
        method:"GET",
        credentials:"include",
      }).then(
        response => response.json()
      ).then(
        data=>{
          setBackEndData(data)
        }
      ).catch(e => {
        console.log(e);
    });
    },[])
    
  

  console.log(backEndData)

  return (
    <Router>
    <div className="app">
        <Topbar />
        <Sidebar />
        <Routes>
        <Route path="/" exact element={<div></div>} />

        </Routes>
        {/* Add more routes as needed */}
    </div>
</Router>
  );
}

export default App;
