const prisma = require("../../config/prismaClient");

const {seedUnits}= require('../AllSeedsFiles/units.seed');

seedUnits().then(async ()=>{
  await prisma.$disconnect();
})


