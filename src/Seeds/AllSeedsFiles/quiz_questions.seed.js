const prisma = require("../../config/prismaClient");

async function seedQuizQuestions() {
  try {
    await prisma.quiz_questions.createMany({
      data: [
        {
          id: 'question-1',
          quiz_id: 'quiz-1',
          question: 'Which of the following is a valid variable declaration in JavaScript?',
          question_type: "MCQ",
          correct_answer: 'let x = 10;',
        },
        {
          id: 'question-2',
          quiz_id: 'quiz-1',
          question: 'What type is returned by `typeof null` in JavaScript?',
          question_type: "MCQ",
          correct_answer: '"object"',
        },
        {
          id: 'question-3',
          quiz_id: 'quiz-2',
          question: 'Which keyword is used to define a function in JavaScript?',
          question_type: "MCQ",
          correct_answer: 'function',
        },
      ],
      skipDuplicates: true,
    });

    console.log(' Quiz questions seeded');
  } catch (err) {
    console.error('Error seeding quiz questions:', err);
  }
}



module.exports = { seedQuizQuestions };
