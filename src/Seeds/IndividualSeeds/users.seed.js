const prisma = require("../../config/prismaClient");
const {seedUsers}= require('../AllSeedsFiles/users.seed');


seedUsers().then(async ()=>{
  await prisma.$disconnect();
})
