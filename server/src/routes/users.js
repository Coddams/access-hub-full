const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const { authorize, checkSelfOrAdmin } = require('../middleware/roleMiddleware');

router.get('/stats', protect, authorize('admin'), getUserStats);

router.get('/', protect, authorize('admin'), getAllUsers);

router.get('/:id', protect, checkSelfOrAdmin, getUser);

router.put('/:id', protect, checkSelfOrAdmin, updateUser);

router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;