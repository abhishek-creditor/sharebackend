const prisma = require("../../config/prismaClient");

async function seedUserQuizAttempts() {
  try {
    await prisma.user_quiz_attempts.createMany({
      data: [
        {
          id: 'attempt-1',
          user_id: 'userId-1',
          quiz_id: 'quiz-1',
          score: 85,
          passed: true,
          status: "COMPLETED",
          remarks: 'Good understanding of JS basics.',
        },
        {
          id: 'attempt-2',
          user_id: 'userId-2',
          quiz_id: 'quiz-2',
          score: 55,
          passed: true,
          status: "COMPLETED",
          remarks: 'Decent function knowledge.',
        },
      ],
      skipDuplicates: true,
    });

    console.log(' User quiz attempts seeded');
  } catch (err) {
    console.error('Error seeding user quiz attempts:', err);
  }
}


module.exports = { seedUserQuizAttempts };
