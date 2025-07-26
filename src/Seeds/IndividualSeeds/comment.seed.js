const prisma = require("../../config/prismaClient");

const {seedComments}= require('../AllSeedsFiles/comment.seed');


seedComments().then(async ()=>{
  await prisma.$disconnect();
})


