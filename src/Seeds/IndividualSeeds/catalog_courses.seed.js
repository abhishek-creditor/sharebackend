const prisma = require("../../config/prismaClient");

const {seedCatalogCourses}= require('../AllSeedsFiles/catalog_courses.seed');


seedCatalogCourses().then(async ()=>{
  await prisma.$disconnect();
})


