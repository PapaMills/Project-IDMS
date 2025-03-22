// server.js
const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');

// Get the port from environment variables
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins (update this for production)
    methods: ['GET', 'POST'],
  },
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle real-time monitoring events
  socket.on('monitorEvent', (data) => {
    console.log('Received monitoring event:', data);
    // Broadcast the event to all connected clients
    io.emit('monitorEvent', data);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});