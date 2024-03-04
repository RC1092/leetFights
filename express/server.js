// server.js
const express = require('express');
const http = require('http');
const socket = require('./socket'); // Import the socket module
const cors = require('cors');
const app = express();
const server = http.createServer(app);
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json());



// Import API routes
const apiRoutes = require('./api');

// Use API routes


// Initialize Socket.IO
socket(server);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
