const prisma = require("../../config/prismaClient");
const {seedQuestionOptions}= require('../AllSeedsFiles/question_options.seed');

seedQuestionOptions().then(async ()=>{
  await prisma.$disconnect();
})

