import React, { useEffect ,useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './sideBar';
import Topbar from './topBar';



//import Home from './Home';

//import logo from './logo.svg';
import './App.css';


function App() {

  const [data, setData] = useState({});

  useEffect(() => {
      fetchData();
  }, []);

  const fetchData = async () => {
      try {
          const response = await axios.get('http://localhost:8000/questionData/container-with-most-water');
          setData(response.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };


/*     useEffect(()=>{
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
    
  

  console.log(backEndData) */

  return (
    <Router>
    <div className="app">
        <Topbar />
       
        <Routes>
        <Route path="/" exact element={<div>
          data
        </div>} />
        </Routes>
    </div>
</Router>
  );
}

export default App;
