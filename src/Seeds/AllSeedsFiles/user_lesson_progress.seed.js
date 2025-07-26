const prisma = require("../../config/prismaClient");

async function seedUserLessonProgress() {
  try {
    await prisma.user_lesson_progress.createMany({
      data: [
        {
          id: 'ulp-1',
          user_id: 'userId-1',
          lesson_id: 'lesson-1',
          completed: true,
          progress: 100,
          time_spent: 600,
        },
        {
          id: 'ulp-2',
          user_id: 'userId-2',
          lesson_id: 'lesson-2',
          completed: false,
          progress: 50,
          time_spent: 300,
        },
      ],
      skipDuplicates: true,
    });

    console.log('User lesson progress seeded');
  } catch (err) {
    console.error('Error seeding user lesson progress:', err);
  }
}


module.exports = { seedUserLessonProgress };
