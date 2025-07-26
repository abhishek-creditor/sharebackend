const { string } = require('joi');
const courseDAO = require('../../dao/admin/courseDao');
const { successResponse, errorResponse } = require('../../utils/apiResponse');
const messages = require('../../utils/messages');
const { createCourseSchema } = require('../../validator/courseValidate');
const redisClient = require('../../config/redis')



module.exports.createCourseController = async (req, res) => {
    try {

    const { error, value } = createCourseSchema.validate(req.body);
      if (error) {
        return errorResponse(req, res, 400, error.details[0].message);
    }
    
      const {
        title,
        description,
        learning_objectives,
        isHidden,
        category,
        course_status,
        estimated_duration,
        max_students,
        course_level,
        courseType,
        lockModules,
        price,
        requireFinalQuiz,
        thumbnail,
        created_at,
        updated_at,
        deleted_at,
      } = value; 

  
      const userId = req.user.id; 

      if(req.file) {
        thumbnail = req.file.path;
      }

     
      const courseData = {
        title,
        description,
        learning_objectives,
        isHidden,
        course_status,
        estimated_duration,
        max_students,
        course_level,
        courseType,
        lockModules,
        price,
        requireFinalQuiz,
        thumbnail,
        created_at,
        updated_at,
        deleted_at,
        createdBy: userId,
        updatedBy: userId,
      };
  
      const course = await courseDAO.createCourseController({userId, ...courseData}); 
  
      return successResponse(req, res, course, 201, messages.COURSE_CREATED_SUCCESSFULLY);
    } catch (error) {
      console.error('Error creating course:', error);
      const message =
        process.env.NODE_ENV === 'development'
          ? error.message
          : messages.SERVER_ERROR;
      return errorResponse(req, res, 500, message);
    }
};


module.exports.editCourseController = async (req, res) => {
   try{
    const {courseId} = req.params;

    const {
      title,
      description,
      learning_objectives,
      isHidden,
      category,
      course_status,
      estimated_duration,
      max_students,
      course_level,
      courseType,
      lockModules,
      price,
      requireFinalQuiz,
      thumbnail,
      created_at,
      updated_at,
    } = req.body;

    if(!courseId || typeof courseId!== 'string') {
      return errorResponse(req, res, 400, messages.COURSE_NOT_FOUND);
    }

    const updatedData = {};

    if (title !== undefined) updatedData.title = title;
    if (description !== undefined) updatedData.description = description;
    if (learning_objectives !== undefined) updatedData.learning_objectives = learning_objectives;
    if (isHidden !== undefined) updatedData.isHidden = isHidden;
    if (category !== undefined) updatedData.category = category;
    if (course_status !== undefined) updatedData.course_status = course_status;
    if (estimated_duration !== undefined) updatedData.estimated_duration = estimated_duration;
    if (max_students !== undefined) updatedData.max_students = max_students;
    if (course_level !== undefined) updatedData.course_level = course_level;
    if (courseType !== undefined) updatedData.courseType = courseType;
    if (lockModules !== undefined) updatedData.lockModules = lockModules;
    if (price !== undefined) updatedData.price = price;
    if (requireFinalQuiz !== undefined) updatedData.requireFinalQuiz = requireFinalQuiz;
    if (thumbnail !== undefined) updatedData.thumbnail = thumbnail;
    if (created_at !== undefined) updatedData.created_at = created_at;
    if (updated_at !== undefined) updatedData.updated_at = updated_at;

    updatedData.updatedBy = req.user.id;

    if(req.file) {
      updatedData.thumbnail = req.file.path;
    }

    if (Object.keys(updatedData).length === 1 && updatedData.updatedBy) {
      return errorResponse(req, res, 400, 'At least one field is required to update');
    }

    const course = await courseDAO.editCourse(courseId, updatedData);

    return successResponse(req, res, course, 200, messages.COURSE_UPDATED_SUCCESSFULLY)
   }
   catch(error) {
    console.error('Error creating course:', error);
    const message =
      process.env.NODE_ENV === 'development'
        ? error.message
        : messages.SERVER_ERROR;
    return errorResponse(req, res, 500, message);
   }
}



module.exports.addInstructorController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { instructorIds } = req.body;

    if (!courseId || typeof courseId !== 'string') {
      return errorResponse(req, res, 400, 'Valid courseId is required');
    }
    if (!instructorIds || (typeof instructorIds !== 'string' && !Array.isArray(instructorIds))) {
      return errorResponse(req, res, 400, 'instructorIds must be a string or array');
    }

    const result = await courseDAO.addInstructorsToCourse(courseId, instructorIds);

    const instructorCount = result.count;
    return successResponse(req, res, { count: instructorCount }, 201, messages.INSTRUCTOR_ADDED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error adding instructors:', error);
    const message =
      process.env.NODE_ENV === 'development'
        ? error.message
        : messages.SERVER_ERROR;
    return errorResponse(req, res, 500, message);
  }
};


module.exports.addLearnerToCourse = async (req,res) => {
  try{
    const { course_id, learnerIds } = req.body;
    
    if (!course_id || typeof course_id !== 'string') {
      return res.status(400).json({ error: 'Valid courseId is required' });
    }
    if (!learnerIds || (typeof learnerIds !== 'string' && !Array.isArray(learnerIds))) {
      return res.status(400).json({ error: 'learnerIds must be a string or array' });
    }

    const result = await courseDAO.grantUserCourseAccess({course_id, learnerIds});

    const learnerCount = result.count;
    console.log(`Added ${learnerCount} learners to the course`)
    return successResponse(req, res, result, 201, messages.LEARNER_ADDED_SUCCESSFULLY);

  }
  catch(error){
    console.error('Error creating course:', error);
      const message =
        process.env.NODE_ENV === 'development'
          ? error.message
          : messages.SERVER_ERROR;
      return errorResponse(req, res, 500, message);
  }
}



module.exports.addAdminController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { adminIds } = req.body;

    if (!courseId || typeof courseId !== 'string') {
      return errorResponse(req, res, 400, 'Valid courseId is required');
    }
    if (!adminIds || (typeof adminIds !== 'string' && !Array.isArray(adminIds))) {
      return errorResponse(req, res, 400, 'admin must be a string or array');
    }

    const result = await courseDAO.addAdminToCourse(courseId, adminIds);

    const AdminCount = result.count;
    return successResponse(req, res, { count: AdminCount }, 201, messages.ADMIN_ADDED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error adding admin:', error);
    const message =
      process.env.NODE_ENV === 'development'
        ? error.message
        : messages.SERVER_ERROR;
    return errorResponse(req, res, 500, message);
  }
};


// module.exports.getUserCoursesController = async(req,res) => {
//   try{
//     const userId = req.user.id;

//     if(!userId || typeof userId !== 'string') {
//       return errorResponse(req, res, 400, messages.VALID_USER_ID_REQUIRED);
//     }

//     const checkUser = await courseDAO.userExist(userId)
//     if(!checkUser) return errorResponse(req, res, 404, messages.USER_NOT_FOUND);

//     const courses = await courseDAO.getUserCourses(userId)

//     return successResponse(req, res, courses, 200, messages.COURSES_FETCHED_SUCCESSFULLY)
//   }  
//   catch(error){
//     console.error('Error adding admin:', error);
//     const message =
//       process.env.NODE_ENV === 'development'
//         ? error.message
//         : messages.SERVER_ERROR;
//     return errorResponse(req, res, 500, message);
//   }
// }


module.exports.getUserCoursesController = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `user-courses:${userId}`;

    // Log Redis connection status
    console.log('Redis status:', await redisClient.ping());

    // Check Redis cache
    const redisData = await redisClient.get(cacheKey);
    console.log(`Redis data for ${cacheKey}:`, redisData);

    if (redisData) {
      const courses = JSON.parse(redisData);
      console.log('Parsed courses from Redis:', courses);
      if (Array.isArray(courses) && courses.length > 0) {
        console.log('Cache hit for user:', userId);
        return successResponse(req, res, courses, 200, messages.COURSES_FETCHED_SUCCESSFULLY);
      } else {
        console.log('Cached data invalid or empty:', courses);
      }
    } else {
      console.log('Cache miss for user:', userId);
    }

    if (!userId || typeof userId !== 'string') {
      return errorResponse(req, res, 400, messages.VALID_USER_ID_REQUIRED);
    }

    // Use courseDAO for user existence and course fetching
    const checkUser = await courseDAO.userExist(userId);
    if (!checkUser) return errorResponse(req, res, 404, messages.USER_NOT_FOUND);

    const courses = await courseDAO.getUserCourses(userId);
    console.log('Courses fetched from DB via courseDAO:', courses);

    if (courses.length > 0) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(courses)); // 1-hour TTL
      console.log(`Cache stored for ${cacheKey}`);
    } else {
      console.log('No courses to cache for user:', userId);
    }

    return successResponse(req, res, courses, 200, messages.COURSES_FETCHED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error in getUserCoursesController:', error);
    const message =
      process.env.NODE_ENV === 'development'
        ? error.message
        : messages.SERVER_ERROR;
    return errorResponse(req, res, 500, message);
  }
}


module.exports.getAllCourses = async (req, res) => {
  try {
    const courses = await courseDAO.getCourses();
    return successResponse(req, res, courses, 200, messages.COURSES_FETCHED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return errorResponse(req, res, 500, messages.SERVER_ERROR);
  }
};


module.exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.query;
    const course = await courseDAO.getCourseById(id);

    if (!course || course.deleted_at) {
      return errorResponse(req, res, 404, messages.COURSE_NOT_FOUND);
    }

    return successResponse(req, res, course, 200, messages.COURSE_FETCHED_SUCCESSFULLY);
  } catch (error) {
    console.error('Error fetching course:', error);
    return errorResponse(req, res, 500, messages.SERVER_ERROR);
  }
};



module.exports.createModule = async (req, res) => {
    try {
      const {
        course_id,
        title,
        description,
        order,
        estimated_duration,
        module_status = 'DRAFT',
        thumbnail,
      } = req.body;
  
      // Basic manual validation (you can also use Joi or Zod)
      if (!course_id || !title || typeof order !== 'number') {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newModule = await createModule({
        course_id,
        title,
        description,
        order,
        estimated_duration,
        module_status,
        thumbnail,
      });
  
      return res.status(201).json(newModule);
    } catch (error) {
      console.error('Error creating module:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


  