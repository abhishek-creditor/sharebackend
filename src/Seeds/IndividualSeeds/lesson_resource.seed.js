const prisma = require("../../config/prismaClient");
const {seedLessonResources}= require('../AllSeedsFiles/lesson_resource.seed');


seedLessonResources().then(async ()=>{
  await prisma.$disconnect();
})


