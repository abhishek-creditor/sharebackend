const prisma = require("../../config/prismaClient");

async function seedLikes() {
  try {
    await prisma.like.createMany({
      data: [
        {
          id: 'likeId-1',
          post_id: 'post-1',
          user_id: 'userId-2',
        },
        {
          id: 'likeId-2',
          post_id : 'post-2',
          user_id: 'userId-1',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Likes seeded');
  } catch (err) {
    console.error('Error seeding likes:', err);
  }
}



module.exports = { seedLikes };
