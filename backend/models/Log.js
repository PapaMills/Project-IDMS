// models/Log.js
const mongoose = require('mongoose');

// Define the Log schema
const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: true,
      enum: ['info', 'warn', 'error'], // Log levels
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed, // Flexible metadata field
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Create the Log model
const Log = mongoose.model('Log', logSchema);

module.exports = Log;