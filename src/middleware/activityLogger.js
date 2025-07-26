const jwt = require('jsonwebtoken');
const activityDao = require('../dao/activity/activityDao');
const JWT_SECRET = process.env.JWT_SECRET; // Make sure this is set

const activityMap = {
  'POST /api/auth/login': 'USER_LOGIN',
  'GET /api/auth/logout': 'USER_LOGOUT',
  // Add more as needed
};

async function activityLogger(req, res, next) {
  let userId;

  // Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id; // Adjust if your payload uses a different field
    } catch (err) {
      // Invalid token, userId remains undefined
    }
  }

  const key = `${req.method} ${req.baseUrl}${req.path}`;
  const action = activityMap[key];

  if (userId && action) {
    try {
      await activityDao.logActivity({
        userId,
        action,
        targetId: userId,
      });
      // Optionally log to console for debugging
      // console.log("Activity logged:", userId, action);
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  }
  next();
}

module.exports = activityLogger;