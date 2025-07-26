const prisma = require("../../config/prismaClient");

async function seedLogs() {
  try {
    await prisma.logs.createMany({
      data: [
        {
          id: 'log-1',
          user_id: 'userId-1',
          action: 'LOGIN',
          entity: 'user',
          entity_id: 'userId-1',
          ip_address: '192.168.1.101',
          device_info: 'Chrome on Windows',
        },
        {
          id: 'log-2',
          user_id: 'userId-2',
          action: 'COURSE_ENROLL',
          entity: 'course',
          entity_id: 'course-1',
          ip_address: '192.168.1.102',
          device_info: 'Safari on macOS',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Logs seeded');
  } catch (err) {
    console.error('Error seeding logs:', err);
  }
}



module.exports = { seedLogs };
