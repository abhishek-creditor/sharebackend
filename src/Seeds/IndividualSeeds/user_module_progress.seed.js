const prisma = require("../../config/prismaClient");

const {seedUserModuleProgress}= require('../AllSeedsFiles/user_module_progress.seed');



seedUserModuleProgress().then(async ()=>{
  await prisma.$disconnect();
})


