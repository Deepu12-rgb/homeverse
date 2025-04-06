/**
 * CORS Configuration for Homeverse Backend
 */

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',  // Frontend development server
  'http://127.0.0.1:3000',  // Alternative localhost
  // Add production URLs when deployed
];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      // Origin is allowed
      callback(null, true);
    } else {
      // Origin is not allowed
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

module.exports = corsOptions; 