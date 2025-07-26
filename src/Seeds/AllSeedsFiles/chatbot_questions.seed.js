const prisma = require("../../config/prismaClient");

async function seedChatbotQuestions() {
  try {
    await prisma.chatbot_questions.createMany({
      data: [
        {
          id: 'q-1',
          section_id: 'section-1',
          question: 'How can I reset my password?',
          response: 'Go to settings and click on "Reset Password".',
        },
        {
          id: 'q-2',
          section_id: 'section-2',
          course_id: 'course-1',
          question: 'What is the duration of this course?',
          response: 'It takes approximately 6 weeks.',
        },
        {
          id: 'q-3',
          section_id: 'section-2',
          lesson_id: 'lesson-1',
          question: 'Do I need to complete this lesson to proceed?',
          response: 'Yes, lessons must be completed in order.',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Chatbot questions seeded');
  } catch (err) {
    console.error('Error seeding chatbot questions:', err);
  }
}


module.exports = { seedChatbotQuestions };
