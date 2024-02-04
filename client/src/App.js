/* eslint-disable no-template-curly-in-string */
import React, { useEffect ,useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './sideBar';
import Topbar from './topBar';
import {UnControlled as CodeMirror} from 'react-codemirror2'



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



  return (
    <Router>
    <div className="app">
        <Topbar />
        <div dangerouslySetInnerHTML={{ __html: data }} className='standardDiv' />
        <CodeMirror className='editorDiv'
  value='<h1>I ♥ react-codemirror2</h1>'
  options={{
    mode: 'xml',
    theme: 'material',
    lineNumbers: true
  }}
  onChange={(editor, data, value) => {
  }}
/>

      
    </div>
</Router>
  );
}

export default App;
