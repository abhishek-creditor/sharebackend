const prisma = require("../../config/prismaClient");
const {seedOrderItems}= require('../AllSeedsFiles/order_items.seed');



seedOrderItems().then(async ()=>{
  await prisma.$disconnect();
})


