const prisma = require("../../config/prismaClient");

async function seedCourseInstructors() {
  try {
    await prisma.course_instructors.createMany({
      data: [
        {
          id: 'ci-1',
          course_id: 'course-1',
          user_id: 'userId-2',
          isPrimary: true,
        },
        {
          id: 'ci-2',
          course_id: 'course-2',
          user_id: 'userId-2',
          isPrimary: false,
        },
      ],
      skipDuplicates: true,
    });

    console.log('Course instructors seeded');
  } catch (err) {
    console.error('Error seeding course instructors:', err);
  }
}



module.exports = { seedCourseInstructors };
