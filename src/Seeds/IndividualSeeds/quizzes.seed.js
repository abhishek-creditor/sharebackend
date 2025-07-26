const prisma = require("../../config/prismaClient");
const {seedQuizzes}= require('../AllSeedsFiles/quizzes.seed');

seedQuizzes().then(async ()=>{
  await prisma.$disconnect();
})


