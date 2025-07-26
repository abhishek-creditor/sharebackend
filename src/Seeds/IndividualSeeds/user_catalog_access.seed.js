const prisma = require("../../config/prismaClient");

const {seedUserCatalogAccess}= require('../AllSeedsFiles/user_catalog_access.seed');


seedUserCatalogAccess().then(async ()=>{
  await prisma.$disconnect();
})


