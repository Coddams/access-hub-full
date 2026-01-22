// src/middleware/roleMiddleware.js

/**
 * AUTHORIZE MIDDLEWARE
 * 
 * Checks if the logged-in user has the required role.
 * Use AFTER protect middleware (user must be logged in first!)
 * 
 * Usage:
 *   router.get('/admin-only', protect, authorize('admin'), controller)
 *   router.get('/managers-and-admins', protect, authorize('manager', 'admin'), controller)
 * 
 * @param {...string} roles - Allowed roles (can pass multiple)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (should be added by protect middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    // User has correct role, continue!
    next();
  };
};

/**
 * CHECK SELF OR ADMIN
 * 
 * Allows users to access their own data, or admins to access anyone's data.
 * Useful for routes like "update profile" or "view profile"
 * 
 * Usage:
 *   router.put('/users/:id', protect, checkSelfOrAdmin, updateUser)
 */
const checkSelfOrAdmin = (req, res, next) => {
  const requestedUserId = req.params.id;
  const currentUserId = req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  // Allow if user is admin OR accessing their own data
  if (isAdmin || requestedUserId === currentUserId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'You can only access your own data'
  });
};

/**
 * CHECK MANAGER OR ADMIN
 * 
 * Ensures user is at least a manager.
 * Useful for team management features.
 */
const checkManagerOrAdmin = (req, res, next) => {
  const allowedRoles = ['manager', 'admin'];
  
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to managers and administrators'
    });
  }

  next();
};

module.exports = {
  authorize,
  checkSelfOrAdmin,
  checkManagerOrAdmin
};