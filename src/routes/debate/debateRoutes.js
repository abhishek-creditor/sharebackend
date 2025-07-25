const express = require('express');
const router = express.Router();
const debateController = require('../../controllers/debate/debateController');
const { verifyToken, accessTo } = require('../../middleware/authMiddleware');

router.use(verifyToken);

//admin Or instructor 
router.post('/createDebate', accessTo('admin', 'instructor'), debateController.createDebate);
router.get('/getDebate/:debate_id', accessTo('admin', 'instructor', 'learner'), debateController.getDebateById);
router.put('/updateDebate/:debate_id', accessTo('admin', 'instructor'), debateController.updateDebate);
router.delete('/deleteDebate/:debate_id', accessTo('admin', 'instructor'), debateController.deleteDebate);
router.get('/getDebateAnalytics/:debate_id/', accessTo('admin', 'instructor'), debateController.getDebateAnalytics);
router.post('/addParticipant', accessTo('admin', 'instructor'),debateController.addParticipant);
router.delete('/removeParticipant', debateController.removeParticipant);
router.post('/submit-marks-feedback', accessTo('instructor','admin'), debateController.submitMarksAndFeedback);
router.get('/participant-Status/:debate_id',accessTo('instructor','admin'), debateController.getParticipantStatus);

// //learner Routes
router.post('/engageResponse', debateController.engageResponse);
router.post('/addResponse', debateController.addResponse);
router.post('/submitDebate', debateController.submitDebate);
router.get('/:debate_id/user/:user_id/response', debateController.getMyDebateResponse);


module.exports = router;