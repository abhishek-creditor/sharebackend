const prisma = require("../../config/prismaClient");
const {seedGroupMembers}= require('../AllSeedsFiles/group_member.seed');


seedGroupMembers().then(async ()=>{
  await prisma.$disconnect();
})


