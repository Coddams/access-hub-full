// src/config/database.js

// Import mongoose – translator between JS and MongoDB
const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas
 *
 * Think of this like making a phone call to your database.
 * Modern MongoDB already knows how to dial the number.
 */
const connectDB = async () => {
  try {
    // Connect using the URI from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Success logs
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

  } catch (error) {
    // Failure logs
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
