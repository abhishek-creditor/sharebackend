const prisma = require("../../config/prismaClient");
const {seedLogs}= require('../AllSeedsFiles/logs.seed');


seedLogs().then(async ()=>{
  await prisma.$disconnect();
})

