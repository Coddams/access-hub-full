// src/controllers/authController.js

const User = require('../models/User');
const Activity = require('../models/Activity');
const { generateToken } = require('../utils/generateToken');

/**
 * REGISTER NEW USER
 * 
 * POST /api/auth/register
 * Body: { name, email, password, department? }
 * Access: Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, department } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,  // Will be hashed automatically by User model
      department: department || 'Engineering',
      role: 'user'  // New users start as regular users
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    // Log activity
    await Activity.createActivity(
      user._id,
      'user_created',
      'Account',
      'create',
      'New user registration'
    );

    // Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          status: user.status,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    next(error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

/**
 * LOGIN USER
 * 
 * POST /api/auth/login
 * Body: { email, password }
 * Access: Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    // Log activity
    await Activity.createActivity(
      user._id,
      'login',
      'System',
      'event',
      'User logged in'
    );

    // Send response (without password)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          status: user.status,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    next(error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

/**
 * GET CURRENT USER
 * 
 * GET /api/auth/me
 * Access: Private (requires token)
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          status: user.status,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

/**
 * LOGOUT USER
 * 
 * POST /api/auth/logout
 * Access: Private
 * 
 * Note: With JWT, logout is mainly handled client-side by removing the token.
 * This endpoint logs the activity for audit purposes.
 */
const logout = async (req, res) => {
  try {
    // Log activity
    await Activity.createActivity(
      req.user._id,
      'logout',
      'System',
      'event',
      'User logged out'
    );

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    next(error);
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout
};