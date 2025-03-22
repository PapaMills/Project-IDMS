// utils/helpers.js
const logger = require('./logger');

/**
 * Format a date object into a readable string.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string (e.g., "2025-03-21 10:15:00").
 */
const formatDate = (date) => {
  try {
    return date.toISOString().replace('T', ' ').split('.')[0];
  } catch (error) {
    logger.error(`Error formatting date: ${error.message}`);
    return null;
  }
};

/**
 * Generate a random string of a specified length.
 * @param {number} length - The length of the random string.
 * @returns {string} - The generated random string.
 */
const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Validate an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate a password.
 * @param {string} password - The password to validate.
 * @returns {boolean} - True if the password is valid, false otherwise.
 */
const validatePassword = (password) => {
  // Password must be at least 8 characters long
  return password.length >= 8;
};

/**
 * Paginate an array of data.
 * @param {Array} data - The data to paginate.
 * @param {number} page - The page number (starting from 1).
 * @param {number} limit - The number of items per page.
 * @returns {Object} - Paginated data with metadata.
 */
const paginate = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    page,
    limit,
    totalItems: data.length,
    totalPages: Math.ceil(data.length / limit),
  };
};

module.exports = {
  formatDate,
  generateRandomString,
  validateEmail,
  validatePassword,
  paginate,
};