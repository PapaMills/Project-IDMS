// app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
const trackIPActivity = require('./middlewares/ipMiddleware');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const cors = require('cors'); // Import CORS

// Initialize Express app
const app = express();

// Use CORS middleware
app.use(cors()); // Enable CORS for all routes


// Middleware to parse JSON bodies
app.use(express.json());

// Track IP activity for all requests
app.use(trackIPActivity);

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use log routes
app.use('/api', logRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

// Export the app for use in server.js
module.exports = app;
