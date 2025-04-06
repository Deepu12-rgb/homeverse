/**
 * Public Enquiries Routes
 */

const express = require('express');
const router = express.Router();

// In-memory storage for enquiries (replace with database in production)
let enquiries = [];

/**
 * @route   GET /api/public/enquiries
 * @desc    Get all public enquiries
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({ success: true, data: enquiries });
});

/**
 * @route   POST /api/public/enquiries
 * @desc    Submit a new enquiry
 * @access  Public
 */
router.post('/', (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and message'
      });
    }

    // Create new enquiry
    const newEnquiry = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Enquiry',
      message,
      createdAt: new Date().toISOString()
    };

    // Add to enquiries array
    enquiries.push(newEnquiry);

    // Return success response
    res.status(201).json({
      success: true,
      data: newEnquiry
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router; 