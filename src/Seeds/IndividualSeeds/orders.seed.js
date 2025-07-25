const prisma = require("../../config/prismaClient");
const {seedOrders}= require('../AllSeedsFiles/orders.seed');

seedOrders().then(async ()=>{
  await prisma.$disconnect();
})


