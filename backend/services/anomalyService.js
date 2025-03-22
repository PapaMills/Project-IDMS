// services/anomalyService.js
const brain = require('brain.js');
const logger = require('../utils/logger');

// Initialize a neural network
const net = new brain.NeuralNetwork();

// Train the neural network with sample data
const trainingData = [
  { input: { rssi: -50 }, output: { normal: 1 } },
  { input: { rssi: -70 }, output: { normal: 1 } },
  { input: { rssi: -90 }, output: { anomaly: 1 } },
];

net.train(trainingData);

// Detect anomalies
const detectAnomaly = (input) => {
  const output = net.run(input);
  logger.info(`Anomaly detection output: ${JSON.stringify(output)}`);

  if (output.anomaly > 0.5) {
    return true; // Anomaly detected
  }
  return false; // No anomaly
};

module.exports = { detectAnomaly };