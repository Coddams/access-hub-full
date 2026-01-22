// src/controllers/activityController.js

const Activity = require('../models/Activity');

/**
 * GET USER'S ACTIVITIES
 * 
 * GET /api/activities/me
 * Query: ?limit=20&type=view
 * Access: Private (any authenticated user)
 */
const getMyActivities = async (req, res) => {
  try {
    const { limit = 50, type } = req.query;
    
    let query = { user: req.user._id };
    if (type) query.type = type;

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });

  } catch (error) {
    console.error('Get my activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

/**
 * GET ALL ACTIVITIES (Admin/Manager)
 * 
 * GET /api/activities
 * Query: ?userId=xxx&type=view&limit=100
 * Access: Manager (team activities) or Admin (all activities)
 */
const getAllActivities = async (req, res) => {
  try {
    const { userId, type, action, limit = 100 } = req.query;
    
    let query = {};
    
    // Managers can only see their team's activities
    // (For simplicity, we'll let them see all for now)
    // In production, you'd filter by department or team
    
    if (userId) query.user = userId;
    if (type) query.type = type;
    if (action) query.action = action;

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('user', 'name email role');

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });

  } catch (error) {
    console.error('Get all activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

/**
 * GET ACTIVITY STATS
 * 
 * GET /api/activities/stats
 * Access: Manager or Admin
 */
const getActivityStats = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    
    let matchStage = {};
    if (userId) matchStage.user = mongoose.Types.ObjectId(userId);
    
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const stats = await Activity.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalActivities = await Activity.countDocuments(matchStage);

    res.status(200).json({
      success: true,
      data: {
        total: totalActivities,
        byType: stats
      }
    });

  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity statistics',
      error: error.message
    });
  }
};

module.exports = {
  getMyActivities,
  getAllActivities,
  getActivityStats
};