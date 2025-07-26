const prisma = require("../../config/prismaClient");

async function seedAssignments() {
  try {
    await prisma.assignments.createMany({
      data: [
        {
          id: 'assignment-1',
          title: 'JavaScript Basics Quiz',
          description: 'Complete this quiz to test your knowledge of variables and data types.',
          maxScore: 100,
          timeLimit: 30,
          attempts: 3,
          difficulty: 'EASY',
          instructions: ['Read all questions carefully', 'Submit within 30 minutes'],
          sumissionRequirements: ['Submit as PDF'],
          questions: ['What is a variable?', 'Name three data types in JS.'],
          moduleId: 'module-1',
          instructorId: 'userId-1',
        },
        {
          id: 'assignment-2',
          title: 'Functions in JavaScript',
          description: 'Answer the following questions based on JavaScript functions.',
          maxScore: 100,
          timeLimit: 45,
          attempts: 2,
          difficulty: 'MEDIUM',
          instructions: ['Write code examples', 'Mention expected output'],
          sumissionRequirements: ['Attach code snippets'],
          questions: ['Define a function.', 'What is a return statement?'],
          moduleId: 'module-2',
          instructorId: 'userId-2',
        },
      ],
      skipDuplicates: true,
    });

    console.log('Assignments seeded');
  } catch (err) {
    console.error('Error seeding assignments:', err);
  } 
}



module.exports = { seedAssignments };
