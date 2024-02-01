const express = require("express")




const app = express()


const PORT = 8000;




const url = 'http://leetcode.com/graphql/';

const headers = {
    'Content-Type': 'application/json',
    'Referer': 'https://leetcode.com',
};


app.get('/check',(req,res)=>{
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
    })
    .then(data=>res.json(data))
    ;
})


app.listen(PORT,(req,res)=>{
    console.log("Listening at port:",PORT)
})