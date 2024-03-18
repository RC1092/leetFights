'use strict';
import React, { useEffect ,useState,useRef, useContext} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Topbar from './topBar';
import Editor from "@monaco-editor/react"
import "./App.css"
import { useNavigate,useLocation } from 'react-router-dom';




let files = {
  "script.py": {
    name: "script.py",
    language: "python",
   
  },
  "code.js": {
    name: "code.js",
    language: "javascript",
  }
}



function EditArea({Qid ,Pid,name, socketDat}) {

  const [fileName, setFileName] = useState("script.py"); // change to "index.html"
  const [result,setResult] = useState('Submit the program to get results');
  const [fetching, setfetching] = useState(false);
  const editorRef = useRef(null);
  const file = files[fileName];
  
  const handleChange = (event) => {
    setFileName(event.target.value);
  };

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  async function getEditorValue (){
    const formData = {
      text:editorRef.current.getValue(),
      lang:files[fileName].language,
      Qid:Qid,
      PName: name,
      Pid : Pid
    };

    try {

      socketDat.emit('CheckSol',formData);
      setfetching(true);

      socketDat.on('Results',(data) => {
        console.log(data);
        setResult(data);
        setfetching(false);
      })
    
      
  
  } catch (error) {
      console.error('Error sending data:', error);
  }
    
  }

  return (   
   
    <div className="dropdown-container" >
      <div classname ='containerfortop'>
      <select value={fileName} onChange={handleChange} className='dropdown'>
        <option value="script.py">Python</option>
        <option value="code.js">JavaScript</option>
      </select>
      <button className= "submitButton" onClick={ fetching === true ?()=>{} :() => getEditorValue()}>
        {fetching == true ? 'fetching' : 'Submit'}
      </button>
      </div>
      <Editor
        height="70vh"
        width="107vh"
        theme="vs-dark"
        onMount={handleEditorDidMount}
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
      />
       <p>{result}</p>
      </div>

  )
}



const FightPage = ({socket}) => {

    const [winner, setWinner] = useState(null);
    const location  =  useLocation();
    const data = location.state;



    socket.on('end', (data) => {
      console.log(data);
        setWinner(data);
      })

    files['code.js'].value = data[3]
    files['script.py'].value = data[4];
   

    return (
        <div className="app">
        <Topbar state = {winner}/>
        <div className='mainArea'>
        <div dangerouslySetInnerHTML={{ __html: data[5] }} className='standardDiv' />
        <div className='standardDiv2'><EditArea Qid={data[2]} Pid={data[0]} name={data[1]} socketDat = {socket} ></EditArea>
       
        </div>
        </div>
        {winner && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Game Over!</h2>
            {winner === 'timer' ? <p> "Time Over "</p> : <p>{winner === data[0]  ? "You Win!" : "Opponent Wins!"} </p>}
            <Link to="/">
      <button>Back to Home</button>
    </Link>
          </div>
        </div>
      )}
         </div>
    )
  
}



export default FightPage