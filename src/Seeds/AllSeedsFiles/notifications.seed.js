const prisma = require("../../config/prismaClient");

async function seedNotifications() {
  try {
    await prisma.notifications.createMany({
      data: [
        {
          id: 'notif-1',
          user_id: 'userId-1',
          title: 'New Assignment Uploaded',
          type : 'chat notification',
          message: 'You have a new assignment in Course 1.',
          read : false,
        },
        {
          id: 'notif-2',
          user_id: 'userId-2',
          title: 'Course Completed',
          type : 'chat notification',
          message: 'Congratulations! You’ve completed the course.',
          read : false,
        },
      ],
      skipDuplicates: true,
    });

    console.log('Notifications seeded');
  } catch (err) {
    console.error('Error seeding notifications:', err);
  }
}


module.exports = { seedNotifications };
