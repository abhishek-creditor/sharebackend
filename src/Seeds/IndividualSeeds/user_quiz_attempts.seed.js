const prisma = require("../../config/prismaClient");

const {seedUserQuizAttempts}= require('../AllSeedsFiles/user_quiz_attempts.seed');



seedUserQuizAttempts().then(async ()=>{
  await prisma.$disconnect();
})

