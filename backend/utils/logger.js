// utils/logger.js
const winston = require('winston');
const path = require('path');
const Log = require('../models/Log');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Log level (e.g., 'info', 'error', 'debug')
  format: logFormat,
  transports: [
    // Log to a file
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/app.log'), // Path to the log file
      level: 'info', // Log level for the file
    }),
  ],
});

// Function to save logs to the database
const saveLogToDB = async (level, message, meta = {}) => {
  try {
    const logEntry = new Log({ level, message, meta });
    await logEntry.save();
  } catch (error) {
    console.error('Failed to save log to database:', error);
  }
};

// Override the default logger methods to save logs to the database
logger.info = (message, meta) => {
  saveLogToDB('info', message, meta);
  logger.log('info', message, meta);
};

logger.warn = (message, meta) => {
  saveLogToDB('warn', message, meta);
  logger.log('warn', message, meta);
};

logger.error = (message, meta) => {
  saveLogToDB('error', message, meta);
  logger.log('error', message, meta);
};

module.exports = logger;