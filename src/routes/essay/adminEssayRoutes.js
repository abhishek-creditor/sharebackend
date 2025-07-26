const express = require('express');
const router = express.Router({mergeParams : true});
const { verifyToken ,accessTo} = require('../../middleware/authMiddleware');

const{createEssay ,
     getAllEssays,
     viewEssay, 
     updateEssay,
     viewAnalytics,
     viewAndGrade,
     viewEssayOverview,
     viewScores,
     viewSubmissionStatus, 
    viewSubmittedEssay } = require('../../controllers/essay/adminEssayController');

router.use(verifyToken);


//Essay Routes
router.post('/create',  accessTo('instructor','admin'), createEssay);
router.get('/all-essays', accessTo('instructor','admin'), getAllEssays);
router.get('/:essayid/view',  accessTo('instructor','admin'), viewEssay);
router.patch('/:essayid/update',  accessTo('instructor','admin'), updateEssay);
router.get('/:essayid/overview',  accessTo('instructor','admin'), viewEssayOverview);
router.get('/:essayid/scores',  accessTo('instructor','admin'), viewScores);
router.get('/:essayid/submission-status',  accessTo('instructor','admin'), viewSubmissionStatus);
router.get('/:essayid/analytics',  accessTo('instructor','admin'), viewAnalytics);
router.get('/:essayid/scores/view-submitted-essay/:essaysubmissionid',  accessTo('instructor','admin'), viewSubmittedEssay);
router.post('/:essayid/scores/view-submitted-essay/:essaysubmissionid/grade',  accessTo('instructor','admin'), viewAndGrade);



module.exports = router;