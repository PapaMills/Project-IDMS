// controllers/threatController.js
const Threat = require('../models/Threat');
const logger = require('../utils/logger');

// Log a detected threat
exports.logThreat = async (type, severity, sourceIp, description, meta = {}) => {
  try {
    const threat = new Threat({
      type,
      severity,
      sourceIp,
      description,
      meta,
    });

    await threat.save();
    logger.info(`Threat detected: ${description}`);
  } catch (error) {
    logger.error(`Error logging threat: ${error.message}`);
  }
};