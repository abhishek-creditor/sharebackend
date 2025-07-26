const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/authMiddleware');

const { 
  getUserProfile,
  updateUserProfile, 
  emailUpdate, 
  verifyEmail, 
  updateProfileImage 
} = require('../../controllers/user/userProfileController');
const { uploadMiddleware } = require('../../middleware/uploadMiddleware');
const { getMyCourses, getMyCourseById } = require('../../controllers/user/userCourseController');


// Apply auth middleware to all routes
router.use(verifyToken);

// Profile routes
router.get('/getUserProfile', getUserProfile);
router.put('/updateUserProfile', updateUserProfile);
router.post('/emailUpdate', emailUpdate);
router.post('/verifyEmail', verifyEmail);
router.post('/updateProfileImage', uploadMiddleware, updateProfileImage);

// Course Routes
router.get('/getMyCourses', getMyCourses);
router.get('/getMyCourseById', getMyCourseById)


module.exports = router;