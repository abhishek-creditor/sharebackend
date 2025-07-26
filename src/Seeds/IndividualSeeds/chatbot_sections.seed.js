const prisma = require("../../config/prismaClient");

const {seedChatbotSections}= require('../AllSeedsFiles/chatbot_sections.seed');


seedChatbotSections().then(async ()=>{
  await prisma.$disconnect();
})


