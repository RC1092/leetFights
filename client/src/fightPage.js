import React, { useEffect ,useState,useRef} from 'react';
import axios from 'axios';
import Topbar from './topBar';
import Editor from "@monaco-editor/react"
import "./App.css"



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

function EditArea({id , name}) {

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
      Qid:id,
      PName: name
    };

    try {
     await fetch('http://localhost:8000/solution/checkSol', {
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
            setResult("No error");
          }
        }
      );
      
  
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

const fetchData = async (setData) => {
  try {
  
    var num = Math.floor(Math.random()*50);
      //console.log(num);
      const name = await axios.get(`http://localhost:8000/check/${num}`);
      problemName = name.data.titleSlug;
      problemId = name.data.frontendQuestionId;
      
      const responseSnipp = await axios.post(`http://localhost:8000/questionSnippets/${problemName}`);
      
      files['code.js'].value = responseSnipp.data[6].code;
      files['script.py'].value = responseSnipp.data[2].code;
      const response = await axios.get(`http://localhost:8000/questionData/${name.data.titleSlug}/${name.data.frontendQuestionId}`);

      setData(response.data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
};

function FightPage(){
    const [data, setData] = useState(false);

    useEffect(() => {
        fetchData(setData);
    }, []);

    if(data === false){
      return <div>Loading...</div>
    }

    return (
        <div className="app">
        <Topbar />
        <div className='mainArea'>
        <div dangerouslySetInnerHTML={{ __html: data }} className='standardDiv' />
        <div className='standardDiv2'><EditArea id={problemId} name={problemName} ></EditArea>
       
        </div>
        </div>
         </div>
    )
  
}



export default FightPage