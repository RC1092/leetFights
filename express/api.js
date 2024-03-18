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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json());
app.get('/check/:num',async (req,res)=>{

 
    res.setHeader("Access-Control-Allow-Origin", "*");

    for (let i = 0; i < 1; i++) {
        await fetch(url, {
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
        }).then(response=> response.json())
        .then(data=>res.json(data.data.questionList.questions[req.params.num])).catch(rejection => {console.log('Again on 72') ; i--;
        })
        ;
    }
    
})

app.get('/questionData/:name/:id',async (req,res) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
   
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
        console.log(console.log(rejected))
    });

})

app.post('/questionSnippets/:name',(req,res) => {
    console.log("here");
   
    const graphql = JSON.stringify({
  query: "query questionEditorData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    codeSnippets {\n      lang\n      langSlug\n      code\n    }\n    envInfo\n    enableRunCode\n  }\n}",
  variables: {"titleSlug":req.params.name}
})
const requestOptions = {
  method: "POST",
  headers: headers,
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
            "Content-Type": "application/json",
            "X-Csrftoken": "gFO2L0Ua9b26LCcJZ7hJgE41kSlLQjriQtRmhpfBUnJ3eNCJOwNldMSYmSenN5n2",
            "Origin": "https://leetcode.com",
            "Referer": `https://leetcode.com/problems/${data.PName}/`,
            "Cookie": "LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMTI0Mjg1MTMiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJhbGxhdXRoLmFjY291bnQuYXV0aF9iYWNrZW5kcy5BdXRoZW50aWNhdGlvbkJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiI5ZjhiZTc1NTQ5NzQ4ZDI3ZDZhMDJkZDlkZGRlYmY4YWVlZmVmMWFhZjAzMGU1Y2VhOGM4YzU3MTczNjU2NTRjIiwiaWQiOjEyNDI4NTEzLCJlbWFpbCI6Inh5enl4Njk0MjlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJsZWV0RmlnaHRzIiwidXNlcl9zbHVnIjoibGVldEZpZ2h0cyIsImF2YXRhciI6Imh0dHBzOi8vYXNzZXRzLmxlZXRjb2RlLmNvbS91c2Vycy9kZWZhdWx0X2F2YXRhci5qcGciLCJyZWZyZXNoZWRfYXQiOjE3MTA3MTc2OTIsImlwIjoiMTQyLjE2Ny4xMi42MSIsImlkZW50aXR5IjoiNGYwOWUwMWM4M2Q2OTEwMGMzNjNjMzNhZWNmZWY5ZjgiLCJzZXNzaW9uX2lkIjo1Nzc5NTk0NiwiX3Nlc3Npb25fZXhwaXJ5IjoxMjA5NjAwfQ.YTfGP8ECOngrMGQV4ZZcXwpwOxiYPbDjEXkevtQKa9U; csrftoken=gFO2L0Ua9b26LCcJZ7hJgE41kSlLQjriQtRmhpfBUnJ3eNCJOwNldMSYmSenN5n2"
        },
        body: JSON.stringify(dataForm),
        redirect: "follow"
    };
  
    let int_id = await fetch(`https://leetcode.com/problems/${data.PName}/submit/`, requestOptions)
        .then((response) => response.json())
        
          console.log(int_id)
    int_id = int_id.submission_id
        
  
    const myHeaders = new Headers();
  myHeaders.append("referer", `https://leetcode.com/problems/${data.PName}/`);
  myHeaders.append("content-type", "application/json");
  myHeaders.append("x-csrftoken", "gFO2L0Ua9b26LCcJZ7hJgE41kSlLQjriQtRmhpfBUnJ3eNCJOwNldMSYmSenN5n2");
  myHeaders.append("cookie", "LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMTI0Mjg1MTMiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJhbGxhdXRoLmFjY291bnQuYXV0aF9iYWNrZW5kcy5BdXRoZW50aWNhdGlvbkJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiI5ZjhiZTc1NTQ5NzQ4ZDI3ZDZhMDJkZDlkZGRlYmY4YWVlZmVmMWFhZjAzMGU1Y2VhOGM4YzU3MTczNjU2NTRjIiwiaWQiOjEyNDI4NTEzLCJlbWFpbCI6Inh5enl4Njk0MjlAZ21haWwuY29tIiwidXNlcm5hbWUiOiJsZWV0RmlnaHRzIiwidXNlcl9zbHVnIjoibGVldEZpZ2h0cyIsImF2YXRhciI6Imh0dHBzOi8vYXNzZXRzLmxlZXRjb2RlLmNvbS91c2Vycy9kZWZhdWx0X2F2YXRhci5qcGciLCJyZWZyZXNoZWRfYXQiOjE3MTA3MTc2OTIsImlwIjoiMTQyLjE2Ny4xMi42MSIsImlkZW50aXR5IjoiNGYwOWUwMWM4M2Q2OTEwMGMzNjNjMzNhZWNmZWY5ZjgiLCJzZXNzaW9uX2lkIjo1Nzc5NTk0NiwiX3Nlc3Npb25fZXhwaXJ5IjoxMjA5NjAwfQ.YTfGP8ECOngrMGQV4ZZcXwpwOxiYPbDjEXkevtQKa9U; csrftoken=gFO2L0Ua9b26LCcJZ7hJgE41kSlLQjriQtRmhpfBUnJ3eNCJOwNldMSYmSenN5n2");
  
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
