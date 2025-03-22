// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  // Get the token from the request header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    logger.warn('Access denied: No token provided');
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user ID to the request object
    req.userId = decoded.id;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    logger.error(`Invalid token: ${error.message}`);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if the user has admin role
const adminMiddleware = (req, res, next) => {
  // Assuming the user role is attached to the request object during authentication
  if (req.userRole !== 'admin') {
    logger.warn('Access denied: Admin role required');
    return res.status(403).json({ message: 'Access denied: Admin role required' });
  }

  // Proceed to the next middleware or route handler
  next();
};

module.exports = { authMiddleware, adminMiddleware };