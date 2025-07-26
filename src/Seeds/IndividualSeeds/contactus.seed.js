const prisma = require("../../config/prismaClient");
const {seedContactUs}= require('../AllSeedsFiles/contactus.seed');



seedContactUs().then(async ()=>{
  await prisma.$disconnect();
})
