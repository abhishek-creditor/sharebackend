const prisma = require("../../config/prismaClient");

const {seedChatbotQuestions}= require('../AllSeedsFiles/chatbot_questions.seed');

seedChatbotQuestions().then(async ()=>{
  await prisma.$disconnect();
})


