const prisma = require("../../config/prismaClient");

async function seedComments() {
  try {
    await prisma.comment.createMany({
      data: [
        {
          id: 'comment-1',
          post_id: 'post-1',
          user_id: 'userId-2',
          content: 'Yes! The new JSX transform is awesome.',
        },
        {
          id: 'comment-2',
          post_id: 'post-2',
          user_id: 'userId-1',
          content: 'We’ve just started experimenting with it!',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Comments seeded');
  } catch (err) {
    console.error('Error seeding comments:', err);
  }
}



module.exports = { seedComments };
