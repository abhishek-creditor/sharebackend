const prisma = require("../../config/prismaClient");

async function seedConversations() {
  try {
    await prisma.conversations.createMany({
      data: [
        {
          conv_id: 'conv-1',
          subject: 'Assignment Discussion',
          user1_id: 'userId-1',
          user2_id: 'userId-2',
        },
        {
          conv_id: 'conv-2',
          subject: 'Course Feedback',
          user1_id: 'userId-3',
          user2_id: 'userId-1',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Conversations seeded');
  } catch (err) {
    console.error('Error seeding conversations:', err);
  }
}


module.exports = { seedConversations };
