const prisma = require("../../config/prismaClient");
const {seedCourseReviews}= require('../AllSeedsFiles/course_reviews.seed');



seedCourseReviews().then(async ()=>{
  await prisma.$disconnect();
})

