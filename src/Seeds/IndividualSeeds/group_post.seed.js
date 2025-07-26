const prisma = require("../../config/prismaClient");
const {seedGroupPosts}= require('../AllSeedsFiles/group_post.seed');

seedGroupPosts().then(async ()=>{
  await prisma.$disconnect();
})


