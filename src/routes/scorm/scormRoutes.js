const express = require('express');
const router = express.Router();
const scormController = require('../../controllers/scorm/scormController');
const {verifyToken} = require('../../middleware/authMiddleware');

router.use(verifyToken);

router.post('/upload_scorm',scormController.createResourceController);

module.exports = router;
