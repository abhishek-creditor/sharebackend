const prisma = require("../../config/prismaClient");

async function seedGroupMessages() {
  try {
    await prisma.group_message.createMany({
      data: [
        {
          id: 'msg-1',
          group_id : 'group-1',
          sender_id: 'userId-1',
          content: 'Welcome to the group!',
          type: 'TEXT',
        },
        {
          id: 'msg-2',
          group_id: 'group-2',
          sender_id: 'userId-2',
          content: 'Happy to be here!',
          type: 'TEXT',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Group messages seeded');
  } catch (err) {
    console.error('Error seeding group messages:', err);
  }
}



module.exports = { seedGroupMessages };
