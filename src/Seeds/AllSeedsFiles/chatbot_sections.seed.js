const prisma = require("../../config/prismaClient");

async function seedChatbotSections() {
  try {
    await prisma.chatbot_sections.createMany({
      data: [
        {
          id: 'section-1',
          name: 'General Info',
        },
        {
          id: 'section-2',
          name: 'Course Queries',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Chatbot sections seeded');
  } catch (err) {
    console.error('Error seeding chatbot sections:', err);
  }
}



module.exports = { seedChatbotSections };
