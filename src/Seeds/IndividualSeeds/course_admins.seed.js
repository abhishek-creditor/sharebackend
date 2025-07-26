const prisma = require("../../config/prismaClient");
const {seedCourseAdmins}= require('../AllSeedsFiles/course_admins.seed');

seedCourseAdmins().then(async ()=>{
  await prisma.$disconnect();
})

