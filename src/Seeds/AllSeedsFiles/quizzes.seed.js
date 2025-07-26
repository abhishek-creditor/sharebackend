const prisma = require("../../config/prismaClient");

async function seedQuizzes() {
  try {
    await prisma.quizzes.createMany({
      data: [
        {
          id: 'quiz-1',
          module_id: 'module-1',
          title: 'Variables and Data Types Quiz',
          type: "GENERAL",
          maxAttempts: 3,
          max_score: 100,
          min_score: 30,
          time_estimate: 20,
        },
        {
          id: 'quiz-2',
          module_id: 'module-2',
          title: 'Functions Quiz',
          type: "GENERAL",
          maxAttempts: 2,
          max_score: 100,
          min_score: 40,
          time_estimate: 25,
        },
      ],
      skipDuplicates: true,
    });

    console.log('Quizzes seeded');
  } catch (err) {
    console.error('Error seeding quizzes:', err);
  }
}



module.exports = { seedQuizzes };
