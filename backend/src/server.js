/**
 * Main server file for the Homeverse backend
 * This file sets up the Express server, middleware, and routes
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Import routes
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
// const propertyRoutes = require('./routes/properties');
// const cartRoutes = require('./routes/cart');
// const enquiryRoutes = require('./routes/enquiries');
const publicEnquiryRoutes = require('./routes/public-enquiries');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - Allow all origins during development
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://homeverse.com' 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add cookie parser middleware

// API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/enquiries', enquiryRoutes);
app.use('/api/public/enquiries', publicEnquiryRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api/public/enquiries`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app; 