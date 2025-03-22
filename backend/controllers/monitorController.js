// controllers/monitorController.js
const logger = require('../utils/logger');
const io = require('../utils/socket');

// Log and emit a monitoring event
exports.logEvent = (eventType, eventData) => {
  const event = {
    type: eventType,
    data: eventData,
    timestamp: new Date(),
  };

  // Log the event
  logger.info(`Monitoring Event: ${eventType}`, event);

  // Emit the event to all connected clients
  io.emit('monitorEvent', event);
};