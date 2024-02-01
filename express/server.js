const express = require("express")

const app = express()
const cors = require('cors');

const PORT = 8000;




const url = 'http://leetcode.com/graphql/';

const headers = {
    'Content-Type': 'application/json',
    'Referer': 'https://leetcode.com',
};


app.get('/check',(req,res)=>{
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
    .then(data=>res.json(data.data.questionList.questions[10].titleSlug))
    ;
})

app.get('/questionData/:name',(req,res) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    fetch(url, {
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
    .then(data=>res.json(data.data.question.content))
    ;
})

app.listen(PORT,(req,res)=>{
    console.log("Listening at port:",PORT)
})