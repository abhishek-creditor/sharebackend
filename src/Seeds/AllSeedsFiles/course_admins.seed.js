const prisma = require("../../config/prismaClient");

async function seedCourseAdmins() {
  try {
    await prisma.course_admins.createMany({
      data: [
        {
          course_id: 'course-1',
          user_id: 'userId-1',
        },
        {
          course_id: 'course-2',
          user_id: 'userId-2',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Course admins seeded');
  } catch (err) {
    console.error('Error seeding course admins:', err);
  }
}


module.exports = { seedCourseAdmins };
