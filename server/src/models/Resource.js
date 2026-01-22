// src/models/Resource.js

const mongoose = require('mongoose');

/**
 * RESOURCE SCHEMA
 * 
 * Represents documents, files, and materials that users can access.
 * These are the items shown in your "Resources" page.
 */
const resourceSchema = new mongoose.Schema(
  {
    // BASIC INFORMATION
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters']
    },

    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },

    // FILE INFORMATION
    type: {
      type: String,
      enum: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'image', 'video', 'other'],
      required: true,
      default: 'other'
    },

    category: {
      type: String,
      enum: [
        'Documentation',
        'Planning',
        'Design',
        'HR',
        'Training',
        'Media',
        'Finance',
        'Legal',
        'Other'
      ],
      required: true
    },

    size: {
      type: String,           // e.g., "2.4 MB", "890 KB"
      required: true
    },

    // FILE STORAGE
    url: {
      type: String,           // URL where file is stored (S3, Cloudinary, etc.)
      required: true
    },

    fileName: {
      type: String,           // Original file name
      required: true
    },

    // ACCESS CONTROL
    accessLevel: {
      type: String,
      enum: ['public', 'user', 'manager', 'admin'],  // Who can access this?
      default: 'user'
    },

    // Specific users who have access (optional, for fine-grained control)
    allowedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],

    // TRACKING
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    views: {
      type: Number,
      default: 0
    },

    downloads: {
      type: Number,
      default: 0
    },

    // STATUS
    status: {
      type: String,
      enum: ['active', 'archived', 'deleted'],
      default: 'active'
    },

    // VERSIONING
    version: {
      type: String,
      default: '1.0'
    },

    // TAGS for easier searching
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }]
  },
  {
    timestamps: true
  }
);

/**
 * INDEXES for faster queries
 */
resourceSchema.index({ category: 1, status: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ accessLevel: 1 });

/**
 * METHOD: Check if user can access this resource
 */
resourceSchema.methods.canUserAccess = function(user) {
  // Admin can access everything
  if (user.role === 'admin') return true;

  // Check access level
  const roleHierarchy = { admin: 3, manager: 2, user: 1, public: 0 };
  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[this.accessLevel] || 0;

  // User must have required role level
  if (userLevel < requiredLevel) return false;

  // If specific users are listed, check if user is in the list
  if (this.allowedUsers.length > 0) {
    return this.allowedUsers.some(id => id.equals(user._id));
  }

  // Otherwise, access level check passed
  return true;
};

/**
 * METHOD: Increment view count
 */
resourceSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

/**
 * METHOD: Increment download count
 */
resourceSchema.methods.incrementDownloads = async function() {
  this.downloads += 1;
  await this.save();
};

module.exports = mongoose.model('Resource', resourceSchema);