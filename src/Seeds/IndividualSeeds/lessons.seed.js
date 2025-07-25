const prisma = require("../../config/prismaClient");
const {seedLessons}= require('../AllSeedsFiles/lessons.seed');


seedLessons().then(async ()=>{
  await prisma.$disconnect();
})

