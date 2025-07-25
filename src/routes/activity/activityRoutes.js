// routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const activityController = require('../../controllers/activity/activityController');

router.get('/activity/:userId', activityController.getUserActivity);
router.delete('/activity/:userId', activityController.deleteUserActivity);

module.exports = router;
