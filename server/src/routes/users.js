// src/routes/users.js

const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

// Middleware
const { protect } = require('../middleware/authMiddleware');
const { authorize, checkSelfOrAdmin } = require('../middleware/roleMiddleware');

/**
 * USER MANAGEMENT ROUTES
 * 
 * Base URL: /api/users
 * All routes require authentication (protect middleware)
 */

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Admin only
router.get('/stats', protect, authorize('admin'), getUserStats);

// @route   GET /api/users
// @desc    Get all users (with filters)
// @access  Admin only
router.get('/', protect, authorize('admin'), getAllUsers);

// @route   GET /api/users/:id
// @desc    Get single user by ID
// @access  Admin or self
router.get('/:id', protect, checkSelfOrAdmin, getUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Admin or self (self can't change role/status)
router.put('/:id', protect, checkSelfOrAdmin, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Admin only
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;