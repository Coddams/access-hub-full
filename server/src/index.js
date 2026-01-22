// src/index.js

/**
 * ACCESSHUB BACKEND SERVER
 * 
 * This is the main entry point of your backend.
 * It sets up Express, connects to MongoDB, and registers all routes.
 */

// ============================================
// 1. IMPORT DEPENDENCIES
// ============================================
require('dotenv').config();  // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// ============================================
// 2. INITIALIZE EXPRESS APP
// ============================================
const app = express();

// ============================================
// 3. CONNECT TO DATABASE
// ============================================
connectDB();

// ============================================
// 4. MIDDLEWARE
// ============================================

// CORS - Allow frontend to make requests to backend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true
}));

// Body Parser - Parse JSON request bodies
app.use(express.json());

// URL Encoded - Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request Logger - Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ============================================
// 5. ROUTES
// ============================================

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AccessHub API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/activities', require('./routes/activities'));

// ============================================
// 6. ERROR HANDLING
// ============================================

// 404 Handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// 7. START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log('🚀 AccessHub Backend Server');
  console.log('='.repeat(50));
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}`);
  console.log(`🔗 Frontend URL: ${process.env.CLIENT_URL}`);
  console.log('='.repeat(50));
  console.log('');
  console.log('📍 Available routes:');
  console.log('   GET  / - Health check');
  console.log('   POST /api/auth/register - Register user');
  console.log('   POST /api/auth/login - Login user');
  console.log('   GET  /api/auth/me - Get current user');
  console.log('   GET  /api/users - Get all users (admin)');
  console.log('   GET  /api/activities/me - Get my activities');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit
  process.exit(1);
});