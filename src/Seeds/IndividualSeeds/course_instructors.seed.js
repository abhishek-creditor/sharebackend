const prisma = require("../../config/prismaClient");

const {seedCourseInstructors}= require('../AllSeedsFiles/course_instructors.seed');


seedCourseInstructors().then(async ()=>{
  await prisma.$disconnect();
})

