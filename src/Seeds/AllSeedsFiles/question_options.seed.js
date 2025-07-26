const prisma = require("../../config/prismaClient");


async function seedQuestionOptions() {
  try {
    await prisma.question_options.createMany({
      data: [
        // question-1 options
        {
          id: 'opt-1',
          questionId: 'question-1',
          text: 'int x = 10;',
          isCorrect: false,
        },
        {
          id: 'opt-2',
          questionId: 'question-1',
          text: 'let x = 10;',
          isCorrect: true,
        },
        {
          id: 'opt-3',
          questionId: 'question-1',
          text: 'var x := 10;',
          isCorrect: false,
        },

        // question-2 options
        {
          id: 'opt-4',
          questionId: 'question-2',
          text: '"null"',
          isCorrect: false,
        },
        {
          id: 'opt-5',
          questionId: 'question-2',
          text: '"object"',
          isCorrect: true,
        },

        // question-3 options
        {
          id: 'opt-6',
          questionId: 'question-3',
          text: 'func',
          isCorrect: false,
        },
        {
          id: 'opt-7',
          questionId: 'question-3',
          text: 'function',
          isCorrect: true,
        },
        {
          id: 'opt-8',
          questionId: 'question-3',
          text: 'method',
          isCorrect: false,
        },
      ],
      skipDuplicates: true,
    });

    console.log('Question options seeded');
  } catch (err) {
    console.error('Error seeding question options:', err);
  }
}


module.exports = { seedQuestionOptions };
