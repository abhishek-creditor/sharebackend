const prisma = require('../../config/prismaClient');
const messages = require('../../utils/messages');


async function getAllCatalogs() {
  return await prisma.catalogs.findMany();
}


async function getCoursesInCatalog(catalogId) {
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


async function createCatalog(data) {
  return await prisma.catalogs.create({
    data,
  });
}


async function addCoursesToCatalog(catalogId, courseIds) {
  const results = []; 
  for (const Scourse_id of courseIds) {
    try {
      const existing = await prisma.catalog_courses.findFirst({
        where: {
          catalog_id: catalogId,
          course_id: Scourse_id,
        },
      });

      if (!existing) {
        const result = await prisma.catalog_courses.create({
          data: {
            catalog_id: catalogId,
            course_id: Scourse_id,
          },
        });
        results.push(result);
      }
    } catch (err) {
      console.error(`Error while adding course ${Scourse_id} to catalog ${catalogId}:`, err.message);
      throw err;
    }
  }
  return results;
}

async function updateCatalog(catalogId, updateData) {
  return await prisma.catalogs.update({
    where: { id: catalogId },
    data: {
      name: updateData.name,
      description: updateData.description,
      updated_at: new Date()
    }
  });
}


async function removeCoursesFromCatalog(catalogId, courseIds) {
  return await prisma.catalog_courses.deleteMany({
    where: {
      catalog_id: catalogId,
      course_id: {
        in: courseIds
      }
    }
  });
}



async function deleteCatalog(catalogId) {
  return await prisma.catalogs.delete({
    where: { id: catalogId }
  });
}

module.exports = {
  getAllCatalogs,
  getCoursesInCatalog,
  createCatalog,
  addCoursesToCatalog,
  updateCatalog,
  removeCoursesFromCatalog,
  deleteCatalog
};
