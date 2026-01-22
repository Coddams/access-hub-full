// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * PROTECT MIDDLEWARE
 * 
 * This runs BEFORE protected routes.
 * It checks if the user is logged in by verifying their token.
 * 
 * Flow:
 * 1. Check if token exists in request header
 * 2. Verify token is valid
 * 3. Find the user in database
 * 4. Attach user to request object
 * 5. Allow request to continue
 */
const protect = async (req, res, next) => {
  let token;

  try {
    // Check authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        const err = new Error('User not found');
        err.status = 401;
        throw err;
      }

      req.user = user;
      return next(); // ✅ Always call next
    }

    // No token provided
    const err = new Error('Not authorized, no token');
    err.status = 401;
    throw err;

  } catch (error) {
    // Pass the error to global error handler
    return next(error);
  }
};


/**
 * OPTIONAL AUTH MIDDLEWARE
 * 
 * Similar to protect, but doesn't fail if no token.
 * Useful for routes that work for both logged-in and guest users.
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token invalid, but that's okay - continue as guest
      req.user = null;
    }
  }

  next(); // Continue regardless of token status
};

module.exports = { protect, optionalAuth };