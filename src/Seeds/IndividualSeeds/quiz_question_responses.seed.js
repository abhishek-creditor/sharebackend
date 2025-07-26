const prisma = require("../../config/prismaClient");

const {seedQuizQuestionResponses}= require('../AllSeedsFiles/quiz_question_responses.seed');


seedQuizQuestionResponses().then(async ()=>{
  await prisma.$disconnect();
})
