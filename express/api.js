const express = require("express")

const app = express()
const cors = require('cors');

const PORT = 8000;

process.on('uncaughtException', function (error) {
    console.log(error.stack);
 });


const url = 'http://leetcode.com/graphql/';


const headers = {
    'Content-Type': 'application/json',
    'Referer': 'https://leetcode.com',
    
};

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json());
app.get('/check/:num',(req,res)=>{

 
    res.setHeader("Access-Control-Allow-Origin", "*");
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            query: `
                query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
                    questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
                        total: totalNum
                        questions: data {
                            acRate
                            difficulty
                            freqBar
                            isFavor
                            frontendQuestionId: questionFrontendId
                            paidOnly: isPaidOnly
                            status
                            title
                            titleSlug
                            topicTags {
                                name
                                id
                                slug
                            }
                            hasSolution
                            hasVideoSolution
                        }
                    }
                }
            `,
            variables: {
                categorySlug: '',
                skip: 0,
                limit: 50,
                filters: {}
            }
        })
    }).then(response=>response.json())
    .then(data=>res.json(data.data.questionList.questions[req.params.num])).catch(rejection => {console.log(rejection)
    })
    ;
})

app.get('/questionData/:name/:id',async (req,res) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
   
    let retvals = {};
    await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            query: `
            query questionContent($titleSlug: String!) {
                question(titleSlug: $titleSlug) {
                  content
                  mysqlSchemas
                }
              }
              
            `,
            variables: {titleSlug: req.params.name}
        })
    }).then(response=>response.json())
    .then(data=>res.json(data.data.question.content)).catch(rejected => {
        console.log(`Values that caused error :${req.params.name} with id:${req.params.id}`)
    });

})

app.post('/questionSnippets/:name',(req,res) => {
    console.log("here");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50X3ZlcmlmaWVkX2VtYWlsIjpudWxsLCJhY2NvdW50X3VzZXIiOiI3ZWR3aCIsIl9hdXRoX3VzZXJfaWQiOiIxMjQyODUxMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjZmNjU4N2EwMjk5ZjJiMDZkNjY1ZWJiMjA4YjRhM2U0NTNmODA2ZWFmZWM2MmQwYTk5MWRlYTE3MjdiOTgzMjUiLCJpZCI6MTI0Mjg1MTMsImVtYWlsIjoieHl6eXg2OTQyOUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImxlZXRGaWdodHMiLCJ1c2VyX3NsdWciOiJsZWV0RmlnaHRzIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2RlZmF1bHRfYXZhdGFyLmpwZyIsInJlZnJlc2hlZF9hdCI6MTcwODM2NDMwNSwiaXAiOiIxNTkuMi4xNDguMTM3IiwiaWRlbnRpdHkiOiI5ZmVhNzAxYTYyN2E1N2QwYzQ1OGRiMmUxY2I2MGQ2MiIsInNlc3Npb25faWQiOjU1ODc3NzE4fQ.B0DUnwvWqM1o-SdISvH_2oxMwV8BWw071MXKo_NV1bs; csrftoken=l7M9hppPcGSOf77mtj2jTNdzO4AaPuZ49fvWCP3coAvdwTzv94IY6HxqxHbTtJww");

    const graphql = JSON.stringify({
  query: "query questionEditorData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    codeSnippets {\n      lang\n      langSlug\n      code\n    }\n    envInfo\n    enableRunCode\n  }\n}",
  variables: {"titleSlug":req.params.name}
})
const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: graphql,
  redirect: "follow"
};

 fetch("https://leetcode.com/graphql/", requestOptions)
  .then((response) => response.json())
  .then((data) => res.json(data.data.question.codeSnippets))
  .catch((error) => console.error(error));
  

})


app.post('/solution/checkSol', async (req, res) => {
    const data = req.body; // Access the data sent in the request body
    const dataForm = {
        lang: data.lang,
        question_id: data.Qid,
        typed_code: data.text,

    };
    console.log(data);
    const requestOptions = {
      method: "POST",
      headers: {
          "content-type": "application/json",
          "x-csrftoken": "7uKKH1rjFAhTmvk5uBEku6IXos37vIHq0xkBSGTFj2iSuLNNQ2nCaXlL9KEo9sIB",
          "Origin": "https://leetcode.com",
          "Referer": `https://leetcode.com/problems/${data.PName}/`,
          "Cookie": "LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfcGFzc3dvcmRfcmVzZXRfa2V5IjoiYzNlbXVzLTM4ODIyNTA4MTkwOWMzZmUyZGU0NzRhOWY3YTUwYTljIiwiX2F1dGhfdXNlcl9pZCI6IjEyNDI4NTEzIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiI5ZjhiZTc1NTQ5NzQ4ZDI3ZDZhMDJkZDlkZGRlYmY4YWVlZmVmMWFhZjAzMGU1Y2VhOGM4YzU3MTczNjU2NTRjIiwiaWQiOjEyNDI4NTEzLCJlbWFpbCI6Inh5enl4Njk0MjlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJsZWV0RmlnaHRzIiwidXNlcl9zbHVnIjoibGVldEZpZ2h0cyIsImF2YXRhciI6Imh0dHBzOi8vYXNzZXRzLmxlZXRjb2RlLmNvbS91c2Vycy9kZWZhdWx0X2F2YXRhci5qcGciLCJyZWZyZXNoZWRfYXQiOjE3MDk2NTE4MTgsImlwIjoiMTU5LjIuMTQ4LjEzNyIsImlkZW50aXR5IjoiNGYwOWUwMWM4M2Q2OTEwMGMzNjNjMzNhZWNmZWY5ZjgiLCJzZXNzaW9uX2lkIjo1Njk5ODY5NSwiX3Nlc3Npb25fZXhwaXJ5IjoxMjA5NjAwfQ.xlMAXzozu_cNTM_j47hhaB5LvCcKCZ5IeTU0Ukyqs_s; csrftoken=7uKKH1rjFAhTmvk5uBEku6IXos37vIHq0xkBSGTFj2iSuLNNQ2nCaXlL9KEo9sIB"
      },
      body: JSON.stringify(dataForm),
      redirect: "follow"
  };
  
  let int_id = await fetch(`https://leetcode.com/problems/${data.PName}/submit/`, requestOptions)
      .then((response) => response.json());

  int_id = int_id.submission_id
  console.log(int_id);

  const myHeaders = new Headers();
myHeaders.append("Referer", "https://leetcode.com/problems/string-to-integer-atoi");
myHeaders.append("content-type", "application/json");
myHeaders.append("x-csrftoken", "7uKKH1rjFAhTmvk5uBEku6IXos37vIHq0xkBSGTFj2iSuLNNQ2nCaXlL9KEo9sIB");
myHeaders.append("Cookie", "LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfcGFzc3dvcmRfcmVzZXRfa2V5IjoiYzNlbXVzLTM4ODIyNTA4MTkwOWMzZmUyZGU0NzRhOWY3YTUwYTljIiwiX2F1dGhfdXNlcl9pZCI6IjEyNDI4NTEzIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiI5ZjhiZTc1NTQ5NzQ4ZDI3ZDZhMDJkZDlkZGRlYmY4YWVlZmVmMWFhZjAzMGU1Y2VhOGM4YzU3MTczNjU2NTRjIiwiaWQiOjEyNDI4NTEzLCJlbWFpbCI6Inh5enl4Njk0MjlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJsZWV0RmlnaHRzIiwidXNlcl9zbHVnIjoibGVldEZpZ2h0cyIsImF2YXRhciI6Imh0dHBzOi8vYXNzZXRzLmxlZXRjb2RlLmNvbS91c2Vycy9kZWZhdWx0X2F2YXRhci5qcGciLCJyZWZyZXNoZWRfYXQiOjE3MDk2NTE4MTgsImlwIjoiMTU5LjIuMTQ4LjEzNyIsImlkZW50aXR5IjoiNGYwOWUwMWM4M2Q2OTEwMGMzNjNjMzNhZWNmZWY5ZjgiLCJzZXNzaW9uX2lkIjo1Njk5ODY5NSwiX3Nlc3Npb25fZXhwaXJ5IjoxMjA5NjAwfQ.xlMAXzozu_cNTM_j47hhaB5LvCcKCZ5IeTU0Ukyqs_s; csrftoken=7uKKH1rjFAhTmvk5uBEku6IXos37vIHq0xkBSGTFj2iSuLNNQ2nCaXlL9KEo9sIB");

const requestOptions2= {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

  let recieved  = false;
  while(recieved == false){
    fetch(`https://leetcode.com/submissions/detail/${int_id}/check/`, requestOptions2)
  .then(response => response.json()).
  then(result => {
  if(result.state == 'SUCCESS'){
    recieved = true;
    console.log(result);
    res.json(result)

  }



    
  });
    
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
});

  

app.listen(PORT,(req,res)=>{
    console.log("Listening at port:",PORT)
})
