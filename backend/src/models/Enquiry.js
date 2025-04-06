const mongoose = require('mongoose');

// Response schema for nested responses
const ResponseSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Enquiry schema
const EnquirySchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
    default: 'Pending'
  },
  responses: [ResponseSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
EnquirySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate a unique token
EnquirySchema.statics.generateToken = async function() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  const token = `HV-${timestamp.toString().slice(-6)}${random.toString().padStart(4, '0')}`;
  
  // Check if token already exists
  const exists = await this.findOne({ token });
  if (exists) {
    // If token exists, generate a new one recursively
    return this.generateToken();
  }
  
  return token;
};

module.exports = mongoose.model('Enquiry', EnquirySchema); 