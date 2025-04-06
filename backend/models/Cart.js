const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest carts with no user
  },
  guestId: {
    type: String,
    required: false // For non-logged in users
  },
  items: [
    {
      property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
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
CartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cart', CartSchema); 