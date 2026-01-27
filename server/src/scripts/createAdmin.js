require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_DATA = {
  name: 'Admin User',
  email: 'admin@accesshub.com',
  password: 'admin123',
  role: 'admin',
  department: 'Operations',
  status: 'active'
};

const createAdmin = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

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
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

createAdmin();