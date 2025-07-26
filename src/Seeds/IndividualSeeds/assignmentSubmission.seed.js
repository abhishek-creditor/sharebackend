const prisma = require("../../config/prismaClient");

const {seedAssignmentSubmissions}= require('../AllSeedsFiles/assignmentSubmission.seed');


seedAssignmentSubmissions().then(async ()=>{
  await prisma.$disconnect();
})

