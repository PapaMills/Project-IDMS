// services/alertService.js
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Send an alert via email
const sendAlert = async (subject, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Admin email address
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Alert sent: ${subject}`);
  } catch (error) {
    logger.error(`Error sending alert: ${error.message}`);
  }
};

module.exports = { sendAlert };