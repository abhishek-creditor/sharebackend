const express = require('express');
const router = express.Router({mergeParams : true});
const { verifyToken } = require('../../middleware/authMiddleware');
const {showAllAssignment,ShowIndividualAssignment,showAssignmentQuestions,submitAssignment} = require('../../controllers/assignment/userAssignmentController');

router.use(verifyToken);


// Assignment routes
router.get('/all-assignment', showAllAssignment);
router.get('/:assignmentid/view', ShowIndividualAssignment);
router.get('/:assignmentid/questions', showAssignmentQuestions);
router.post('/:assignmentid/submit', submitAssignment);

module.exports = router;