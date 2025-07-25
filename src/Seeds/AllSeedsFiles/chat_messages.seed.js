const prisma = require("../../config/prismaClient");

async function seedChatMessages() {
  try {
    await prisma.chat_message.createMany({
      data: [
        {
          id: 'msg-1',
          sender_id: 'userId-1',
          receiver_id: 'userId-3',
          content: 'Hey, did you complete the quiz?',
          conversation_id: 'conv-1',
        },
        {
          id: 'msg-2',
          sender_id: 'userId-3',
          receiver_id: 'userId-2',
          content: 'Yes, I did! It was tricky.',
          conversation_id: 'conv-1',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Chat messages seeded');
  } catch (err) {
    console.error('Error seeding chat messages:', err);
  }
}


module.exports = { seedChatMessages };
