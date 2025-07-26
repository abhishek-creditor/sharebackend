const prisma = require("../../config/prismaClient");
const {seedGroups}= require('../AllSeedsFiles/groups.seed');



seedGroups().then(async ()=>{
  await prisma.$disconnect();
})


