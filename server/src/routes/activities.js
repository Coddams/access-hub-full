const express = require('express');
const router = express.Router();

const {
  getMyActivities,
  getAllActivities,
  getActivityStats
} = require('../controllers/activityController');

const { protect } = require('../middleware/authMiddleware');
const { checkManagerOrAdmin } = require('../middleware/roleMiddleware');

router.get('/me', protect, getMyActivities);

router.get('/stats', protect, checkManagerOrAdmin, getActivityStats);

router.get('/', protect, checkManagerOrAdmin, getAllActivities);

module.exports = router;