const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please add number of bedrooms']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please add number of bathrooms']
  },
  area: {
    type: Number,
    required: [true, 'Please add area in square feet']
  },
  type: {
    type: String,
    required: [true, 'Please add property type'],
    enum: ['Apartment', 'House', 'Condo', 'Villa', 'Office']
  },
  features: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  has3DModel: {
    type: Boolean,
    default: false
  },
  modelPath: {
    type: String,
    default: ''
  },
  videoPath: {
    type: String,
    default: ''
  },
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  agent: {
    name: {
      type: String,
      required: [true, 'Please add agent name']
    },
    title: {
      type: String,
      default: 'Real Estate Agent'
    },
    image: {
      type: String,
      default: '/assets/images/agents/default.jpg'
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', PropertySchema); 