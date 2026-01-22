// src/controllers/userController.js

const User = require('../models/User');
const Activity = require('../models/Activity');

/**
 * GET ALL USERS
 * 
 * GET /api/users
 * Query params: ?role=admin&status=active&search=john
 * Access: Admin only
 */
const getAllUsers = async (req, res) => {
  try {
    // Build query based on filters
    const { role, status, department, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (department) query.department = department;
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * GET SINGLE USER
 * 
 * GET /api/users/:id
 * Access: Admin or self
 */
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * UPDATE USER
 * 
 * PUT /api/users/:id
 * Body: { name?, email?, department?, status? }
 * Access: Admin or self (self can't change role/status)
 */
const updateUser = async (req, res) => {
  try {
    const { name, email, department, status, role } = req.body;
    const userId = req.params.id;
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is updating themselves or is admin
    const isSelf = req.user._id.toString() === userId;
    const isAdmin = req.user.role === 'admin';

    // Users can update their own name, email, department
    // Only admins can change role and status
    if (name) user.name = name;
    if (email) user.email = email;
    if (department) user.department = department;
    
    if (isAdmin) {
      if (status) user.status = status;
      if (role) user.role = role;
    } else if (status || role) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can change user role or status'
      });
    }

    await user.save();

    // Log activity
    await Activity.createActivity(
      req.user._id,
      'updated',
      `User: ${user.name}`,
      'update',
      `User profile updated ${isSelf ? '(self)' : '(by admin)'}`
    );

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

/**
 * DELETE USER
 * 
 * DELETE /api/users/:id
 * Access: Admin only
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    await user.deleteOne();

    // Log activity
    await Activity.createActivity(
      req.user._id,
      'user_deleted',
      `User: ${user.name}`,
      'delete',
      'User account deleted by admin'
    );

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

/**
 * GET USER STATS (for admin dashboard)
 * 
 * GET /api/users/stats
 * Access: Admin only
 */
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const usersByDepartment = await User.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        pending: pendingUsers,
        byRole: usersByRole,
        byDepartment: usersByDepartment
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats
};