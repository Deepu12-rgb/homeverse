require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

// Create a simple Express server
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Create a simple schema and model
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Property = mongoose.model('Property', PropertySchema);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Homeverse API' });
});

// Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json({ success: true, count: properties.length, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add a property
app.post('/api/properties', async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api/properties`);
});

console.log('Test the API with:');
console.log('GET http://localhost:5000/api/properties');
console.log('POST http://localhost:5000/api/properties with property data'); 