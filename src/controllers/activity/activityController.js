const activityDao = require('../../dao/activity/activityDao');

const activityController = {
  // Get all activity logs for a user
  getUserActivity: async (req, res) => {
    try {
      const userId = req.params.userId;
      const logs = await activityDao.getActivityByUser(userId);
      res.json({ success: true, data: logs });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // Delete all activity logs for a user
  deleteUserActivity: async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await activityDao.deleteActivityByUser(userId);
      res.json({ success: true, deletedCount: result.count, message: "Activity logs deleted" });
    } catch (err) {
      console.error("Error deleting activity logs:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

module.exports = activityController;