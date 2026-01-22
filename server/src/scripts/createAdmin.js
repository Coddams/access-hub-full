// server/src/scripts/createAdmin.js

/**
 * ADMIN SEEDER SCRIPT
 * 
 * This script creates an admin user or upgrades an existing user to admin.
 * Run with: node src/scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Admin user details
const ADMIN_DATA = {
  name: 'Admin User',
  email: 'admin@accesshub.com',
  password: 'admin123',  // Change this!
  role: 'admin',
  department: 'Operations',
  status: 'active'
};

const createAdmin = async () => {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    let admin = await User.findOne({ email: ADMIN_DATA.email });

    if (admin) {
      console.log('📝 Admin user already exists. Updating role...');
      admin.role = 'admin';
      admin.status = 'active';
      await admin.save();
      console.log('✅ User upgraded to admin successfully!');
    } else {
      console.log('📝 Creating new admin user...');
      admin = await User.create(ADMIN_DATA);
      console.log('✅ Admin user created successfully!');
    }

    console.log('');
    console.log('='.repeat(50));
    console.log('Admin Details:');
    console.log('='.repeat(50));
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Password: ${ADMIN_DATA.password}`);
    console.log('='.repeat(50));
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

// Run the script
createAdmin();