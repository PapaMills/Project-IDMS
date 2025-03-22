// services/monitorService.js
const io = require('../utils/socket');
const logger = require('../utils/logger');

// Log and emit a monitoring event
const logEvent = (eventType, eventData) => {
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

module.exports = { logEvent };