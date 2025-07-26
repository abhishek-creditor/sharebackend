const prisma = require("../../config/prismaClient");

async function seedUserCourseAccess() {
  try {
    await prisma.user_course_access.createMany({
      data: [
        {
          id: 'uca-1',
          user_id: 'userId-1',
          course_id: 'course-1',
          granted_by: "MANUAL",
          status: 'ACTIVE',
        },
        {
          id: 'uca-2',
          user_id: 'userId-2',
          course_id: 'course-1',
          granted_by: "MANUAL",
          status: "ACTIVE",
        },
        {
          id: 'uca-3',
          user_id: 'userId-1',
          course_id: 'course-2',
          granted_by: "MANUAL",
          status: "ACTIVE",
        },
      ],
      skipDuplicates: true,
    });

    console.log('User course access seeded');
  } catch (err) {
    console.error(' Error seeding user course access:', err);
  }
}


module.exports = { seedUserCourseAccess };
