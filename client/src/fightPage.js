import React, { useEffect ,useState,useRef, useContext} from 'react';
import axios from 'axios';
import Topbar from './topBar';
import Editor from "@monaco-editor/react"
import "./App.css"
import { useNavigate,useLocation } from 'react-router-dom';



var problemName = "";
var problemId = 0;
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
  const [result,setResult] = useState('NO data');
  const editorRef = useRef(null);
  const file = files[fileName];
  
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
      socketDat.on('Results',(data) => {
        console.log(data);
      })
     /*  await fetch('http://localhost:8000/solution/checkSol', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
      }).then(response =>response.json()).then( 
        results => {
          console.log(results.status_msg)
          if(results.status_msg === 'Runtime Error' ){
            setResult(results.runtime_error);
          }
          else if(results.status_msg === 'Wrong Answer'){
            setResult(`Wrong Answer. ${results.total_correct}/${results.total_testcases} testcases passed. `)
          }
          else{
            setResult(`No error :${results} `);
          }
        }
      ); */
      
  
  } catch (error) {
      console.error('Error sending data:', error);
  }
    
  }

  return (   
   
      <div className=' innerDiv1'>
      <button onClick={() => setFileName("script.py")} className='buttons'>
        Switch to python
      </button>
      <button onClick={() => setFileName("code.js")}>
        Switch to javascript
      </button>
      <button onClick={() => getEditorValue()}>
        Submit
      </button>
      
      <Editor
        height="60vh"
        width="113vh"
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

    const location  =  useLocation();
    const data = location.state;



    socket.on('end', (data) => {
      console.log('Game ended');
        console.log(data);
      })

    files['code.js'].value = data[3]
    files['script.py'].value = data[4];
    console.log(data[0]);

    return (
        <div className="app">
        <Topbar />
        <div className='mainArea'>
        <div dangerouslySetInnerHTML={{ __html: data[5] }} className='standardDiv' />
        <div className='standardDiv2'><EditArea Qidid={data[2]} Pid={data[0]} name={data[1]} socketDat = {socket} ></EditArea>
       
        </div>
        </div>
         </div>
    )
  
}



export default FightPage