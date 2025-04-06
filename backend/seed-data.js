require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');
const connectDB = require('./config/db');

// Sample property data
const properties = [
  {
    title: 'New Apartment Nice View',
    price: 34500,
    location: '123 Main St, New York, NY',
    description: 'Beautiful apartment with a stunning view of the city skyline. This modern apartment features high ceilings, large windows, and an open floor plan.',
    bedrooms: 2,
    bathrooms: 1,
    area: 1200,
    type: 'Apartment',
    features: ['Elevator', 'Parking', 'Air Conditioning', 'Heating', 'Balcony'],
    images: [
      '/assets/images/properties/property-1.jpg',
      '/assets/images/properties/property-1-1.jpg',
      '/assets/images/properties/property-1-2.jpg'
    ],
    has3DModel: true,
    modelPath: '/assets/models/apartment1.glb',
    videoPath: '/assets/videos/apartment1.mp4',
    agent: {
      name: 'John Smith',
      title: 'Senior Real Estate Agent',
      image: '/assets/images/agents/agent-1.jpg',
      phone: '(123) 456-7890',
      email: 'john.smith@homeverse.com'
    }
  },
  {
    title: 'Luxury Villa in Suburban Area',
    price: 240000,
    location: '456 Park Ave, Los Angeles, CA',
    description: 'Spacious luxury villa in a quiet suburban neighborhood. This beautiful home features a large backyard, swimming pool, and modern amenities.',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    type: 'Villa',
    features: ['Swimming Pool', 'Garden', 'Garage', 'Security System', 'Fireplace'],
    images: [
      '/assets/images/properties/property-2.jpg',
      '/assets/images/properties/property-2-1.jpg',
      '/assets/images/properties/property-2-2.jpg'
    ],
    has3DModel: true,
    modelPath: '/assets/models/villa1.glb',
    videoPath: '/assets/videos/villa1.mp4',
    agent: {
      name: 'Sarah Johnson',
      title: 'Luxury Property Specialist',
      image: '/assets/images/agents/agent-2.jpg',
      phone: '(234) 567-8901',
      email: 'sarah.johnson@homeverse.com'
    }
  },
  {
    title: 'Modern Apartment in City Center',
    price: 185000,
    location: '789 Broadway, Chicago, IL',
    description: 'Modern apartment located in the heart of the city. This stylish apartment features high-end finishes, a gourmet kitchen, and a spacious living area.',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    type: 'Apartment',
    features: ['Gym', 'Concierge', 'Rooftop Terrace', 'Pet Friendly', 'In-unit Laundry'],
    images: [
      '/assets/images/properties/property-3.jpg',
      '/assets/images/properties/property-3-1.jpg',
      '/assets/images/properties/property-3-2.jpg'
    ],
    has3DModel: true,
    modelPath: '/assets/models/apartment2.glb',
    videoPath: '/assets/videos/apartment2.mp4',
    agent: {
      name: 'Michael Brown',
      title: 'Urban Property Expert',
      image: '/assets/images/agents/agent-3.jpg',
      phone: '(345) 678-9012',
      email: 'michael.brown@homeverse.com'
    }
  }
];

// Connect to MongoDB
connectDB();

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Property.deleteMany({});
    console.log('Cleared existing property data');

    // Insert new data
    const createdProperties = await Property.insertMany(properties);
    console.log(`Added ${createdProperties.length} properties to the database`);

    // Log the IDs of the created properties
    console.log('Property IDs:');
    createdProperties.forEach(property => {
      console.log(`- ${property.title}: ${property._id}`);
    });

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase(); 