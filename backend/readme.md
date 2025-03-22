## Project IDMS - Intrusion Detection and Monitoring System (Backend)
The Project IDMS is a backend system designed to detect and monitor suspicious activities in real-time. It provides features like user authentication, threat detection, IP tracking, logging, and automated alerts. Built with Node.js, Express, and MongoDB, this system is scalable and ready for integration with a frontend or other systems.

Features
1. Authentication
User registration and login with JWT tokens.

Password hashing using bcryptjs.

Role-based access control (e.g., user and admin).

2. Threat Detection
Rule-based detection using json-rules-engine.

Logging detected threats in the threats collection.

Example: Detect brute-force attacks or unusual API request patterns.

3. IP Tracking
Track IP addresses and geolocation using ipstack.

Log IP activity in the iplogs collection.

4. Real-Time Monitoring
Real-time event monitoring using socket.io.

Emit events for suspicious activities (e.g., failed logins, API abuse).

5. Logging
Application-level logging with winston.

Logs stored in both files (logs/app.log) and the database (logs collection).

6. Alert System
Automated email alerts using nodemailer.

Send alerts to administrators when threats are detected.

7. Anomaly Detection
Detect unusual patterns using brain.js.

Example: Detect anomalies in user behavior or system metrics.

8. Database Models
User: For authentication and user management.

Log: For application-level logs.

Threat: For detected threats.

IPLog: For IP tracking and geolocation.

9. Middleware
Authentication Middleware: Protect routes with JWT tokens.

IP Middleware: Track IP addresses for every request.

10. Services
Auth Service: Handle authentication logic.

Log Service: Manage application logs.

Threat Service: Detect and log threats.

IP Service: Fetch IP details and track activity.

Monitor Service: Handle real-time monitoring.

Alert Service: Send automated alerts.

Anomaly Service: Detect unusual patterns.

Rule Service: Define and evaluate rules for threat detection.

Technologies Used
Backend: Node.js, Express

Database: MongoDB

Authentication: JWT, bcryptjs

Logging: Winston

Real-Time Monitoring: Socket.io

Threat Detection: json-rules-engine

IP Tracking: ipstack

Alert System: nodemailer

Anomaly Detection: brain.js

Validation: express-validator

Setup Instructions
1. Clone the Repository

git clone https://github.com/PapaMills/Project-IDMS.git
cd Project-IDMS
2. Install Dependencies

npm install
3. Set Up Environment Variables
Create a .env file in the root directory and add the following variables:


PORT=5000
MONGO_URI=mongodb://localhost:27017/idms
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
ADMIN_EMAIL=admin@example.com
IPSTACK_API_KEY=your_ipstack_api_key

4. Start the Server

npm run dev
The server will start at http://localhost:5000.

API Endpoints
Authentication
POST /api/auth/register: Register a new user.

POST /api/auth/login: Log in an existing user.

# Logs
GET /api/logs: Fetch all logs.

GET /api/logs/type/:type: Fetch logs by type (e.g., info, warn, error).

GET /api/logs/severity/:severity: Fetch logs by severity (e.g., low, medium, high).

GET /api/logs/date-range: Fetch logs within a date range.

DELETE /api/logs/:id: Delete a log by ID (admin only).

Threats
Threats are automatically logged when detected by the system.

IP Logs
IP activity is automatically logged for every request.

## Usage Examples

## Register a New User

curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}'
## Login an Existing User

curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{
  "email": "test@example.com",
  "password": "password123"
}'
## Fetch All Logs

curl -X GET http://localhost:5000/api/logs -H "Authorization: Bearer <your_token>"

## Folder Structure

imds-backend/
├── config/                  # Configuration files
│   ├── db.js                # Database connection settings
├── controllers/             # Logic for handling API requests
│   ├── authController.js    # User authentication logic
│   ├── logController.js     # Logging and reporting logic
│   ├── threatController.js  # Threat detection logic
├── models/                  # Database models
│   ├── User.js              # User model
│   ├── Log.js               # Log model
│   ├── Threat.js            # Threat model
│   ├── IPLog.js             # IP tracking model
├── routes/                  # API routes
│   ├── authRoutes.js        # Routes for user authentication
│   ├── logRoutes.js         # Routes for logging and reporting
├── services/                # Business logic and external integrations
│   ├── authService.js       # Authentication service
│   ├── logService.js        # Logging service
│   ├── threatService.js     # Threat detection service
│   ├── ipService.js         # IP tracking service
│   ├── monitorService.js    # Real-time monitoring service
│   ├── ruleService.js       # Rule-based detection service
│   ├── anomalyService.js    # Anomaly detection service
│   ├── alertService.js      # Automated alert service
├── utils/                   # Utility functions
│   ├── logger.js            # Logging utility
│   ├── socket.js            # Socket.IO utility for real-time monitoring
├── middlewares/             # Custom middlewares
│   ├── authMiddleware.js    # Authentication middleware
│   ├── ipMiddleware.js      # IP tracking middleware
├── scripts/                 # Scripts for setup and automation
│   ├── createThreat.js      # Script to create a sample threat
│   ├── createIPLog.js       # Script to create a sample IP log
├── tests/                   # Test cases (to be implemented)
├── app.js                   # Main application file
├── server.js                # Server setup and entry point
└── .env                     # Environment variables

## Contributing
Contributions are welcome! If you’d like to contribute, please follow these steps:

Fork the repository.

Create a new branch for your feature or bugfix.

Commit your changes and push to the branch.

## Submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
Node.js and Express for the backend framework.

MongoDB for the database.

json-rules-engine for rule-based threat detection.

ipstack for IP tracking and geolocation.