const prisma = require("../../config/prismaClient");
const {seedNotifications}= require('../AllSeedsFiles/notifications.seed');

seedNotifications().then(async ()=>{
  await prisma.$disconnect();
})

