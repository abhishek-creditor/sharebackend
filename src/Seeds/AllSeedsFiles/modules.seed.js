const prisma = require("../../config/prismaClient");

async function seedModules() {
  try {
    await prisma.modules.createMany({
      data: [
        {
          id: 'module-1',
          course_id: 'course-1',
          title: 'Introduction to JavaScript',
          description: 'Basics of JavaScript syntax and variables.',
          order: 1,
          module_status: 'PUBLISHED',
          estimated_duration: 60,
        },
        {
          id: 'module-2',
          course_id: 'course-1',
          title: 'JavaScript Functions & Scope',
          description: 'Understand how functions and scope work.',
          order: 2,
          module_status: 'PUBLISHED',
          estimated_duration: 90,
        },
        {
          id: 'module-3',
          course_id: 'course-2',
          title: 'PostgreSQL Indexing',
          description: 'Learn about indexing for query optimization.',
          order: 1,
          module_status: 'PUBLISHED',
          estimated_duration: 60,
        },
      ],
      skipDuplicates: true,
    });

    console.log(' Modules seeded');
  } catch (err) {
    console.error(' Error seeding modules:', err);
  } 
}


module.exports = { seedModules };
