const prisma = require("../../config/prismaClient");
const {seedGroupMessages}= require('../AllSeedsFiles/group_message.seed');


seedGroupMessages().then(async ()=>{
  await prisma.$disconnect();
})


