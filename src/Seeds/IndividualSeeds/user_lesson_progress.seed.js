const prisma = require("../../config/prismaClient");

const {seedUserLessonProgress}= require('../AllSeedsFiles/user_lesson_progress.seed');

seedUserLessonProgress().then(async ()=>{
  await prisma.$disconnect();
})

