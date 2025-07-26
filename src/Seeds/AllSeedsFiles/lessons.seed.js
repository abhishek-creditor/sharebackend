const prisma = require("../../config/prismaClient");

async function seedLessons() {
  try {
    await prisma.lessons.createMany({
      data: [
        {
          id: 'lesson-1',
          unit_id: 'unit-1',
          title: 'Declaring Variables',
          description: 'How to declare variables using let, const, and var.',
          order: 1,
          lesson_status: 'PUBLISHED',
        },
        {
          id: 'lesson-2',
          unit_id: 'unit-1',
          title: 'Primitive Data Types',
          description: 'Overview of strings, numbers, booleans, null, and undefined.',
          order: 2,
          lesson_status: 'PUBLISHED',
        },
        {
          id: 'lesson-3',
          unit_id: 'unit-3',
          title: 'Defining Functions',
          description: 'Syntax and examples of function declarations.',
          order: 1,
          lesson_status: 'PUBLISHED',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Lessons seeded');
  } catch (err) {
    console.error('Error seeding lessons:', err);
  } 
}



module.exports = { seedLessons };
