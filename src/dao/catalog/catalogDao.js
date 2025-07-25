const prisma = require('../../config/prismaClient');
const messages = require('../../utils/messages');

async function getAllCatalogs() {
  return await prisma.catalogs.findMany();
}

async function getCoursesByCatalogId(catalogId) {
  
  return await prisma.catalog_courses.findMany({
    where: { catalog_id: catalogId },
    select: {
      course: {
        select: {
          id: true,
          title: true,
        }
      }
    }
  });
}

async function checkUserAccess(userId, catalogId) {
  const access = await prisma.user_catalog_access.findFirst({
    where: {
      user_id: userId,
      catalog_id: catalogId,
      access_start_date: { lte: new Date() },
      access_end_date: { gte: new Date() }
    }
  });
  return access !== null;
}

// Check if user is admin or instructor
async function checkUserRole(userId) {
  const userRole = await prisma.user_roles.findFirst({
    where: {
      user_id: userId,
      role: {
        in: ['admin', 'instructor']
      }
    }
  });
  return userRole?.role;
}

// Returns true if all courses are either DRAFT or all are PUBLISHED
async function validateCatalogStatus(catalogId) {
  const catalogCourses = await prisma.catalog_courses.findMany({
    where: { catalog_id: catalogId },
    include: {
      course: {
        select: {
          course_status: true
        }
      }
    }
  });
  if (catalogCourses.length === 0) return true;
  return catalogCourses.every(cc => 
    cc.course.course_status === 'DRAFT' || 
    cc.course.course_status === 'PUBLISHED'
  );
}

// Update catalog
async function updateCatalog(catalogId, updateData) {
  const areValid = await validateCatalogStatus(catalogId);
  if (!areValid) {
    throw new Error(messages.UPDATE_COURSES_ERROR);
  }

  return await prisma.catalogs.update({
    where: { id: catalogId },
    data: {
      name: updateData.name,
      description: updateData.description,
      thumbnail: updateData.thumbnail,
      updated_at: new Date()
    }
  });
}

// Remove courses from catalog
async function removeCoursesFromCatalog(catalogId, courseIds) {
  const areValid = await validateCatalogStatus(catalogId);
  if (!areValid) {
    throw new Error(messages.REMOVE_COURSES_ERROR);
  }

  return await prisma.catalog_courses.deleteMany({
    where: {
      catalog_id: catalogId,
      course_id: {
        in: courseIds
      }
    }
  });
}

// Delete catalog
async function deleteCatalog(catalogId) {
  const areValid = await validateCatalogStatus(catalogId);
  if (!areValid) {
    throw new Error(messages.DELETE_COURSES_ERROR);
  }

  return await prisma.catalogs.delete({
    where: { id: catalogId }
  });
}

module.exports = {
  getAllCatalogs,
  getCoursesByCatalogId,
  checkUserAccess,
  checkUserRole,
  updateCatalog,
  removeCoursesFromCatalog,
  deleteCatalog
};
