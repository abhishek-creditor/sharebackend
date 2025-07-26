<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { verifyToken ,accessTo} = require('../../middleware/authMiddleware');
const catalogController = require('../../controllers/catalog/catalogController');


router.use(verifyToken);

router.get('/getallcatalogs', catalogController.getAllCatalogs);
router.get('/:catalogId/courses', catalogController.getCoursesInCatalog);
router.post('/createCatalog',accessTo('admin','instructor'), catalogController.createCatalog);
router.post('/:catalogId/addcourses',accessTo('admin','instructor'), catalogController.addCoursesToCatalog);
router.delete('/:catalogId/Deletecatalog',accessTo('admin','instructor'), catalogController.deleteCatalog);
router.delete('/:catalogId/courses', accessTo('admin','instructor'), catalogController.removeCoursesFromCatalog);
router.put('/:catalogId/updatecatalog', accessTo('admin','instructor'), catalogController.updateCatalog);


module.exports = router;
=======
const express = require('express');
const router = express.Router();
const { verifyToken ,accessTo} = require('../../middleware/authMiddleware');
const catalogController = require('../../controllers/catalog/catalogController');


// Apply auth middleware to all routes
router.use(verifyToken);

router.get('/', catalogController.getAllCatalogs);
router.get('/:catalogId/courses', catalogController.getCoursesInCatalog);

//admin and instructor protected routes.



router.delete('/:catalogId/courses', accessTo('admin'), catalogController.removeCoursesFromCatalog);
router.put('/:catalogId', accessTo('admin','instructor'), catalogController.updateCatalog);
router.delete('/:catalogId', accessTo('admin'), catalogController.deleteCatalog);


module.exports = router;
>>>>>>> 05b0ccd7ad07914879dde31151260d9c80d24be5
