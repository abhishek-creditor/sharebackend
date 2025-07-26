const express = require('express');
const router = express.Router({mergeParams : true});
const { verifyToken ,accessTo} = require('../../middleware/authMiddleware');
const {createAssignment, getAllAssignment, 
       viewAssignment, viewAssignmentOverview,
       UpdateAssignmentOverview, viewAllAssignmnetQuestions,
       getAssignmentQuestion, updateAssignmentQuestion,
       addAssignmnetQuestion, viewAssignmentScores,
       viewSumittedAssignment, gradeSumittedAssignment,
       viewAssignmnetSubmissionStatus, viewAssignmentAnalytics} = require('../../controllers/assignment/adminAssignmentController');

router.use(verifyToken);

//Assignment Routes
router.post('/create',  accessTo('instructor','admin'), createAssignment);
router.get('/all-assignment',  accessTo('instructor','admin'), getAllAssignment);
router.get('/:assignmentid/view',  accessTo('instructor','admin'), viewAssignment);
router.get('/:assignmentid/overview',  accessTo('instructor','admin'), viewAssignmentOverview);
router.patch('/:assignmentid/update',  accessTo('instructor','admin'), UpdateAssignmentOverview);
router.get('/:assignmentid/questions',  accessTo('instructor','admin'), viewAllAssignmnetQuestions);
router.get('/:assignmentid/questions/:questionid',  accessTo('instructor','admin'), getAssignmentQuestion );
router.patch('/:assignmentid/questions/:questionid/update',  accessTo('instructor','admin'), updateAssignmentQuestion );
router.post('/:assignmentid/add-question',  accessTo('instructor','admin'), addAssignmnetQuestion);
router.get('/:assignmentid/scores',  accessTo('instructor','admin'), viewAssignmentScores);
router.get('/:assignmentid/scores/view-sumitted-assignment/:assignmentsubmissionid',  accessTo('instructor','admin'), viewSumittedAssignment);
router.post('/:assignmentid/scores/view-sumitted-assignment/:assignmentsubmissionid/grade',  accessTo('instructor','admin'), gradeSumittedAssignment )
router.get('/:assignmentid/submission-status',  accessTo('instructor','admin'), viewAssignmnetSubmissionStatus );
router.get('/:assignmentid/analytics',  accessTo('instructor','admin'), viewAssignmentAnalytics);

module.exports = router;