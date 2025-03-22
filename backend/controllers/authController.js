// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const { evaluateRules } = require('../services/ruleService');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Validation errors during registration:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration attempt with existing email: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id);

    logger.info(`New user registered: ${email}`);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Error during registration: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login an existing user
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Validation errors during login:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      logger.warn(`Login attempt with non-existent email: ${email}`);

      // Evaluate rules for failed login attempts
      await evaluateRules({
        failedLogins: 1, // Increment failed login count
        timeframe: 5, // Timeframe in minutes
        ipAddress,
      });

      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Failed login attempt for email: ${email}`);

      // Evaluate rules for failed login attempts
      await evaluateRules({
        failedLogins: 1, // Increment failed login count
        timeframe: 5, // Timeframe in minutes
        ipAddress,
      });

      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    logger.info(`User logged in: ${email}`);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Error during login: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};