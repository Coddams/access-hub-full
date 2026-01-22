// src/utils/generateToken.js

const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    // PAYLOAD: Data stored in the token (not sensitive info!)
    { 
      id: userId,
      role: role
    },
    // SECRET: Used to verify token is real (from .env file)
    process.env.JWT_SECRET,
    // OPTIONS: Token settings
    {
      expiresIn: '30d'  // Token valid for 30 days
    }
  );
};


const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = { generateToken, verifyToken };