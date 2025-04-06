const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

/**
 * @route   POST /api/enquiries
 * @desc    Submit a new enquiry
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
        success: true, 
        token,
        enquiry
      });
    } catch (err) {
      console.error('Error submitting enquiry:', err.message);
      res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  }
);

/**
 * @route   GET /api/enquiries
 * @desc    Get all enquiries
 * @access  Private/Admin
 */
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin (you'll need to implement this)
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access all enquiries' 
      });
    }

    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ 
      success: true, 
      count: enquiries.length,
      enquiries 
    });
  } catch (err) {
    console.error('Error fetching enquiries:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

/**
 * @route   GET /api/enquiries/token/:token
 * @desc    Get enquiry by token
 * @access  Public
 */
router.get('/token/:token', async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({ token: req.params.token });

    if (!enquiry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Enquiry not found' 
      });
    }

    res.json({ 
      success: true, 
      enquiry 
    });
  } catch (err) {
    console.error('Error fetching enquiry by token:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

/**
 * @route   PUT /api/enquiries/token/:token/status
 * @desc    Update enquiry status
 * @access  Private/Admin
 */
router.put('/token/:token/status', auth, async (req, res) => {
  try {
    // Check if user is admin (you'll need to implement this)
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update enquiry status' 
      });
    }

    const { status } = req.body;

    // Validate status
    if (!['Pending', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const enquiry = await Enquiry.findOne({ token: req.params.token });

    if (!enquiry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Enquiry not found' 
      });
    }

    // Update status
    enquiry.status = status;
    await enquiry.save();

    res.json({ 
      success: true, 
      enquiry 
    });
  } catch (err) {
    console.error('Error updating enquiry status:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

/**
 * @route   POST /api/enquiries/token/:token/responses
 * @desc    Add a response to an enquiry
 * @access  Private
 */
router.post('/token/:token/responses', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ 
        success: false, 
        message: 'Response text is required' 
      });
    }

    const enquiry = await Enquiry.findOne({ token: req.params.token });

    if (!enquiry) {
      return res.status(404).json({ 
        success: false, 
        message: 'Enquiry not found' 
      });
    }

    // Add response
    enquiry.responses.push({
      text,
      isAdmin: req.user.isAdmin // Set based on user role
    });

    // If admin is responding, update status to In Progress if it's Pending
    if (req.user.isAdmin && enquiry.status === 'Pending') {
      enquiry.status = 'In Progress';
    }

    await enquiry.save();

    res.json({ 
      success: true, 
      enquiry 
    });
  } catch (err) {
    console.error('Error adding response:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

/**
 * @route   GET /api/enquiries/user/:email
 * @desc    Get enquiries by user email
 * @access  Private
 */
router.get('/user/:email', auth, async (req, res) => {
  try {
    // Check if user is requesting their own enquiries
    if (req.user.email !== req.params.email && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access these enquiries' 
      });
    }

    const enquiries = await Enquiry.find({ email: req.params.email }).sort({ createdAt: -1 });
    
    res.json({ 
      success: true, 
      count: enquiries.length,
      enquiries 
    });
  } catch (err) {
    console.error('Error fetching user enquiries:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router; 