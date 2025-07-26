const modulesDao = require('../../dao/modules/modulesDao');
const messages = require('../../utils/messages');
const { successResponse, errorResponse } = require('../../utils/apiResponse');
const { moduleSchema } = require('../../validator/moduleValidate');


const createModule = async(req, res)=>{
    try{
    let { error , value } = moduleSchema.validate(req.body);
    if (error) return errorResponse(req, res, 400, error.details[0].message);

    const { title, description, order, estimated_duration, module_status, thumbnail } = value;
    let courseid  = req.params.courseid;
    let userid = req.user.id;
    
    let createdmodule = await modulesDao.createmodule(courseid, title, description, order, estimated_duration, module_status, thumbnail, userid);
    return successResponse(req, res, createdmodule, 200, messages.MODULE_CREATED);
    }
     catch(err){
        console.log("error in creating module ", err);
        return errorResponse(req, res, 500, messages.SERVER_ERROR);
    }
}


const updateModule = async(req, res)=>{
  try{
    let { error , value } = moduleSchema.validate(req.body);
    if (error) return errorResponse(req, res, 400, error.details[0].message);
    let {title, description, order, estimated_duration, module_status, thumbnail } = value;

    let moduleid = req.params.moduleid;
    let userid = req.user.id;
    let updatedModule = await modulesDao.editModule(moduleid , title, description, order, estimated_duration, module_status, thumbnail, userid );
    return successResponse(req, res, updatedModule, 200, messages.UPDATED_MODULE  )
  }catch(err){
     console.log("error in updating module ", err);
     return errorResponse(req, res, 500, messages.SERVER_ERROR);
  }
}

const deleteModule = async(req, res)=>{
  try{
     let moduleid = req.params.moduleid;
     let deletedmodule = modulesDao.deleteModule(moduleid);
     return successResponse(req, res, deletedmodule , 200, messages.MODULE_DELETED);
  }catch(err){
    console.log("error in deleting module ", err);
     return errorResponse(req, res, 500, messages.SERVER_ERROR);
  }
}

const viewModule = async(req, res)=>{
  try{
     let moduleid = req.params.moduleid;
     let moduleData = await modulesDao.fetchmodule(moduleid);
     return successResponse(req, res , moduleData, 200, messages.MODULE_DATA );
  }catch(error){
    console.log("error in fetching module", err);
    return errorResponse(req, res, 500, messages.SERVER_ERROR);
  }
}

const getModulesByCourseId = async (req, res) => {
  try {
    const { courseid } = req.params;

    if (!courseid) {
      return errorResponse(req, res, 400, messages.COURSE_ID_REQUIRED);
    }
    const modules = await modulesDao.fetchModulesByCourseId(courseid);
    return successResponse(req, res, modules, 200, messages.FETCH_ALL_MODULES_SUCCESS);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return errorResponse(req, res, 500, messages.SERVER_ERROR);
  }
};


module.exports = {
  getModulesByCourseId, createModule, updateModule, deleteModule, viewModule
};
