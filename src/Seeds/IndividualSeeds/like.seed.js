const prisma = require("../../config/prismaClient");
const {seedLikes}= require('../AllSeedsFiles/like.seed');


seedLikes().then(async ()=>{
  await prisma.$disconnect();
})


