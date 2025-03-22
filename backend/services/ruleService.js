// services/ruleService.js
const { Engine } = require('json-rules-engine');
const logger = require('../utils/logger');
const Threat = require('../models/Threat');

// Initialize the rules engine
const engine = new Engine();

// Define rules for detecting suspicious activities
const defineRules = () => {
  // Rule 1: Detect multiple failed login attempts from the same IP
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'failedLogins',
          operator: 'greaterThanInclusive',
          value: 5, // Threshold for failed login attempts
        },
        {
          fact: 'timeframe',
          operator: 'lessThanInclusive',
          value: 5, // Timeframe in minutes
        },
      ],
    },
    event: {
      type: 'brute-force',
      message: 'Multiple failed login attempts detected from the same IP.',
    },
  });

  // Rule 2: Detect unusual API request patterns
  engine.addRule({
    conditions: {
      all: [
        {
          fact: 'apiRequests',
          operator: 'greaterThanInclusive',
          value: 100, // Threshold for API requests
        },
        {
          fact: 'timeframe',
          operator: 'lessThanInclusive',
          value: 1, // Timeframe in minutes
        },
      ],
    },
    event: {
      type: 'api-abuse',
      message: 'Unusual API request patterns detected.',
    },
  });

  logger.info('Rules defined successfully');
};

// Evaluate facts against the rules
const evaluateRules = async (facts) => {
  try {
    const { events } = await engine.run(facts);

    if (events.length > 0) {
      // Log detected threats
      for (const event of events) {
        const { type, message } = event;
        logger.warn(`Rule triggered: ${message}`);

        // Log the threat in the database
        await Threat.create({
          type,
          severity: 'high',
          sourceIp: facts.ipAddress,
          description: message,
          meta: facts,
        });
      }
    }
  } catch (error) {
    logger.error(`Error evaluating rules: ${error.message}`);
  }
};

module.exports = { defineRules, evaluateRules };