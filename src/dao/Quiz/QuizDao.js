const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const createQuiz = async (quizData) => {
  try {
    const newQuiz = await prisma.quizzes.create({
      data: {
        module_id: quizData.module_id,
        title: quizData.title,
        type: quizData.type,
        maxAttempts: quizData.maxAttempts ?? null,
        time_estimate: quizData.time_estimate ?? null,
        max_score: quizData.max_score ?? 100,
        min_score: quizData.min_score ?? 30
      }
    });
    return newQuiz;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};


const getAllQuizzes = async () => {
  return await prisma.quizzes.findMany({
    include: {
      module: true,         
      questions: true       
    }
  });
};


const getQuizById = async (quizId) => {
  return await prisma.quizzes.findUnique({
    where: { id: quizId },
    include: {
      module: true,
      questions: true,
    },
  });
};


const updateQuizById = async (quizId, data) => {
  return await prisma.quizzes.update({
    where: { id: quizId },
    data,
  });
};


const addQuestionToQuiz = async (quizId, questionData) => {
  return await prisma.$transaction(async (tx) => {
    const quizExists = await tx.quizzes.findUnique({
      where: { id: quizId },
    });

    if (!quizExists) {
      throw new Error('Quiz not found with the given ID.');
    }
    const createdQuestion = await tx.quiz_questions.create({
      data: {
        quiz_id: quizId,
        question: questionData.text,
        correct_answer: questionData.correctAnswer,
        question_type: questionData.question_type,
      },
    });
    const formattedOptions = questionData.question_options.map((opt) => ({
      questionId: createdQuestion.id,
      text: opt.text,
      isCorrect: opt.isCorrect,
      matchWith: opt.matchWith,
    }));

    await tx.question_options.createMany({ data: formattedOptions });
    return createdQuestion;
  });
};


const deleteQuiz = async (quizId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      await tx.quiz_question_responses.deleteMany({
        where: {
          question: {
            quiz_id: quizId,
          },
        },
      });
      await tx.question_options.deleteMany({
        where: {
          question: {
            quiz_id: quizId,
          },
        },
      });
      await tx.quiz_questions.deleteMany({
        where: {
          quiz_id: quizId,
        },
      });
      await tx.user_quiz_attempts.deleteMany({
        where: {
          quiz_id: quizId,
        },
      });
      const deletedQuiz = await tx.quizzes.delete({
        where: {
          id: quizId,
        },
      });
      return deletedQuiz;
    });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};


const bulkUploadQuestions = async (quizId, questions) => {
  return await prisma.$transaction(async (tx) => {
    const createdQuestions = [];

    for (const q of questions) {
      const createdQuestion = await tx.quiz_questions.create({
        data: {
          quiz_id: quizId,
          question: q.text,
          correct_answer: q.correctAnswer,
          question_type: q.question_type,
        },
      });
      const optionData = q.question_options.map((opt) => ({
        questionId: createdQuestion.id,
        text: opt.text,
        isCorrect: opt.isCorrect,
        matchWith: opt.matchWith,
      }));
      await tx.question_options.createMany({ data: optionData });
      createdQuestions.push(createdQuestion);
    }
    return createdQuestions;
  });
};


const updateQuestionWithOptions = async (quizId, questionId, {question, correct_answer, question_type, question_options }) => {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.quiz_questions.findUnique({
      where: { id: questionId },
    });

    if (!existing || existing.quiz_id !== quizId) {
      throw new Error('Question not found in specified quiz');
    }
    const updatedQuestion = await tx.quiz_questions.update({
      where: { id: questionId },
      data: {
        question,
        correct_answer,
        question_type,
      },
    });
    await tx.question_options.deleteMany({
      where: { questionId },
    });
    const formattedOptions = question_options.map((opt) => ({
      questionId,
      text: opt.text,
      isCorrect: opt.isCorrect ?? false,
      matchWith: opt.matchWith || null,
    }));
    await tx.question_options.createMany({
      data: formattedOptions,
    });
    return updatedQuestion;
  });
};


const deleteQuestionById = async (quizId, questionId) => {
  return await prisma.$transaction(async (tx) => {
    const question = await tx.quiz_questions.findUnique({
      where: { id: questionId },
    });
    if (!question || question.quiz_id !== quizId) {
      throw new Error('Question not found in this quiz');
    }
    await tx.quiz_question_responses.deleteMany({
      where: { questionId },
    });
    await tx.question_options.deleteMany({
      where: { questionId },
    });
    const deleted = await tx.quiz_questions.delete({
      where: { id: questionId },
    });
    return deleted;
  });
};


const getAllQuestionsByQuizId = async (quizId) => {
  return await prisma.quiz_questions.findMany({
    where: {
      quiz_id: quizId,
    },
    include: {
      question_options: true, 
    },
    orderBy: {
      created_at: 'asc',
    },
  });
};


const getAllAttemptsByQuizId = async (quizId) => {
  return await prisma.user_quiz_attempts.findMany({
    where: { quiz_id: quizId },
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },
      attempts: {
        include: {
          question: {
            select: {
              id: true,
              question: true,
              question_type: true,
            },
          },
        },
      },
    },
    orderBy: {
      attempt_date: 'desc',
    },
  });
};


const addOptions = async (questionId, options) => {
  const formattedOptions = options.map(option => ({
    questionId,
    text: option.text,
    matchWith: option.matchWith || null,
    isCorrect: option.isCorrect ?? null,
  }));

  return await prisma.question_options.createMany({
    data: formattedOptions,
    skipDuplicates: true,
  });
};


const updateOption = async (optionId, updateData) => {
  return await prisma.question_options.update({
    where: { id: optionId },
    data: {
      text: updateData.text,
      matchWith: updateData.matchWith,
      isCorrect: updateData.isCorrect,
    },
  });
};


const deleteOption = async (optionId) => {
  try {
    return await prisma.question_options.delete({
      where: { id: optionId },
    });
  } catch (error) {
    return null;
  }
};


const getCompletedAttempts = async (quizId) => {
  return await prisma.user_quiz_attempts.findMany({
    where: {
      quiz_id: quizId,
      status: 'COMPLETED',
    },
    select: {
      score: true,
      passed: true,
    },
  });
};


const getTotalQuestionsCount = async (quizId) => {
  return await prisma.quiz_questions.count({
    where: { quiz_id: quizId },
  });
};


const getQuizMeta = async (quizId) => {
  return await prisma.quizzes.findUnique({
    where: { id: quizId },
    select: {
      title: true,
      max_score: true,
      min_score: true,
      time_estimate: true,
    },
  });
};


const getLatestAttempt = async (quizId, userId) => {
  return await prisma.user_quiz_attempts.findFirst({
    where: {
      quiz_id: quizId,
      user_id: userId,
    },
    orderBy: {
      attempt_date: 'desc',
    },
    select: {
      id: true,
      score: true,
      passed: true,
      status: true,
      attempt_date: true,
      remarks: true,
    },
  });
};


const getAnsweredQuestionCount = async (attemptId) => {
  return await prisma.quiz_question_responses.count({
    where: {
      attemptId: attemptId,
    },
  });
};


const getLatestAttemptId = async (quizId, userId) => {
  const latestAttempt = await prisma.user_quiz_attempts.findFirst({
    where: {
      quiz_id: quizId,
      user_id: userId,
    },
    orderBy: {
      attempt_date: 'desc',
    },
    select: {
      id: true,
    },
  });
  return latestAttempt?.id || null;
};


const getQuestionResponsesByAttemptId = async (attemptId) => {
  return await prisma.quiz_question_responses.findMany({
    where: {
      attemptId: attemptId,
    },
    include: {
      question: {
        include: {
          quiz: true,
        },
      },
    },
  });
};


const getRawSubmissionsByQuizId = async (quizId) => {
  return await prisma.user_quiz_attempts.findMany({
    where: { quiz_id: quizId },
    select: {
      id: true,
      user_id: true,
      score: true,
      status: true,
      attempt_date: true,
      remarks: true,
      user: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
        },
      },
    },
    orderBy: {
      attempt_date: 'desc',
    },
  });
};


const getQuizScores = async (quizId) => {
  return await prisma.user_quiz_attempts.findMany({
    where: {
      quiz_id: quizId,
      status: 'COMPLETED'
    },
    select: {
      user_id: true,
      score: true,
      passed: true,
      attempt_date: true,
      user: {
        select: {
          first_name: true,
          last_name: true,
          email: true
        }
      }
    },
    orderBy: {
      attempt_date: 'desc'
    }
  });
};


// All for users side:

const startOrResumeAttempt = async (userId, quizId) => {
  const quiz = await prisma.quizzes.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          question_options: true
        }
      }
    }
  });
  if (!quiz) return null;
  const maxAttempts = quiz.maxAttempts;
  if (maxAttempts !== null && maxAttempts !== undefined) {
    const completedAttemptsCount = await prisma.user_quiz_attempts.count({
      where: {
        user_id: userId,
        quiz_id: quizId,
        status: 'COMPLETED'
      }
    });

    if (completedAttemptsCount >= maxAttempts) {
      return null;
    }
  }
  const existingAttempt = await prisma.user_quiz_attempts.findFirst({
    where: {
      user_id: userId,
      quiz_id: quizId,
      status: 'PENDING'
    }
  });
  if (existingAttempt) {
    return existingAttempt;
  }
  const newAttempt = await prisma.user_quiz_attempts.create({
    data: {
      user_id: userId,
      quiz_id: quizId,
      score: 0,
      passed: false,
      status: 'PENDING'
    }
  });
  return newAttempt;
};


const getPendingAttemptWithQuiz = async (userId, quizId) => {
  return await prisma.user_quiz_attempts.findFirst({
    where: {
      user_id: userId,
      quiz_id: quizId,
      status: 'PENDING',
    },
    include: {
      attempts: true, 
      quiz: {
        select: {
          max_score: true,
          min_score: true,
          actions: true,
        },
      },
    },
  });
};

const markAttemptCompleted = async (attemptId, finalScore, passed, remarks) => {
  return await prisma.user_quiz_attempts.update({
    where: { id: attemptId },
    data: {
      score: finalScore,
      passed,
      status: 'COMPLETED',
      remarks,
      submitted_at: new Date() 
    }
  });
};


const getQuizStatus = async (userId, quizId) => {
  const attempt = await prisma.user_quiz_attempts.findFirst({
    where: {
      user_id: userId,
      quiz_id: quizId,
    },
    orderBy: {
      attempt_date: 'desc', 
    },
    select: {
      status: true, 
    },
  });

  return attempt ? attempt.status : 'NOT_ATTEMPTED';
};


const getQuizAttemptSummary = async (attemptId) => {
  return await prisma.user_quiz_attempts.findUnique({
    where: { id: attemptId },
    include: {
      quiz: {
        select: {
          title: true,
          type: true,
          max_score: true,
          min_score: true,
        },
      },
    },
  });
};


const getQuizMaxAttempts = async (quizId) => {
  return await prisma.quizzes.findUnique({
    where: { id: quizId },
    select: { maxAttempts: true },
  });
};


const getUserAttemptCount = async (userId, quizId) => {
  return await prisma.user_quiz_attempts.count({
    where: {
      user_id: userId,
      quiz_id: quizId,
    },
  });
};


const getAllQuizzesForUser = async (userId) => {
  return await prisma.quizzes.findMany({
    include: {
      user_attempts: {
        where: { user_id: userId },
        orderBy: { attempt_date: 'desc' },
        take: 1
      }
    }
  });
};


module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuizById,
  addQuestionToQuiz,
  deleteQuiz,
  bulkUploadQuestions,
  updateQuestionWithOptions,
  deleteQuestionById,
  getAllQuestionsByQuizId,
  getAllAttemptsByQuizId,
  addOptions,
  updateOption,
  deleteOption,
  getCompletedAttempts,
  getTotalQuestionsCount,
  getLatestAttempt,
  getAnsweredQuestionCount,
  getLatestAttemptId,
  getQuestionResponsesByAttemptId,
  getRawSubmissionsByQuizId,
  getQuizMeta,
  startOrResumeAttempt,
  getPendingAttemptWithQuiz,
  markAttemptCompleted,
  getQuizStatus,
  getQuizScores,
  getQuizAttemptSummary,
  getQuizMaxAttempts,
  getUserAttemptCount,
  getAllQuizzesForUser,
};

