// src/routes/activities.js

const express = require('express');
const router = express.Router();

const {
  getMyActivities,
  getAllActivities,
  getActivityStats
} = require('../controllers/activityController');

const { protect } = require('../middleware/authMiddleware');
const { checkManagerOrAdmin } = require('../middleware/roleMiddleware');

/**
 * ACTIVITY ROUTES
 * Base URL: /api/activities
 */

// @route   GET /api/activities/me
// @desc    Get current user's activities
// @access  Private
router.get('/me', protect, getMyActivities);

// @route   GET /api/activities/stats
// @desc    Get activity statistics
// @access  Manager or Admin
router.get('/stats', protect, checkManagerOrAdmin, getActivityStats);

// @route   GET /api/activities
// @desc    Get all activities (filtered)
// @access  Manager or Admin
router.get('/', protect, checkManagerOrAdmin, getAllActivities);

module.exports = router;