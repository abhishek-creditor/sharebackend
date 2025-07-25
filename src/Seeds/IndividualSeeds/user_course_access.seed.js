const prisma = require("../../config/prismaClient");

const {seedUserCourseAccess}= require('../AllSeedsFiles/user_course_access.seed');



seedUserCourseAccess().then(async ()=>{
  await prisma.$disconnect();
})


