<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/admin/courseController');
const { verifyToken} = require('../../middleware/authMiddleware');
const { uploadMiddleware, handleError } = require('../../middleware/uploadMiddleware');

router.use(verifyToken);

//couses Routes
router.post('/createCourse', uploadMiddleware, (err, req, res, next) => handleError(err, req, res, next), courseController.createCourseController);
router.put('/editCourse/:courseId', uploadMiddleware, (err, req, res, next) => handleError(err, req, res, next), courseController.editCourseController);
router.post('/addInstructor/:courseId', courseController.addInstructorController);
router.post('/addAdmin/:courseId', courseController.addAdminController);
router.get('/getAllCourses', courseController.getAllCoursesController);
router.get('/getCourseById/:id', courseController.getCourseByIdController);
router.post('/addLearnerToCourse', courseController.addLearnerToCourse);




//User's/Learner's Routes 

router.get('/getCourses', courseController.getUserCoursesController)

//Modules Routes
router.post('/modules', courseController.createModule);



module.exports = router;
=======
const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/admin/courseController');
const { verifyToken} = require('../../middleware/authMiddleware');
const { uploadMiddleware, handleError } = require('../../middleware/uploadMiddleware');

router.use(verifyToken);

//couses Routes
router.post('/createCourse', uploadMiddleware, (err, req, res, next) => handleError(err, req, res, next), courseController.createCourseController);
router.put('/editCourse/:courseId', uploadMiddleware, (err, req, res, next) => handleError(err, req, res, next), courseController.editCourseController);
router.post('/addInstructor/:courseId', courseController.addInstructorController);
router.post('/addAdmin/:courseId', courseController.addAdminController);
router.get('/getAllCourses', courseController.getAllCourses);
router.get('/getCourseById', courseController.getCourseById);
router.post('/addLearnerToCourse', courseController.addLearnerToCourse);








//User's/Learner's Routes 

router.get('/getCourses', courseController.getUserCoursesController)

//Modules Routes
router.post('/modules', courseController.createModule);



module.exports = router;
>>>>>>> 05b0ccd7ad07914879dde31151260d9c80d24be5
