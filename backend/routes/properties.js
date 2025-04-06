const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// @route   GET /api/properties
// @desc    Get all properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json({ success: true, count: properties.length, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/properties/:id
// @desc    Get property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    res.json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/properties
// @desc    Create a property
// @access  Private (TODO: Add authentication middleware)
router.post('/', async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update a property
// @access  Private (TODO: Add authentication middleware)
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    res.json({ success: true, data: property });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a property
// @access  Private (TODO: Add authentication middleware)
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/properties/3d-models
// @desc    Get all properties with 3D models
// @access  Public
router.get('/3d-models/all', async (req, res) => {
  try {
    const properties = await Property.find({ has3DModel: true });
    res.json({ success: true, count: properties.length, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router; 