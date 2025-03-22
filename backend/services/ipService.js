// services/ipService.js
const IPLog = require('../models/IPLog');
const logger = require('../utils/logger');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Fetch geolocation and ISP information using IPStack
const fetchIPDetails = async (ipAddress) => {
  try {
    const response = await axios.get(
      `http://api.ipstack.com/${ipAddress}?access_key=${process.env.IPSTACK_API_KEY}`
    );

    const { country_name, region_name, city, connection } = response.data;
    return {
      country: country_name,
      region: region_name,
      city: city,
      isp: connection.isp,
    };
  } catch (error) {
    logger.error(`Error fetching IP details: ${error.message}`);
    return null;
  }
};

// Log IP activity
const logIPActivity = async (ipAddress, activityType, activityDetails) => {
  try {
    let ipLog = await IPLog.findOne({ ipAddress });

    if (!ipLog) {
      // Fetch IP details if the IP log doesn't exist
      const ipDetails = await fetchIPDetails(ipAddress);

      // Create a new IP log with fetched details
      ipLog = new IPLog({
        ipAddress,
        ...ipDetails, // Spread IP details into the document
      });
    }

    // Add the activity to the IP log
    ipLog.activity.push({
      type: activityType,
      details: activityDetails,
    });

    await ipLog.save();
    logger.info(`IP activity logged: ${ipAddress} - ${activityType}`);
  } catch (error) {
    logger.error(`Error logging IP activity: ${error.message}`);
  }
};

// Get IP log by IP address
const getIPLog = async (ipAddress) => {
  try {
    const ipLog = await IPLog.findOne({ ipAddress });
    return ipLog;
  } catch (error) {
    logger.error(`Error fetching IP log: ${error.message}`);
    throw error;
  }
};

// Block an IP address
const blockIP = async (ipAddress) => {
  try {
    const ipLog = await IPLog.findOneAndUpdate(
      { ipAddress },
      { isBlocked: true },
      { new: true }
    );

    if (!ipLog) {
      throw new Error('IP address not found');
    }

    logger.info(`IP address blocked: ${ipAddress}`);
    return ipLog;
  } catch (error) {
    logger.error(`Error blocking IP address: ${error.message}`);
    throw error;
  }
};

// Unblock an IP address
const unblockIP = async (ipAddress) => {
  try {
    const ipLog = await IPLog.findOneAndUpdate(
      { ipAddress },
      { isBlocked: false },
      { new: true }
    );

    if (!ipLog) {
      throw new Error('IP address not found');
    }

    logger.info(`IP address unblocked: ${ipAddress}`);
    return ipLog;
  } catch (error) {
    logger.error(`Error unblocking IP address: ${error.message}`);
    throw error;
  }
};

module.exports = {
  logIPActivity,
  getIPLog,
  blockIP,
  unblockIP,
};