// routes/logRoutes.js
const express = require('express');
const logController = require('../controllers/logController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all log routes with authMiddleware
router.use(authMiddleware);

// Fetch all logs
router.get('/logs', logController.getAllLogs);

// Fetch logs by type
router.get('/logs/type/:type', logController.getLogsByType);

// Fetch logs by severity
router.get('/logs/severity/:severity', logController.getLogsBySeverity);

// Fetch logs by date range
router.get('/logs/date-range', logController.getLogsByDateRange);

// Delete a log by ID (only admins can delete logs)
router.delete('/logs/:id', adminMiddleware, logController.deleteLog);

module.exports = router;