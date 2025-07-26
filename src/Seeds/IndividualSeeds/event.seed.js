const { seedEvents} = require('../AllSeedsFiles/event.seed');
const prisma = require("../../config/prismaClient");

seedEvents().then(async () => {
  await prisma.$disconnect();
});