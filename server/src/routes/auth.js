// src/routes/auth.js

const express = require('express');
const router = express.Router();

// Import controllers
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/authController');

// Import middleware
const { protect } = require('../middleware/authMiddleware');

/**
 * AUTHENTICATION ROUTES
 * 
 * Base URL: /api/auth
 * 
 * All routes here handle user authentication:
 * - Registration (creating new account)
 * - Login (getting access token)
 * - Getting current user info
 * - Logout (for activity logging)
 */

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private (requires token)
router.get('/me', protect, getMe);

// @route   POST /api/auth/logout
// @desc    Logout user (logs activity)
// @access  Private
router.post('/logout', protect, logout);

module.exports = router;