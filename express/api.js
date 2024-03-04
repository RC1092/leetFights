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
    
    const requestOptions = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-csrftoken": "l7M9hppPcGSOf77mtj2jTNdzO4AaPuZ49fvWCP3coAvdwTzv94IY6HxqxHbTtJww",
            "Origin": "https://leetcode.com",
            "Referer": `https://leetcode.com/problems/${data.PName}/`,
            "Cookie": "LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50X3ZlcmlmaWVkX2VtYWlsIjpudWxsLCJhY2NvdW50X3VzZXIiOiI3ZWR3aCIsIl9hdXRoX3VzZXJfaWQiOiIxMjQyODUxMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjZmNjU4N2EwMjk5ZjJiMDZkNjY1ZWJiMjA4YjRhM2U0NTNmODA2ZWFmZWM2MmQwYTk5MWRlYTE3MjdiOTgzMjUiLCJpZCI6MTI0Mjg1MTMsImVtYWlsIjoieHl6eXg2OTQyOUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImxlZXRGaWdodHMiLCJ1c2VyX3NsdWciOiJsZWV0RmlnaHRzIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2RlZmF1bHRfYXZhdGFyLmpwZyIsInJlZnJlc2hlZF9hdCI6MTcwODM2NDMwNSwiaXAiOiIxNTkuMi4xNDguMTM3IiwiaWRlbnRpdHkiOiI5ZmVhNzAxYTYyN2E1N2QwYzQ1OGRiMmUxY2I2MGQ2MiIsInNlc3Npb25faWQiOjU1ODc3NzE4fQ.B0DUnwvWqM1o-SdISvH_2oxMwV8BWw071MXKo_NV1bs; csrftoken=l7M9hppPcGSOf77mtj2jTNdzO4AaPuZ49fvWCP3coAvdwTzv94IY6HxqxHbTtJww"
        },
        body: JSON.stringify(dataForm),
        redirect: "follow"
    };
    
    let int_id = await fetch(`https://leetcode.com/problems/${data.PName}/submit/`, requestOptions)
        .then((response) => response.json());
        
    int_id = int_id.submission_id;
    console.log(`I am here before after id ${int_id}`);
        
  /*   console.log(int_id);
    console.log(data.PName);
    console.log(data.text);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50X3ZlcmlmaWVkX2VtYWlsIjpudWxsLCJhY2NvdW50X3VzZXIiOiI3ZWR3aCIsIl9hdXRoX3VzZXJfaWQiOiIxMjQyODUxMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjZmNjU4N2EwMjk5ZjJiMDZkNjY1ZWJiMjA4YjRhM2U0NTNmODA2ZWFmZWM2MmQwYTk5MWRlYTE3MjdiOTgzMjUiLCJpZCI6MTI0Mjg1MTMsImVtYWlsIjoieHl6eXg2OTQyOUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImxlZXRGaWdodHMiLCJ1c2VyX3NsdWciOiJsZWV0RmlnaHRzIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2RlZmF1bHRfYXZhdGFyLmpwZyIsInJlZnJlc2hlZF9hdCI6MTcwODUzMjE5NiwiaXAiOiIxNTkuMi4xNDguMTM3IiwiaWRlbnRpdHkiOiI5ZmVhNzAxYTYyN2E1N2QwYzQ1OGRiMmUxY2I2MGQ2MiIsInNlc3Npb25faWQiOjU1ODc3NzE4fQ.kvYG_jS8b9jDjq5b5u4_k3njO7H4sMkGBnmOchB_u9A; csrftoken=l7M9hppPcGSOf77mtj2jTNdzO4AaPuZ49fvWCP3coAvdwTzv94IY6HxqxHbTtJww");
    
    const graphql = JSON.stringify({
      query: "query submissionDetails($submissionId: Int!) {\n  submissionDetails(submissionId: $submissionId) {\n    runtime\n    runtimeDisplay\n    runtimePercentile\n    runtimeDistribution\n    memory\n    memoryDisplay\n    memoryPercentile\n    memoryDistribution\n    code\n    timestamp\n    statusCode\n    user {\n      username\n      profile {\n        realName\n        userAvatar\n      }\n    }\n    lang {\n      name\n      verboseName\n    }\n    question {\n      questionId\n    }\n    notes\n    topicTags {\n      tagId\n      slug\n      name\n    }\n    runtimeError\n    compileError\n    lastTestcase\n  }\n}",
      variables: {"submissionId":int_id}
    })
    const requestOptions2 = {
      method: "POST",
      headers: myHeaders,
      body: graphql,
      redirect: "follow"
    }; */
    
        let recieved  = false;
      while(recieved == false){
        fetch(`https://leetcode.com/submissions/detail/${int_id}/check/`, {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,hi;q=0.8",
    "content-type": "application/json",
    "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-csrftoken": "l7M9hppPcGSOf77mtj2jTNdzO4AaPuZ49fvWCP3coAvdwTzv94IY6HxqxHbTtJww",
    "cookie": "gr_user_id=2c96fc32-e1bb-43ff-929f-dae6f0e41fd6; __stripe_mid=3ac3f04d-f043-482d-8689-260983e42603248240; csrftoken=l7M9hppPcGSOf77mtj2jTNdzO4AaPuZ49fvWCP3coAvdwTzv94IY6HxqxHbTtJww; 87b5a3c3f1a55520_gr_last_sent_cs1=leetFights; LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50X3ZlcmlmaWVkX2VtYWlsIjpudWxsLCJhY2NvdW50X3VzZXIiOiI3ZWR3aCIsIl9hdXRoX3VzZXJfaWQiOiIxMjQyODUxMyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjZmNjU4N2EwMjk5ZjJiMDZkNjY1ZWJiMjA4YjRhM2U0NTNmODA2ZWFmZWM2MmQwYTk5MWRlYTE3MjdiOTgzMjUiLCJpZCI6MTI0Mjg1MTMsImVtYWlsIjoieHl6eXg2OTQyOUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImxlZXRGaWdodHMiLCJ1c2VyX3NsdWciOiJsZWV0RmlnaHRzIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2RlZmF1bHRfYXZhdGFyLmpwZyIsInJlZnJlc2hlZF9hdCI6MTcwODcwNzA0NSwiaXAiOiIxNTkuMi4xNDguMTM3IiwiaWRlbnRpdHkiOiI5ZmVhNzAxYTYyN2E1N2QwYzQ1OGRiMmUxY2I2MGQ2MiIsInNlc3Npb25faWQiOjU1ODc3NzE4fQ.mIlGboHdvn_DGCLOACM6CHmxOvm3dDl7Y6ZUdRu_IdU; _gid=GA1.2.1008141258.1708707047; INGRESSCOOKIE=f215104ffe41189382abd98eac541584|8e0876c7c1464cc0ac96bc2edceabd27; 87b5a3c3f1a55520_gr_session_id=181c3ccf-16d8-4325-aa0c-cf26a51612be; 87b5a3c3f1a55520_gr_last_sent_sid_with_cs1=181c3ccf-16d8-4325-aa0c-cf26a51612be; 87b5a3c3f1a55520_gr_session_id_sent_vst=181c3ccf-16d8-4325-aa0c-cf26a51612be; FCNEC=%5B%5B%22AKsRol8OIm-EGeU72UcgdXf1rR11ZLUVCvajrb4SmI3Zs6YWV3R9OuSq1a3Nh3bzJ2WWzIvs0EPVwcExkR5Tli7a8UywbhcSlKZbmvw119aOIBGs5EzV_NayCLdMu5GwiQu987ZtKwlxQRtTSVqJ_IXDhVcSk1goDw%3D%3D%22%5D%5D; __gads=ID=1ce65e7d88ce0279:T=1707748769:RT=1708713376:S=ALNI_MbgGcm5Utjq7-ahQgHZMO1FN-GGvQ; __gpi=UID=00000dc239972108:T=1707748769:RT=1708713376:S=ALNI_MaPPzXEP1km-H1EwfAEQYgosykdsg; __eoi=ID=fa16c5af22801c9a:T=1707748769:RT=1708713376:S=AA-AfjYhvu5TM0YKlXxp15dsSzMr; _ga=GA1.1.7253102.1704727122; 87b5a3c3f1a55520_gr_cs1=leetFights; _gat=1; _ga_CDRWKZTDEX=GS1.1.1708707047.27.1.1708715098.54.0.0",
    "Referer": `https://leetcode.com/problems/${data.PName}/description/?envType=daily-question&envId=2024-02-23`,
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
})
      .then(response => response.json()).
      then(result => {
        console.log(result.status);
      if(result.state != 'PENDING'){
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