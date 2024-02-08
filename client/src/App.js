/* eslint-disable no-template-curly-in-string */
import React, { useEffect ,useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './sideBar';
import Topbar from './topBar';
import EditArea from './codeArea';
import FrontPage from './homepage';


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
      
        var num = Math.floor(Math.random()*100);
          //console.log(num);
          const name = await axios.get(`http://localhost:8000/check/${num}`);
          console.log(name);
          const response = await axios.get(`http://localhost:8000/questionData/${name.data}`);
          console.log(response);
          setData(response.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  const [value, setValue] = React.useState("console.log('hello world!');");
  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);

  return (
    <Router>
      <Routes>
      <Route path="/" element={<FrontPage/>}>    
      </Route>
          <Route path="/fight" element={<div className="app">
        <Topbar />
        <div className='mainArea'>
        <div dangerouslySetInnerHTML={{ __html: data }} className='standardDiv' />
        <div className='standardDiv'><EditArea></EditArea></div>
        </div>
         </div>} />
      
      </Routes>
    
</Router>
  );
}

export default App;
