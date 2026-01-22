// src/models/Activity.js

const mongoose = require('mongoose');

/**
 * ACTIVITY SCHEMA
 * 
 * This tracks user actions throughout the system.
 * Every time a user does something important, we create an Activity record.
 */
const activitySchema = new mongoose.Schema(
  {
    // WHO did the action?
    user: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to User model
      ref: 'User',                            // Link to User collection
      required: true
    },

    // Cache user info for faster queries (avoid always looking up user)
    userName: {
      type: String,
      required: true
    },

    userEmail: {
      type: String,
      required: true
    },

    // WHAT action was performed?
    action: {
      type: String,
      required: true,
      enum: [
        // User actions
        'viewed',
        'updated',
        'created',
        'deleted',
        'downloaded',
        
        // Task/Project actions
        'completed',
        'started',
        'submitted',
        'commented',
        
        // System actions
        'login',
        'logout',
        'profile_update',
        
        // Admin actions
        'user_created',
        'user_deleted',
        'role_changed',
        
        // Alerts
        'flagged',
        'reported'
      ]
    },

    // WHAT was affected?
    target: {
      type: String,           // e.g., "Q4 Report", "User Settings", "Bug #123"
      required: true
    },

    // Additional details (optional)
    description: {
      type: String,
      maxlength: 500
    },

    // Type of activity (for filtering/display)
    type: {
      type: String,
      enum: ['view', 'update', 'create', 'delete', 'download', 'complete', 'start', 'alert', 'event'],
      required: true
    },

    // For admin logs: what was the IP address?
    ipAddress: {
      type: String,
      default: null
    },

    // Metadata (flexible field for any extra data)
    metadata: {
      type: mongoose.Schema.Types.Mixed,  // Can store any structure
      default: {}
    }
  },
  {
    timestamps: true  // Automatically tracks when activity was created
  }
);

/**
 * INDEXES for faster queries
 * 
 * These make searching activities much faster.
 * Think of them like a book index - helps you find things quickly!
 */
// Find all activities by a specific user (fast)
activitySchema.index({ user: 1, createdAt: -1 });

// Find all activities of a specific type (fast)
activitySchema.index({ type: 1, createdAt: -1 });

// Find recent activities (fast)
activitySchema.index({ createdAt: -1 });

/**
 * STATIC METHOD: Create activity with user info
 * 
 * This is a helper function to make creating activities easier.
 * Usage: await Activity.createActivity(userId, 'viewed', 'Dashboard', ...)
 */
activitySchema.statics.createActivity = async function(userId, action, target, type, description = '', metadata = {}) {
  try {
    // Look up the user first
    const User = mongoose.model('User');
    const user = await User.findById(userId).select('name email');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Create the activity with user info
    const activity = await this.create({
      user: userId,
      userName: user.name,
      userEmail: user.email,
      action,
      target,
      type,
      description,
      metadata
    });

    return activity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

module.exports = mongoose.model('Activity', activitySchema);