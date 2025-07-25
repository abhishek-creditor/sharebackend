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
