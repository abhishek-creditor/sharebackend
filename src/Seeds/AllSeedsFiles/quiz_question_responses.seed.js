const prisma = require("../../config/prismaClient");

async function seedQuizQuestionResponses() {
  try {
    await prisma.quiz_question_responses.createMany({
      data: [
        {
          id: 'response-1',
          attemptId: 'attempt-1',
          questionId: 'question-1',
          selected: JSON.stringify(['let x = 10;']),
          isCorrect: true,
        },
        {
          id: 'response-2',
          attemptId: 'attempt-1',
          questionId: 'question-2',
          selected: JSON.stringify(['"null"']),
          isCorrect: false,
        },
        {
          id: 'response-3',
          attemptId: 'attempt-2',
          questionId: 'question-3',
          selected: JSON.stringify(['function']),
          isCorrect: true,
        },
      ],
      skipDuplicates: true,
    });

    console.log('Quiz question responses seeded');
  } catch (err) {
    console.error(' Error seeding quiz question responses:', err);
  }
}



module.exports = { seedQuizQuestionResponses };
