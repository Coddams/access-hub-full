// src/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * USER SCHEMA
 * 
 * This is like a form that defines what information we collect about each user.
 * Think of it as a template - every user must follow this structure.
 */
const userSchema = new mongoose.Schema(
  {
    // BASIC INFORMATION
    name: {
      type: String,           // Must be text
      required: [true, 'Please provide a name'],  // Required field with custom error
      trim: true,             // Remove extra spaces
      maxlength: [50, 'Name cannot be more than 50 characters']
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,           // No two users can have same email
      lowercase: true,        // Convert to lowercase automatically
      trim: true,
      // Validate email format using regex
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false           // Don't return password in queries by default (security!)
    },

    // ROLE-BASED ACCESS CONTROL
    role: {
      type: String,
      enum: ['user', 'manager', 'admin'],  // Only these 3 values allowed
      default: 'user'         // New users are regular users by default
    },

    // ADDITIONAL INFORMATION
    department: {
      type: String,
      enum: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Legal'],
      default: 'Engineering'
    },

    avatar: {
      type: String,           // URL to profile picture
      default: null
    },

    // ACCOUNT STATUS
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active'
    },

    // TIMESTAMPS
    lastLogin: {
      type: Date,
      default: Date.now
    }
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true
  }
);

/**
 * MIDDLEWARE: Hash password before saving
 * 
 * This runs automatically BEFORE a user is saved to the database.
 * It encrypts the password so we never store plain text passwords.
 */
userSchema.pre('save', async function () {
  // Only hash the password if it's new or has been modified
  if (!this.isModified('password')) {
    return;
  }

  try {
    // Generate a "salt" (random data to make encryption stronger)
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

/**
 * METHOD: Compare password for login
 * 
 * This is a custom function we can call on any user object.
 * It checks if the entered password matches the hashed password.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * METHOD: Get user data without sensitive info
 * 
 * Returns user info safe to send to frontend (no password!)
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;  // Remove password from object
  return user;
};

// Create and export the User model
module.exports = mongoose.model('User', userSchema);