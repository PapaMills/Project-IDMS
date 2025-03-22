// controllers/logController.js
const Log = require('../models/Log');
const logger = require('../utils/logger');

// Fetch all logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }); // Sort by most recent
    res.status(200).json(logs);
  } catch (error) {
    logger.error(`Error fetching logs: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch logs by type (e.g., info, warn, error)
exports.getLogsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const logs = await Log.find({ level: type }).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    logger.error(`Error fetching logs by type: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch logs by severity (e.g., low, medium, high, critical)
exports.getLogsBySeverity = async (req, res) => {
  try {
    const { severity } = req.params;
    const logs = await Log.find({ 'meta.severity': severity }).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    logger.error(`Error fetching logs by severity: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch logs within a date range
exports.getLogsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const logs = await Log.find({
      timestamp: {
        $gte: new Date(startDate), // Greater than or equal to startDate
        $lte: new Date(endDate), // Less than or equal to endDate
      },
    }).sort({ timestamp: -1 });

    res.status(200).json(logs);
  } catch (error) {
    logger.error(`Error fetching logs by date range: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a log by ID
exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    await Log.findByIdAndDelete(id);
    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting log: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};