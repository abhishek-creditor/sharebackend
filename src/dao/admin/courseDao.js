const { PrismaClient } = require('@prisma/client');
const { $transaction, course_instructors } = require('../../config/prismaClient');
const prisma = new PrismaClient();
const message = require('../../utils/messages');
const messages = require('../../utils/messages');


const userExist = async (userId) => {
    try{
      return await prisma.users.findUnique({
        where: {id: userId}
      })
    }
    catch(err){
      throw new Error(messages.USER_NOT_FOUND)
    }
}

const createCourse = async (data) => {
  try{
    const {userId, ...courseData} = data;
    const userExists = await prisma.users.findUnique({ where: { id: userId } });
    if (!userExists) throw new Error('User not found');
    
    const result = await prisma.$transaction(async (prisma) => {
      
      const course = await prisma.courses.create({
        data: {
          ...courseData,
          created_at: new Date(),
          updated_at: new Date(),
          createdBy: userId,
          updatedBy: userId
        }
      })


      await prisma.course_instructors.create({
        data: {
          user_id: userId,
          course_id: course.id,
          isPrimary: true
        }
      })
      return course
    });

    return result;
    
  }
  catch(error){
    console.error('Error creating course or instructor relationship:', error);
    throw new Error('Failed to create course due to an internal error');
  }
}


const editCourse = async (courseId, data) => {
  try{
    const courseExist = await prisma.courses.findUnique({
      where: {id: courseId}
    });
    if(!courseExist) throw new Error(messages.ERROR_EDITING_COURSE);

    const updatedData = {
      ...data,
      updated_at: new Date(),
      updatedBy: data.updatedBy
    };

    const result = await prisma.courses.update({
      where: {id: courseId},
      data: updatedData
    });

    return result;
  }
  catch(error) {
    console.error('Error editing course:', error);
    throw new Error(messages.ERROR_EDITING_COURSE);
  }
}


const grantUserCourseAccess = async (accessData) => {
  try{
    const {course_id, learnerIds} = accessData;

  const learnersArray = Array.isArray(learnerIds) ? learnerIds : [learnerIds];

  const data = learnersArray.map((learnerId) => ({
    user_id: learnerId,
    course_id,
    subscription_start: new Date(),
    status: 'ACTIVE'
  }));

  const result = await prisma.user_course_access.createMany({
    data,
    skipDuplicates: true
  })

  return result
  }
  catch(error) {
    throw new Error(messages.ERROR_ON_ADDING_LEARNER)
  }
};


const addInstructorsToCourse = async (courseId, instructorIds) => {
  try {
    const courseExists = await prisma.courses.findUnique({ where: { id: courseId } });
    if (!courseExists) throw new Error(messages.ERROR_ON_ADDING_INSTRUCTOR);

    const instructorArr = Array.isArray(instructorIds) ? instructorIds : [instructorIds];

    const existingAdmin = await prisma.course_instructors.findMany({
      where: { course_id: courseId },
      select: { user_id: true },
    });
    const existingLearners = await prisma.user_course_access.findMany({
      where: { course_id: courseId, status: 'ACTIVE' },
      select: { user_id: true },
    });

    const adminIds = new Set(existingAdmin.map((i) => i.user_id));
    const learnersId = new Set(existingLearners.map((i) => i.user_id))
    const ineligibleIds = new Set([...adminIds, ...learnersId])

    const elibileInstructorIds = instructorArr.filter((ids) => !ineligibleIds.has(ids));

    if (elibileInstructorIds.length === 0) {
      throw new Error('All provided users are already admin or learners');
    };


    const data = elibileInstructorIds.map((id) => ({
      user_id: id,
      course_id: courseId,
      isPrimary: false,
    }));

    const result = await prisma.course_instructors.createMany({
      data,
      skipDuplicates: true, 
    });

    return result;
  } catch (error) {
    console.error('Error adding instructors:', error);
    throw new Error(messages.ERROR_ON_ADDING_INSTRUCTOR);
  }
};



const addAdminToCourse = async (courseId, adminIds) => {
  try {
    const courseExists = await prisma.courses.findUnique({ where: { id: courseId } });
    if (!courseExists) throw new Error(messages.ERROR_ON_ADDING_ADMIN);

    const adminArr = Array.isArray(adminIds) ? adminIds : [adminIds];

    const existingInstructors = await prisma.course_instructors.findMany({
      where: { course_id: courseId },
      select: { user_id: true },
    });
    const existingLearners = await prisma.user_course_access.findMany({
      where: { course_id: courseId, status: 'ACTIVE' },
      select: { user_id: true },
    });

    const instructorIds = new Set(existingInstructors.map(i => i.user_id));
    const learnerIds = new Set(existingLearners.map(l => l.user_id));
    const ineligibleIds = new Set([...instructorIds, ...learnerIds]);

    const eligibleAdminIds = adminArr.filter(id => !ineligibleIds.has(id));

    if (eligibleAdminIds.length === 0) {
      throw new Error('All provided users are already instructors or learners');
    }

    const data = eligibleAdminIds.map((id) => ({
      user_id: id,
      course_id: courseId,
    }));

    const result = await prisma.course_admins.createMany({
      data,
      skipDuplicates: true,
    });

    return result;
  } catch (error) {
    console.error('Error adding admin:', error);
    throw new Error(messages.ERROR_ON_ADDING_ADMIN);
  }
};



const getUserCourses = async (userId) => {
    try{
      const userCourses = await prisma.courses.findMany({
        where: {
          user_course_access: {
            some: {
              user_id: userId,
              status: 'ACTIVE',
            }
          },
        },
        // include: {
        //   user_course_access: true,
        // },
      });
    
      console.log(`User courses - ${userCourses}`)
      return userCourses;
    }
    catch(err){
      console.log(`Error fetching courses : ${err.message}`);
      throw new Error(messages.ERROR_FETCHING_COURSES)
    }
};

const getCourseById = async (id) => {
  return await prisma.courses.findUnique({
    where: { id },
  });
};

const createModule = async (data) => {
    return await prisma.modules.create({
      data,
    });
  };
  

module.exports = {
  createCourse,
  editCourse,
  grantUserCourseAccess,
  addInstructorsToCourse,
  addAdminToCourse,
  userExist,
  getUserCourses,
  getCourseById,
  createModule
};
