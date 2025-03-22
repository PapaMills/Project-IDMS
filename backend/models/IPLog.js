// models/IPLog.js
const mongoose = require('mongoose');

// Define the IPLog schema
const ipLogSchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      required: true,
    },
    country: {
      type: String,
    },
    region: {
      type: String,
    },
    city: {
      type: String,
    },
    isp: {
      type: String,
    },
    activity: [
      {
        type: {
          type: String,
          required: true,
          enum: ['login', 'api-request', 'threat'], // Types of activity
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        details: {
          type: mongoose.Schema.Types.Mixed, // Flexible details field
        },
      },
    ],
    threatLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'], // Threat levels
      default: 'low',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Create the IPLog model
const IPLog = mongoose.model('IPLog', ipLogSchema);

module.exports = IPLog;