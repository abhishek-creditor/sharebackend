const catalogDao = require('../../dao/catalog/catalogDao');
const { successResponse, errorResponse } = require('../../utils/apiResponse');
const messages = require('../../utils/messages');

async function getAllCatalogs(req, res) {
  try {
    const catalogs = await catalogDao.getAllCatalogs();
    res.json({ catalogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function getCoursesInCatalog(req, res) {
  try {
    const userId = req.user.id;           
    const catalogId = req.params.catalogId;
    const courses = await catalogDao.getCoursesByCatalogId(catalogId);
    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
async function checkAdminOrInstructor(req, res, next) {
  try {
    const userId = req.user.id;
    const userRole = await catalogDao.checkUserRole(userId);
    
    if (!userRole) {
      return errorResponse(req, res, 403, messages.UNAUTHORIZED);

    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Update catalog
async function updateCatalog(req, res) {
  try {
    const catalogId = req.params.catalogId;
    const { name, description, thumbnail, courseIds } = req.body;

    try {
      // If courseIds are provided, remove those courses first
      if (courseIds && Array.isArray(courseIds) && courseIds.length > 0) {
        await catalogDao.removeCoursesFromCatalog(catalogId, courseIds);
      }

      // Update catalog details
      const updatedCatalog = await catalogDao.updateCatalog(catalogId, {
        name,
        description,
        thumbnail
      });

      return successResponse(req, res, updatedCatalog, 200, messages.CATALOG_UPDATED_SUCCESSFULLY);
    } catch (error) {
      if (error.message.includes('DRAFT status')) {
        return errorResponse(req, res, 403, error.message);
      }
      throw error;
    }
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') {
      return errorResponse(req, res, 400, messages.CATALOG_NAME_ALREADY_EXISTS);
    }
    return errorResponse(req, res, 500, messages.SERVER_ERROR);
  }
}

// Delete catalog
async function deleteCatalog(req, res) {
  try {
    const catalogId = req.params.catalogId;

    try {
      await catalogDao.deleteCatalog(catalogId);
      return successResponse(req, res, null, 200, messages.CATALOG_DELETED_SUCCESSFULLY);
    } catch (error) {
      if (error.message.includes('DRAFT status')) {
        return errorResponse(req, res, 403, error.message);
      }
      throw error;
    }
  } catch (err) {
    console.error(err);
    return errorResponse(req, res, 500, messages.SERVER_ERROR);
  }
}

// Remove courses from catalog
async function removeCoursesFromCatalog(req, res) {
  try {
    const catalogId = req.params.catalogId;
    const { courseIds } = req.body;

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return errorResponse(req, res, 400, 'Course IDs array is required');
    }

    try {
      await catalogDao.removeCoursesFromCatalog(catalogId, courseIds);
      return successResponse(req, res, null, 200, 'Courses removed from catalog successfully');
    } catch (error) {
      if (error.message.includes('DRAFT status')) {
        return errorResponse(req, res, 403, error.message);
      }
      throw error;
    }
  } catch (err) {
    console.error(err);
    return errorResponse(req, res, 500, messages.SERVER_ERROR);
  }
}

module.exports = {
  getAllCatalogs,
  getCoursesInCatalog,
  checkAdminOrInstructor,
  updateCatalog,
  deleteCatalog,
  removeCoursesFromCatalog
};
