const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Property = require('../models/Property');
const { v4: uuidv4 } = require('uuid');

// Helper function to get or create a cart
const getOrCreateCart = async (userId, guestId) => {
  let cart;
  
  if (userId) {
    // Find cart by user ID
    cart = await Cart.findOne({ user: userId });
  } else if (guestId) {
    // Find cart by guest ID
    cart = await Cart.findOne({ guestId });
  }
  
  // If no cart exists, create a new one
  if (!cart) {
    cart = new Cart({
      user: userId || null,
      guestId: userId ? null : (guestId || uuidv4())
    });
    await cart.save();
  }
  
  return cart;
};

// @route   GET /api/cart
// @desc    Get cart items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const guestId = req.cookies.guestId || req.query.guestId;
    
    const cart = await getOrCreateCart(userId, guestId);
    
    // Populate property details
    await cart.populate('items.property');
    
    // Set guest ID cookie if not logged in
    if (!userId && cart.guestId) {
      res.cookie('guestId', cart.guestId, { 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true 
      });
    }
    
    res.json({ 
      success: true, 
      data: cart,
      guestId: cart.guestId // Include guestId in response for client-side storage
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/cart/add/:propertyId
// @desc    Add property to cart
// @access  Public
router.post('/add/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user ? req.user.id : null;
    const guestId = req.cookies.guestId || req.query.guestId;
    
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    // Get or create cart
    const cart = await getOrCreateCart(userId, guestId);
    
    // Check if property is already in cart
    const isPropertyInCart = cart.items.some(item => 
      item.property.toString() === propertyId
    );
    
    if (isPropertyInCart) {
      return res.status(400).json({ 
        success: false, 
        error: 'Property is already in cart' 
      });
    }
    
    // Add property to cart
    cart.items.push({ property: propertyId });
    await cart.save();
    
    // Populate property details
    await cart.populate('items.property');
    
    // Set guest ID cookie if not logged in
    if (!userId && cart.guestId) {
      res.cookie('guestId', cart.guestId, { 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Property added to cart',
      data: cart,
      guestId: cart.guestId
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   DELETE /api/cart/remove/:propertyId
// @desc    Remove property from cart
// @access  Public
router.delete('/remove/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user ? req.user.id : null;
    const guestId = req.cookies.guestId || req.query.guestId;
    
    if (!userId && !guestId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID or Guest ID is required' 
      });
    }
    
    // Get cart
    const cart = await getOrCreateCart(userId, guestId);
    
    // Remove property from cart
    cart.items = cart.items.filter(item => 
      item.property.toString() !== propertyId
    );
    
    await cart.save();
    
    // Populate property details
    await cart.populate('items.property');
    
    res.json({ 
      success: true, 
      message: 'Property removed from cart',
      data: cart 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear cart
// @access  Public
router.delete('/clear', async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const guestId = req.cookies.guestId || req.query.guestId;
    
    if (!userId && !guestId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID or Guest ID is required' 
      });
    }
    
    // Get cart
    const cart = await getOrCreateCart(userId, guestId);
    
    // Clear cart items
    cart.items = [];
    await cart.save();
    
    res.json({ 
      success: true, 
      message: 'Cart cleared',
      data: cart 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router; 