const express = require('express');
const router = express.Router();
const QuizController = require('../../controllers/Quiz/QuizController');
const {verifyToken ,accessTo} = require('../../middleware/authMiddleware');
router.use(verifyToken);

// Routes of the quiz (Admin side)
router.post('/Quiz',accessTo('admin','instructor'), QuizController.createQuiz);
router.get('/getQuiz',accessTo('admin','instructor'), QuizController.getAllQuizzes);
router.get('/:id/getQuizById',accessTo('admin','instructor'), QuizController.getQuizById);
router.put('/:id/updateQuizz',accessTo('admin','instructor'), QuizController.updateQuizById);
router.post('/:quizId/questions',accessTo('admin','instructor'), QuizController.addQuestionToQuiz);
router.delete('/admin/quizzes/:id',accessTo('admin','instructor'), QuizController.deleteQuiz);
router.post('/admin/quizzes/:quizId/questions/bulk-upload',accessTo('admin','instructor'), QuizController.bulkUploadQuestions);
router.put('/admin/quizzes/:quizId/questions/:questionId',accessTo('admin','instructor'), QuizController.updateQuestion);
router.delete('/admin/quizzes/:quizId/questions/:questionId',accessTo('admin','instructor'), QuizController.deleteQuestion);
router.get('/admin/quizzes/:quizId/questions', accessTo('admin','instructor'), QuizController.getAllQuestionsByQuizId);
router.get('/admin/quizzes/:quizId/attempts',accessTo('admin','instructor'), QuizController.getAllAttemptsByQuizId);
router.post('/questions/:questionId/options',accessTo('admin','instructor'), QuizController.addOptionsToQuestion);
router.put('/options/:optionId/updateOption',accessTo('admin','instructor'), QuizController.updateOptionById);
router.delete('/options/:optionId/deleteOption',accessTo('admin','instructor'), QuizController.deleteOptionById);
router.get('/admin/quizzes/:quizId/analytics',accessTo('admin','instructor'), QuizController.getOverallQuizAnalytics);
router.get('/admin/quizzes/:quizId/user-analytics/:userId',accessTo('admin','instructor'),QuizController.getSpecificUserQuizAnalytics);
router.get('/admin/quizzes/:quizId/user-analytics/:userId/questions',accessTo('admin','instructor'), QuizController.getUserQuestionPerformance);
router.get('/admin/quizzes/:quizId/submission_status',accessTo('admin','instructor'), QuizController.getSubmissionStatusByQuizId);
router.get('/admin/quizzes/:quizId/scores',accessTo('admin','instructor'), QuizController.getQuizScores);



// Routes of the quiz (User side)
router.post('/user/:userId/quizzes/:quizId/start', QuizController.startQuizAttempt);
router.post('/user/:userId/quizzes/:quizId/submit', QuizController.submitQuiz);
router.get('/user/:userId/quizzes/:quizId/status', QuizController.getQuizStatus);
router.get('/user/quiz/attempts/:attemptId', QuizController.getAttemptSummary);
router.get('/user/:userId/quizzes/:quizId/remaining-attempts', QuizController.getRemainingAttempts);
router.get('/user/:userId/quizzes', QuizController.getAllQuizzesForUser)

module.exports = router;
