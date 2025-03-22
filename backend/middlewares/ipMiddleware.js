// middlewares/ipMiddleware.js
const ipService = require('../services/ipService');

// Middleware to track IP activity
const trackIPActivity = async (req, res, next) => {
  const ipAddress = req.ip || req.connection.remoteAddress;

  try {
    // Log the IP activity
    await ipService.logIPActivity(ipAddress, 'api-request', {
      endpoint: req.originalUrl,
      method: req.method,
      status: res.statusCode,
    });

    next();
  } catch (error) {
    console.error('Error tracking IP activity:', error);
    next();
  }
};

module.exports = trackIPActivity;