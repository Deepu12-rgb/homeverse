/**
 * Property Data - Contains detailed information about all properties
 */

// Property data with 3D model information
const properties = [
  {
    id: 1,
    title: "New Apartment Nice View",
    price: "$34,900/Month",
    location: "Belmont Gardens, Chicago",
    description: "Beautiful Huge 1 Family House In Heart Of Westbury. Newly Renovated With New Wood Floors, New Kitchen, New Bathroom, New Roof, and New Windows.",
    bedrooms: 3,
    bathrooms: 2,
    area: 3450,
    type: "For Rent",
    features: [
      "Central Air Conditioning",
      "Hardwood Floors",
      "Stainless Steel Appliances",
      "Walk-in Closets"
    ],
    images: [
      "./assets/images/property-1.jpg"
    ],
    agent: {
      name: "William Seklo",
      title: "Estate Agent",
      phone: "(312) 555-1234",
      email: "william@homeverse.com",
      image: "./assets/images/author.jpg"
    },
    has3DModel: true,
    modelPath: "./assets/models/property-1.glb",
    videoPath: "./assets/videos/property-1.mp4"
  },
  {
    id: 2,
    title: "Luxury Villa in Suburban Area",
    price: "$56,000/Month",
    location: "Belmont Gardens, Chicago",
    description: "Spacious luxury villa with garden and pool. This beautiful property features 5 bedrooms, 3 bathrooms, and a large living area with stunning views.",
    bedrooms: 5,
    bathrooms: 3,
    area: 5280,
    type: "For Sale",
    features: [
      "Swimming Pool",
      "Garden",
      "Garage",
      "Central Heating",
      "Air Conditioning"
    ],
    images: [
      "./assets/images/property-2.jpg"
    ],
    agent: {
      name: "William Seklo",
      title: "Estate Agent",
      phone: "(312) 555-1234",
      email: "william@homeverse.com",
      image: "./assets/images/author.jpg"
    },
    has3DModel: true,
    modelPath: "./assets/models/property-2.glb",
    videoPath: "./assets/videos/property-2.mp4"
  },
  {
    id: 3,
    title: "Modern Apartment in City Center",
    price: "$28,500/Month",
    location: "Belmont Gardens, Chicago",
    description: "Modern apartment in the heart of the city with great amenities and easy access to public transportation.",
    bedrooms: 2,
    bathrooms: 1,
    area: 1200,
    type: "For Rent",
    features: [
      "Central Air Conditioning",
      "Hardwood Floors",
      "Stainless Steel Appliances",
      "Balcony"
    ],
    images: [
      "./assets/images/property-3.jpg"
    ],
    agent: {
      name: "William Seklo",
      title: "Estate Agent",
      phone: "(312) 555-1234",
      email: "william@homeverse.com",
      image: "./assets/images/author.jpg"
    },
    has3DModel: true,
    modelPath: "./assets/models/property-3.glb",
    videoPath: "./assets/videos/property-3.mp4"
  }
];

// Function to get property by ID
function getPropertyById(id) {
  return properties.find(property => property.id === parseInt(id)) || properties[0];
}

// Function to get all properties
function getAllProperties() {
  return properties;
}

// Function to get properties with 3D models
function getPropertiesWith3DModels() {
  return properties.filter(property => property.has3DModel);
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getPropertyById,
    getAllProperties,
    getPropertiesWith3DModels
  };
} else {
  // For browser environment
  window.propertyData = {
    getPropertyById,
    getAllProperties,
    getPropertiesWith3DModels
  };
} 