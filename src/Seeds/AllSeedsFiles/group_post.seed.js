const prisma = require("../../config/prismaClient");

async function seedGroupPosts() {
  try {
    await prisma.group_post.createMany({
      data: [
        {
          id: 'post-1',
          group_id: 'group-1',
          user_id: 'userId-1',
          content: 'Hey everyone! Let’s discuss the new React updates.',
        },
        {
          id: 'post-2',
          group_id: 'group-2',
          user_id: 'userId-2',
          content: 'Anyone tried the latest GPT model in production?',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Group posts seeded');
  } catch (err) {
    console.error('Error seeding group posts:', err);
  }
}


module.exports = { seedGroupPosts };
