const prisma = require("../../config/prismaClient");
const {seedConversations}= require('../AllSeedsFiles/conversations.seed');


seedConversations().then(async ()=>{
  await prisma.$disconnect();
})

