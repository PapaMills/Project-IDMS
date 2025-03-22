// models/Threat.js
const mongoose = require('mongoose');

// Define the Threat schema
const threatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['malicious-ip', 'brute-force', 'anomaly', 'rule-violation'], // Types of threats
    },
    severity: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'critical'], // Threat severity levels
    },
    sourceIp: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed, // Flexible metadata field
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Create the Threat model
const Threat = mongoose.model('Threat', threatSchema);

module.exports = Threat;