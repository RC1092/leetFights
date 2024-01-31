const express = require("express")

const app = express()

const PORT = 3000;

const url = 'http://leetcode.com/graphql';
const csrf = 'your_csrf_token_here';
const sess = 'your_session_here';

const headers = {
    'Content-Type': 'application/json',
    'Origin': 'https://leetcode.com',
    'Referer': 'https://leetcode.com',
    'Connection': 'keep-alive'
};

app.get('/test',(req,res)=>{
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            query: `
                query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
                    problemsetQuestionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
                        total: totalNum
                        questions: data {
                            acRate
                            difficulty
                            freqBar
                            frontendQuestionId
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
    })
    ;
})


app.listen(PORT,(req,res)=>{
    console.log("Listening at port:",PORT)
})