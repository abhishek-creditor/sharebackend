const prisma = require("../../config/prismaClient");

const {seedCatalogs}= require('../AllSeedsFiles/catalogs.seed');


seedCatalogs().then(async ()=>{
  await prisma.$disconnect();
})


