const prisma = require("../../config/prismaClient");
const {seedModules}= require('../AllSeedsFiles/modules.seed');


seedModules().then(async ()=>{
  await prisma.$disconnect();
})
