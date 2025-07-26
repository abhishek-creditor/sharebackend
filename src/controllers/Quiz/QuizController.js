const QuizDao = require('../../dao/Quiz/QuizDao');
const messages = require('../../utils/messages');
const {successResponse, errorResponse} = require('../../utils/apiResponse');
const {
  quizSchema,quizUpdateSchema,addQuestionSchema,bulkUploadQuestionSchema,updateQuestionSchema,questionIdParamSchema,
  addOptionsSchema,updateOptionSchema} = require('../../validator/quizValidate');


// All for Admin side:
const createQuiz = async (req, res) => {
  try {
    const { error, value } = quizSchema.validate(req.body);
    if (error) {
      return errorResponse(req, res, 400, error.details[0].message);
    }
    const newQuiz = await QuizDao.createQuiz(value);
    return successResponse(req, res, newQuiz, 201, messages.QUIZ_CREATED);
  } catch (err) {
    console.error('Error creating quiz:', err);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await QuizDao.getAllQuizzes();
    return successResponse(req, res, quizzes, 200, messages.QUIZ_FETCHED);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const getQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await QuizDao.getQuizById(quizId);
    if (!quiz) {
      return errorResponse(req, res, 404, messages.QUIZ_NOT_FOUND);
    }
    return successResponse(req, res, quiz, 200, messages.QUIZ_FETCHED);
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
   return errorResponse(req, res, 500, messages.FAILED_TO_ADD_QUESTION);

  }
};


const updateQuizById = async (req, res) => {
  try {
    const quizId = req.params.id;

    const { error, value } = quizUpdateSchema.validate(req.body);
    if (error) {
      return errorResponse(req, res, 400, error.details[0].message);
    }
    const updatedQuiz = await QuizDao.updateQuizById(quizId, value);
    return successResponse(req, res, updatedQuiz, 200, messages.QUIZ_UPDATED);
  } catch (error) {
    console.error('Error updating quiz:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const addQuestionToQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { error, value } = addQuestionSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return errorResponse(req, res, 400, error.details[0].message);
    }
    const formattedOptions = value.question_options.map((opt) => ({
      text: opt.text.trim(),
      isCorrect: opt.isCorrect ?? false,
      matchWith: opt.matchWith || null,
    }));
    const newQuestion = await QuizDao.addQuestionToQuiz(quizId, {
      text: value.text,
      correctAnswer: value.correctAnswer,
      question_type: value.question_type,
      question_options: formattedOptions,
    });
    return successResponse(req, res, newQuestion, 201, messages.QUESTION_ADDED);
  } catch (error) {
    console.error('Error in addQuestionToQuiz:', error);
    return errorResponse(req, res, 500, messages.FAILED_TO_ADD_QUESTION);
  }
};


const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await QuizDao.deleteQuiz(id);
    return successResponse(req, res, result, 200, messages.QUIZ_AND_RELATED_DATA_DELETED);
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return errorResponse(req, res, 500, messages.FAILED_TO_DELETE_QUIZ);
  }
};


const bulkUploadQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { error, value } = bulkUploadQuestionSchema.validate(req.body);
    if (error) {
      return errorResponse(req, res, 400, error.details[0].message);
    }
    const { texts, correctAnswers, question_types, question_options } = value;
    const total = texts.length;
    const formattedQuestions = texts.map((text, index) => ({
      text: text.trim(),
      correctAnswer: correctAnswers[index] || '',
      question_type: question_types[index] || 'MCQ',
      question_options: question_options[index].map((opt) => ({
        text: opt.text.trim(),
        isCorrect: opt.isCorrect ?? false,
        matchWith: opt.matchWith || null,
      })),
    }));
    const addedQuestions = await QuizDao.bulkUploadQuestions(quizId, formattedQuestions);
    return successResponse(req, res, addedQuestions, 201, messages.QUESTIONS_ADDED);
  } catch (error) {
    console.error('Error in bulkUploadQuestions:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const updateQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;

  const { error, value } = updateQuestionSchema.validate(req.body);
  if (error) {
    return errorResponse(req, res, 400, error.details[0].message);
  }
  const { text, correct_answer, question_type, question_options } = value;
  try {
    const updatedQuestion = await QuizDao.updateQuestionWithOptions(quizId, questionId, {
      question: text,
      correct_answer,
      question_type,
      question_options,
    });
    return successResponse(req, res, updatedQuestion, 200, messages.QUESTION_UPDATED);
  } catch (error) {
    console.error('Error updating question:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const deleteQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  try {
    const result = await QuizDao.deleteQuestionById(quizId, questionId);
    return successResponse(req, res, result, 200, messages.QUESTION_DELETED);
  } catch (error) {
    console.error('Error deleting question:', error);
    return errorResponse(req, res, 500, error.message || messages.INTERNAL_SERVER_ERROR);

  }
};


const getAllQuestionsByQuizId = async (req, res) => {
  try {
    const { quizId } = req.params;
    const questions = await QuizDao.getAllQuestionsByQuizId(quizId);
    return successResponse(req, res, questions, 200, messages.QUESTIONS_FETCHED);
  } catch (error) {
    console.error('Error in getAllQuestionsByQuizId:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const getAllAttemptsByQuizId = async (req, res) => {
  try {
    const { quizId } = req.params;
    const rawAttempts = await QuizDao.getAllAttemptsByQuizId(quizId);
    const formattedAttempts = rawAttempts.map((attempt) => {
      let finalStatus = 'NOT_ATTEMPTED';
      if (attempt.status === 'PENDING') finalStatus = 'PENDING';
      else if (attempt.status === 'COMPLETED') finalStatus = 'COMPLETED';
      return {
        attemptId: attempt.id,
        userId: attempt.user.id,
        name: `${attempt.user.first_name} ${attempt.user.last_name}`,
        email: attempt.user.email,
        score: attempt.score,
        passed: attempt.passed,
        remarks: attempt.remarks,
        status: finalStatus,
        attemptDate: attempt.attempt_date,
        questionResponses: attempt.quiz_question_responses,
      };
    });
    return successResponse(req, res, formattedAttempts, 200, messages.ATTEMPTS_FETCHED);
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};



const addOptionsToQuestion = async (req, res) => {
  try {
    const { error: paramError } = questionIdParamSchema.validate(req.params);
    if (paramError) {
      return errorResponse(req, res, 400, messages.QUESTION_ID_REQUIRED);
    }
    const { error: bodyError, value } = addOptionsSchema.validate(req.body);
    if (bodyError) {
      return errorResponse(req, res, 400, bodyError.details[0].message);
    }
    const { questionId } = req.params;
    const createdOptions = await QuizDao.addOptions(questionId, value.options);
    return successResponse(req, res, createdOptions, 201, messages.OPTIONS_ADDED);
  } catch (error) {
    console.error('Error adding options:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const updateOptionById = async (req, res) => {
  try {
    const { optionId } = req.params;
    if (!optionId) {
      return errorResponse(req, res, 400, messages.OPTION_ID_REQUIRED);
    }
    const { error, value } = updateOptionSchema.validate(req.body);
    if (error) {
      return errorResponse(req, res, 400, error.details[0].message);
    }
    const updatedOption = await QuizDao.updateOption(optionId, value);
    if (!updatedOption) {
      return errorResponse(req, res, 404, messages.OPTION_NOT_FOUND);
    }
    return successResponse(req, res, updatedOption, 200, messages.OPTION_UPDATED);
  } catch (error) {
    console.error('Error updating option:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const deleteOptionById = async (req, res) => {
  try {
    const { optionId } = req.params;
    const deleted = await QuizDao.deleteOption(optionId);
    if (!deleted) {
      return res.status(404).json({ message: 'Option not found' });
    }
    return successResponse(req, res, deleted, 200, messages.OPTION_DELETED);
  } catch (error) {
    console.error('Error deleting option:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const getOverallQuizAnalytics = async (req, res) => {
  try {
    const { quizId } = req.params;
    const attempts = await QuizDao.getCompletedAttempts(quizId);
    const totalQuestions = await QuizDao.getTotalQuestionsCount(quizId);
    const quizDetails = await QuizDao.getQuizMeta(quizId);
    const totalAttempts = attempts.length;
    const passedCount = attempts.filter((a) => a.passed).length;
    const failedCount = totalAttempts - passedCount;
    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
    const averageScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;
    const passPercentage = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;
    const scores = attempts.map((a) => a.score);
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    const analytics = {
      quizTitle: quizDetails?.title || "Untitled Quiz",
      totalAttempts,
      totalQuestions,
      passedCount,
      failedCount,
      averageScore,
      passPercentage,
      highestScore,
      lowestScore,
      maxScore: quizDetails?.max_score || 100,
      minScore: quizDetails?.min_score || 30,
      timeEstimate: quizDetails?.time_estimate || null,
    };
    return successResponse(req, res, analytics, 200, messages.ANALYTICS_FETCHED);
  } catch (error) {
    console.error('Error fetching quiz analytics:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const getSpecificUserQuizAnalytics = async (req, res) => {
  try {
    const { quizId, userId } = req.params;
    const latestAttempt = await QuizDao.getLatestAttempt(quizId, userId);
    if (!latestAttempt) {
      return successResponse(req,res,{message: 'No attempt found for this user',status: 'NOT_ATTEMPTED'},200,messages.USER_ANALYTICS_FETCHED);
    }
    const totalQuestions = await QuizDao.getTotalQuestionsCount(quizId);
    const answeredCount = await QuizDao.getAnsweredQuestionCount(latestAttempt.id);
    let status = 'NOT_ATTEMPTED';
    if (answeredCount === totalQuestions) status = 'COMPLETED';
    else if (answeredCount > 0) status = 'PENDING';

    const analytics = {
      score: latestAttempt.score,
      passed: latestAttempt.passed,
      status,
      attemptDate: latestAttempt.attempt_date,
      remarks: latestAttempt.remarks || '',
      answeredCount,
      totalQuestions,
    };
    return successResponse(req, res, analytics, 200, messages.USER_ANALYTICS_FETCHED);
  } catch (error) {
    console.error('Error fetching user quiz performance:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const getUserQuestionPerformance = async (req, res) => {
  try {
    const { quizId, userId } = req.params;
    const latestAttempt = await QuizDao.getLatestAttemptId(quizId, userId);
    if (!latestAttempt) {
      return successResponse(req, res, { quizId, userId, questionPerformance: [] }, 200, messages.QUESTION_PERFORMANCE_FETCHED);
    }
    const responses = await QuizDao.getQuestionResponsesByAttemptId(latestAttempt);
    const questionPerformance = responses.map(response => {
      const question = response.question;
      return {
        quizTitle: question.quiz.title,
        questionId: response.questionId,
        questionText: question.question,
        userAnswer: response.selected,
        correctAnswer: question.correct_answer,
        isCorrect: response.isCorrect,
        marksObtained: response.isCorrect ? 1 : 0,
      };
    });
    return successResponse(req, res, { quizId, userId, questionPerformance }, 200, messages.QUESTION_PERFORMANCE_FETCHED);
  } catch (error) {
    console.error('Error fetching user question performance:', error);
    return errorResponse(req, res, 500, error.message || messages.INTERNAL_SERVER_ERROR);
  }
};


const getSubmissionStatusByQuizId = async (req, res) => {
  try {
    const { quizId } = req.params;
    const rawSubmissions = await QuizDao.getRawSubmissionsByQuizId(quizId);
    const submissions = rawSubmissions.map(sub => ({
      attemptId: sub.id,
      userId: sub.user_id,
      userName: `${sub.user.first_name} ${sub.user.last_name}`,
      email: sub.user.email,
      status: sub.status,
      score: sub.score,
      attemptDate: sub.attempt_date,
      remarks: sub.remarks || '',
    }));
    const totalEnrolled = submissions.length;
    const completed = submissions.filter(s => s.status === 'COMPLETED').length;
    const pending = submissions.filter(s => s.status === 'PENDING').length;
    const notAttempted = submissions.filter(s => s.status === 'NOT_ATTEMPTED').length;

    const summary = {
      totalEnrolled,
      completed,
      pending,
      notAttempted,
    };
    return successResponse(req,res,{ quizId, summary, submissions },200,messages.SUBMISSION_STATUS_FETCHED);
  } catch (error) {
    console.error('Error fetching quiz submissions:', error);
    return errorResponse(req, res, 500, error.message || messages.INTERNAL_SERVER_ERROR);
  }
};


const getQuizScores = async (req, res) => {
  try {
    const { quizId } = req.params;
    const results = await QuizDao.getQuizScores(quizId);
    const scores = results.map(r => ({
      userId: r.user_id,
      userName: `${r.user.first_name} ${r.user.last_name}`,
      email: r.user.email,
      score: r.score,
      passed: r.passed,
      attemptDate: r.attempt_date
    }));
    return successResponse(req, res, { quizId, scores }, 200, messages.QUIZ_SCORES_FETCHED);
  } catch (error) {
    console.error('Error fetching quiz scores:', error);
    return errorResponse(req, res, 500, error.message || messages.INTERNAL_SERVER_ERROR);
  }
};

// All for User side:
const startQuizAttempt = async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const attempt = await QuizDao.startOrResumeAttempt(userId, quizId);
    if (!attempt) {
      return errorResponse(req, res, 403, messages.MAX_ATTEMPTS_REACHED_OR_QUIZ_NOT_FOUND);
    }
    return successResponse(req, res, attempt, 200, messages.QUIZ_ATTEMPT_STARTED);
  } catch (error) {
    console.error('Error starting/resuming quiz:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const submitQuiz = async (req, res) => {
  const { userId, quizId } = req.params;
  try {
    const attempt = await QuizDao.getPendingAttemptWithQuiz(userId, quizId);
    if (!attempt) {
      return errorResponse(req, res, 404, messages.NO_PENDING_ATTEMPT);
    }
    if (!Array.isArray(attempt.attempts)) {
      return errorResponse(req, res, 400, messages.NO_QUESTION_RESPONSES_FOUND);
    }
    const totalQuestions = attempt.attempts.length;
    const correctAnswers = attempt.attempts.filter(q => q.isCorrect).length;
    const maxScore = attempt.quiz.max_score || 100;
    const minScore = attempt.quiz.min_score || 30;
    const finalScore = totalQuestions > 0? Math.round((correctAnswers / totalQuestions) * maxScore): 0;
    const passed = finalScore >= minScore;
    const remarks = passed ? 'Well done!' : 'Needs improvement';
    let grade = 'D';
    if (finalScore >= 90) grade = 'A';
    else if (finalScore >= 75) grade = 'B';
    else if (finalScore >= 50) grade = 'C';
    const updated = await QuizDao.markAttemptCompleted(attempt.id, finalScore, passed, remarks);
    return successResponse(req, res,{...updated,score: `${finalScore} (${grade})`,remarks,passed},200,messages.QUIZ_SUBMITTED);

  } catch (error) {
    console.error('Error submitting quiz:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const getQuizStatus = async (req, res) => {
  const { userId, quizId } = req.params;
  try {
    const status = await QuizDao.getQuizStatus(userId, quizId);
    return successResponse(req, res, { status }, 200, messages.QUIZ_ATTEMPT_STATUS_FETCHED);
  } catch (error) {
    console.error('Error fetching quiz status:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};                                          


const getUserAttemptedQuizzes = async (req, res) => {
  try {
    const { userId } = req.params;
    const quizzes = await QuizDao.getAttemptedQuizzesByUser(userId);
    return successResponse(req, res, quizzes, 200, messages.ATTEMPTED_QUIZZES_FETCHED);
  } catch (error) {
    console.error('Error fetching attempted quizzes:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const getAttemptSummary = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const attempt = await QuizDao.getQuizAttemptSummary(attemptId);
    if (!attempt) {
      return errorResponse(req, res, 404, messages.ATTEMPT_NOT_FOUND);
    }
    res.status(200).json({
      attemptId: attempt.id,
      quizTitle: attempt.quiz.title,
      quizType: attempt.quiz.type,
      score: attempt.score,
      passed: attempt.passed,
      max_score: attempt.quiz.max_score,
      min_score: attempt.quiz.min_score,
      attempt_date: attempt.attempt_date,
    });
  } catch (error) {
    console.error('Error fetching attempt summary:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const getRemainingAttempts = async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const quiz = await QuizDao.getQuizMaxAttempts(quizId);
    if (!quiz) {
      return errorResponse(req, res, 404, messages.QUIZ_NOT_FOUND);
    }
    const attempted = await QuizDao.getUserAttemptCount(userId, quizId);
    const maxAttempts = quiz.maxAttempts || 1;
    const remaining = Math.max(0, maxAttempts - attempted);
    return successResponse(req, res, { quizId, maxAttempts, attempted, remainingAttempts: remaining }, 200, messages.REMAINING_ATTEMPTS_FETCHED);
  } catch (error) {
    console.error('Error fetching remaining attempts:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


const getAllQuizzesForUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const rawQuizzes = await QuizDao.getAllQuizzesForUser(userId);
    const formatted = rawQuizzes.map(quiz => {
      const attempt = quiz.user_attempts[0];
      return {
        quizId: quiz.id,
        title: quiz.title,
        maxScore: quiz.max_score,
        status: attempt ? attempt.status : 'NOT_ATTEMPTED',
        score: attempt?.score || null,
        attemptDate: attempt?.attempt_date || null,
      };
    });
    return successResponse(req, res, formatted, 200, messages.USER_QUIZZES_WITH_STATUS_FETCHED);
  } catch (error) {
    console.error('Error fetching quizzes for user:', error);
    return errorResponse(req, res, 500, messages.INTERNAL_SERVER_ERROR);
  }
};


module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuizById,
  addQuestionToQuiz,
  deleteQuiz,
  bulkUploadQuestions,
  updateQuestion ,
  deleteQuestion,
  getAllQuestionsByQuizId,
  getAllAttemptsByQuizId,
  addOptionsToQuestion,
  updateOptionById,
  deleteOptionById,
  getOverallQuizAnalytics,
  getSpecificUserQuizAnalytics,
  getUserQuestionPerformance,
  getSubmissionStatusByQuizId,
  getQuizScores,
  startQuizAttempt,
  submitQuiz,
  getQuizStatus,
  getUserAttemptedQuizzes,
  getAttemptSummary,
  getRemainingAttempts,
  getAllQuizzesForUser,
};
