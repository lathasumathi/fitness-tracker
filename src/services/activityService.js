const ActivityLog = require('../models/ActivityLog');

const logActivity = async ({ user, action, resourceType, resourceId, metadata = {} }) => {
  try {
    await ActivityLog.create({ user: user?._id, action, resourceType, resourceId, metadata });
  } catch (error) {
    console.error('Activity log error:', error.message);
  }
};

const activitySummary = async () => ActivityLog.aggregate([
  { $group: { _id: '$action', count: { $sum: 1 } } },
  { $project: { _id: 0, action: '$_id', count: 1 } },
  { $sort: { count: -1 } },
]);

module.exports = { logActivity, activitySummary };