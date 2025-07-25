const prisma = require("../../config/prismaClient");

const {seedAssignments}= require('../AllSeedsFiles/assignments.seed');

seedAssignments().then(async ()=>{
  await prisma.$disconnect();
})


