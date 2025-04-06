/**
 * Homeverse Backend Application
 * Main entry point
 */

// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const corsOptions = require('./utils/corsConfig');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes
const publicEnquiryRoutes = require('./routes/publicEnquiries');
// Uncomment these as you implement them
// const authRoutes = require('./routes/auth');
// const propertyRoutes = require('./routes/properties');
// const userRoutes = require('./routes/users');

// API routes
app.use('/api/public/enquiries', publicEnquiryRoutes);
// Uncomment these as you implement them
// app.use('/api/auth', authRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Serve static files from the public directory if needed
app.use(express.static(path.join(__dirname, '../public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Something went wrong on the server'
  });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api`);
}); 