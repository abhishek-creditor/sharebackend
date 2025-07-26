const prisma = require("../../config/prismaClient");
const {seedCourses}= require('../AllSeedsFiles/courses.seed');

seedCourses().then(async ()=>{
  await prisma.$disconnect();
})


