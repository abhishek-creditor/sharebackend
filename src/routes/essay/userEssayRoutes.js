const express = require('express');
const router = express.Router({mergeParams : true});
const { verifyToken } = require('../../middleware/authMiddleware');
const {getAllEssays, ShowIndividualEssay, showEssayTopic, submitEssay } = require('../../controllers/essay/userEssayController');

router.use(verifyToken);

//Essay Routes 
router.get('/all-essays', getAllEssays);
router.get('/:essayid/view', ShowIndividualEssay);
router.get('/:essayid/topic', showEssayTopic);
router.post('/:essayid/submit', submitEssay);

module.exports = router;