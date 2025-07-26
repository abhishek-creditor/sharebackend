const prisma = require('../../config/prismaClient');

const createmodule = async(courseid, title, description, order, estimated_duration, module_status, thumbnail, userid)=>{
    return await prisma.modules.create({
        data : {
          course_id : courseid,  
          title : title,
          description : description,
          order : order,
          estimated_duration : estimated_duration,
          module_status : module_status,
          thumbnail : thumbnail,
          createdBy : userid,
          updatedBy : userid
        }
    })
}

const editModule = async(moduleid , title, description, order, estimated_duration, module_status, thumbnail, userid )=>{
 return await prisma.modules.update({
        where : {
           id : moduleid
        },
        data : {
          title : title,
          description : description,
          order : order,
          estimated_duration : estimated_duration,
          module_status : module_status,
          thumbnail : thumbnail,
          updatedBy : userid
        }
 })
}


const deleteModule = async(moduleid)=>{
     return await prisma.modules.delete({
      where : {
        id : moduleid
       }
    })
}


const fetchmodule  = async(moduleid)=>{
  return await prisma.modules.findUnique({
    where : {
      id : moduleid
    }
  })
}

const fetchModulesByCourseId = async (courseid) => {
  return await prisma.modules.findMany({
    where: { course_id: courseid },
    orderBy: { order: 'asc' },
  });
};


module.exports = {
  fetchModulesByCourseId, createmodule, editModule , deleteModule, fetchmodule
};
