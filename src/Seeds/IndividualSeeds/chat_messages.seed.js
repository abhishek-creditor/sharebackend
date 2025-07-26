const prisma = require("../../config/prismaClient");

const {seedChatMessages}= require('../AllSeedsFiles/chat_messages.seed');



seedChatMessages().then(async ()=>{
  await prisma.$disconnect();
})


