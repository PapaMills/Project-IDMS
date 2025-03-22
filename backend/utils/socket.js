// utils/socket.js
const socketIo = require('socket.io');

let io;

// Initialize socket.io
exports.init = (server) => {
  io = socketIo(server, {
    cors: {
      origin: '*', // Allow all origins (update this for production)
      methods: ['GET', 'POST'],
    },
  });
  return io;
};

// Get the socket.io instance
exports.getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};