const express = require('express');
const router = express.Router({mergeParams : true});
const modulesController = require('../../controllers/modules/modulesController');
const {verifyToken, accessTo} = require('../../middleware/authMiddleware');

router.use(verifyToken);

//create module
router.post('/create', modulesController.createModule); //accessTo('instructor','admin') , 
router.put('/:moduleid/update', modulesController.updateModule); //accessTo('instructor','admin') , 
router.delete('/:moduleid/delete', modulesController.deleteModule); //accessTo('instructor','admin') , 
router.get('/:moduleid/view', modulesController.viewModule)

// GET all modules
router.get('/getAllModules', modulesController.getModulesByCourseId);


module.exports = router;
