const prisma = require("../../config/prismaClient");

async function seedCourses() {
  try {
    await prisma.courses.createMany({
      data: [
        {
          id: 'course-1',
          title: 'JavaScript for Beginners',
          description: 'Learn the basics of JavaScript, the most popular programming language for the web.',
          isHidden: false,
          category: 'Programming',
          instructor_id: 'userId-1',
          course_status: 'PUBLISHED',
          estimated_duration: 120,
          courseType: 'SEQUENTIAL',
          lockModules: 'LOCKED',
          price: 0.0,
          requireFinalQuiz: true,
        },
        {
          id: 'course-2',
          title: 'Advanced PostgreSQL',
          description: 'Deep dive into PostgreSQL indexing, performance tuning, and advanced SQL techniques.',
          isHidden: false,
          category: 'Database',
          instructor_id: 'userId-2',
          course_status: 'PUBLISHED',
          estimated_duration: 180,
          courseType: 'SEQUENTIAL',
          lockModules: 'LOCKED',
          price: 199.99,
          requireFinalQuiz: true,
        },
      ],
      skipDuplicates: true,
    });

    console.log('Courses seeded');
  } catch (err) {
    console.error('Error seeding courses:', err);
  } 
}


module.exports = { seedCourses };
