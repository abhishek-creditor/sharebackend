const prisma = require("../../config/prismaClient");


async function seedAssignmentSubmissions() {
  try {
    await prisma.assignment_submission.createMany({
      data: [
        {
          id: 'submission-1',
          assignmentId: 'assignment-1',
          studentId: 'userId-1',
          url: 'khdsfkjf',
          // additionalNotes: 'Completed all questions.',
        },
        {
          id: 'submission-2',
          assignmentId: 'assignment-1',
          studentId: 'userId-2',
          url: 'kjdkjshd',
          // additionalNotes: 'Skipped the last question.',
        },
        {
          id: 'submission-3',
          assignmentId: 'assignment-2',
          studentId: 'userId-3',
          url: 'akdjhk',
          // additionalNotes: 'Included code samples.',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Assignment submissions seeded');
  } catch (err) {
    console.error('Error seeding assignment submissions:', err);
  }
}



module.exports = { seedAssignmentSubmissions };
