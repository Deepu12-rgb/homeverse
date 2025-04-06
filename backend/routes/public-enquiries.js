const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const { check, validationResult } = require('express-validator');

/**
 * @route   GET /api/public/enquiries
 * @desc    Get all public enquiries
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    
    res.json({ 
      status: 'success',
      data: enquiries
    });
  } catch (err) {
    console.error('Error fetching enquiries:', err.message);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

/**
 * @route   POST /api/public/enquiries
 * @desc    Submit a new enquiry (public)
 * @access  Public
 */
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('subject', 'Subject is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, phone, subject, message } = req.body;

      // Generate a unique token
      const token = await Enquiry.generateToken();

      // Create a new enquiry
      const enquiry = new Enquiry({
        token,
        name,
        email,
        phone,
        subject,
        message
      });

      // Save the enquiry
      await enquiry.save();

      res.status(201).json({ 
        status: 'success',
        data: enquiry
      });
    } catch (err) {
      console.error('Error submitting enquiry:', err.message);
      res.status(500).json({ 
        status: 'error',
        message: 'Server error' 
      });
    }
  }
);

/**
 * @route   GET /api/public/enquiries/token/:token
 * @desc    Get enquiry by token (public)
 * @access  Public
 */
router.get('/token/:token', async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({ token: req.params.token });

    if (!enquiry) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Enquiry not found' 
      });
    }

    res.json({ 
      status: 'success',
      data: enquiry 
    });
  } catch (err) {
    console.error('Error fetching enquiry by token:', err.message);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

/**
 * @route   POST /api/public/enquiries/token/:token/responses
 * @desc    Add a user response to an enquiry (public)
 * @access  Public
 */
router.post('/token/:token/responses', 
  [
    check('text', 'Response text is required').not().isEmpty(),
    check('email', 'Email is required').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { text, email } = req.body;
      const enquiry = await Enquiry.findOne({ token: req.params.token });

      if (!enquiry) {
        return res.status(404).json({ 
          status: 'error',
          message: 'Enquiry not found' 
        });
      }

      // Verify that the email matches the enquiry email
      if (email !== enquiry.email) {
        return res.status(403).json({ 
          status: 'error',
          message: 'Not authorized to respond to this enquiry' 
        });
      }

      // Add response
      enquiry.responses.push({
        text,
        isAdmin: false
      });

      await enquiry.save();

      res.json({ 
        status: 'success',
        data: enquiry 
      });
    } catch (err) {
      console.error('Error adding response:', err.message);
      res.status(500).json({ 
        status: 'error',
        message: 'Server error' 
      });
    }
  }
);

/**
 * @route   GET /api/public/enquiries/email/:email
 * @desc    Get enquiries by email (public)
 * @access  Public
 */
router.get('/email/:email', async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ email: req.params.email }).sort({ createdAt: -1 });
    
    res.json({ 
      status: 'success',
      count: enquiries.length,
      data: enquiries 
    });
  } catch (err) {
    console.error('Error fetching user enquiries:', err.message);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error' 
    });
  }
});

module.exports = router; 