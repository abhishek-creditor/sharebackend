const prisma = require("../../config/prismaClient");
const {seedQuizQuestions}= require('../AllSeedsFiles/quiz_questions.seed');

seedQuizQuestions().then(async ()=>{
  await prisma.$disconnect();
})


