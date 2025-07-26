const prisma = require("../../config/prismaClient");
const {seedUserRoles}= require('../AllSeedsFiles/user_roles.seed');



seedUserRoles().then(async ()=>{
  await prisma.$disconnect();
})

module.exports = { seedUserRoles };
