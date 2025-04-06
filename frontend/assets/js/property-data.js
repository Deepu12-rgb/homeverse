/**
 * Property Data - Contains detailed information about all properties
 */

// Property data with 3D model information
const properties = [
  {
    id: 1,
    title: "New Apartment Nice View",
    price: "$34,900/Month",
    priceValue: 34900,
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
      "/assets/images/property-1.jpg"
    ],
    agent: {
      name: "William Seklo",
      title: "Estate Agent",
      phone: "(312) 555-1234",
      email: "william@homeverse.com",
      image: "/assets/images/author.jpg"
    },
    has3DModel: true,
    modelPath: "/assets/models/property-1.glb",
    videoPath: "/assets/videos/property-1.mp4",
    yearBuilt: 2018,
    lotSize: 5200,
    parkingSpaces: 2,
    neighborhood: {
      name: "Belmont Gardens",
      walkScore: 85,
      transitScore: 72,
      bikeScore: 68
    },
    taxHistory: [
      { year: 2023, amount: 4521 },
      { year: 2022, amount: 4350 },
      { year: 2021, amount: 4200 }
    ],
    priceHistory: [
      { date: "2023-06-15", price: 36500, event: "Listed for rent" },
      { date: "2022-01-10", price: 32800, event: "Rented" },
      { date: "2021-12-05", price: 32800, event: "Listed for rent" }
    ],
    schools: [
      { name: "Washington Elementary", level: "Elementary", rating: 8, distance: 0.5 },
      { name: "Lincoln Middle School", level: "Middle", rating: 7, distance: 1.2 },
      { name: "Roosevelt High", level: "High", rating: 8, distance: 1.8 }
    ]
  },
  {
    id: 2,
    title: "Luxury Villa in Suburban Area",
    price: "$56,000/Month",
    priceValue: 56000,
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
      "/assets/images/property-2.jpg"
    ],
    agent: {
      name: "William Seklo",
      title: "Estate Agent",
      phone: "(312) 555-1234",
      email: "william@homeverse.com",
      image: "/assets/images/author.jpg"
    },
    has3DModel: true,
    modelPath: "/assets/models/property-2.glb",
    videoPath: "/assets/videos/property-2.mp4",
    yearBuilt: 2010,
    lotSize: 12000,
    parkingSpaces: 3,
    neighborhood: {
      name: "Belmont Gardens",
      walkScore: 65,
      transitScore: 58,
      bikeScore: 72
    },
    taxHistory: [
      { year: 2023, amount: 12800 },
      { year: 2022, amount: 12100 },
      { year: 2021, amount: 11500 }
    ],
    priceHistory: [
      { date: "2023-08-20", price: 1250000, event: "Listed for sale" },
      { date: "2015-05-10", price: 980000, event: "Sold" },
      { date: "2015-01-15", price: 995000, event: "Listed for sale" }
    ],
    schools: [
      { name: "Washington Elementary", level: "Elementary", rating: 8, distance: 0.8 },
      { name: "Lincoln Middle School", level: "Middle", rating: 7, distance: 1.5 },
      { name: "Roosevelt High", level: "High", rating: 8, distance: 2.1 }
    ]
  },
  {
    id: 3,
    title: "Modern Apartment in City Center",
    price: "$28,500/Month",
    priceValue: 28500,
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
      "/assets/images/property-3.jpg"
    ],
    agent: {
      name: "William Seklo",
      title: "Estate Agent",
      phone: "(312) 555-1234",
      email: "william@homeverse.com",
      image: "/assets/images/author.jpg"
    },
    has3DModel: true,
    modelPath: "/assets/models/property-3.glb",
    videoPath: "/assets/videos/property-3.mp4",
    yearBuilt: 2020,
    lotSize: 0,
    parkingSpaces: 1,
    neighborhood: {
      name: "Downtown",
      walkScore: 95,
      transitScore: 90,
      bikeScore: 75
    },
    taxHistory: [
      { year: 2023, amount: 3200 },
      { year: 2022, amount: 3100 },
      { year: 2021, amount: 3000 }
    ],
    priceHistory: [
      { date: "2023-09-01", price: 28500, event: "Listed for rent" },
      { date: "2022-08-15", price: 26000, event: "Rented" },
      { date: "2021-07-20", price: 25000, event: "Listed for rent" }
    ],
    schools: [
      { name: "City Elementary", level: "Elementary", rating: 9, distance: 0.3 },
      { name: "Downtown Middle", level: "Middle", rating: 8, distance: 0.7 },
      { name: "Central High", level: "High", rating: 9, distance: 1.1 }
    ]
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

/**
 * Home Value Estimator (Similar to Zillow's Zestimate)
 * This function provides an estimated market value for a property based on
 * various parameters such as location, size, bedrooms, etc.
 */
function estimateHomeValue(params) {
  // Extract parameters with defaults
  const {
    location = 'Default',
    area = 2000,
    bedrooms = 3,
    bathrooms = 2,
    yearBuilt = 2000,
    lotSize = 5000,
    propertyType = 'house',
    hasGarage = false,
    hasBasement = false,
    hasPool = false,
    recentRenovation = false
  } = params;

/**
 * Property Data - Contains detailed information about all properties
 */

// Property data with 3D model information
const properties = [
  {
    id: 1,
    title: "New Apartment Nice View",
    price: "$34,900/Month",
    priceValue: 34900,
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
      "/assets/images/property-1.jpg"
    ],
    agent: {
      name: "William Seklo",
      title: "Estate Agent",
      phone: "(312) 555-1234",
      email: "william@homeverse.com",
      image: "/assets/images/author.jpg"
    },
    has3DModel: true,
    modelPath: "/assets/models/property-1.glb",
    videoPath: "/assets/videos/property-1.mp4",
    yearBuilt: 2018,
    lotSize: 5200,
    parkingSpaces: 2,
    neighborhood: {
      name: "Belmont Gardens",
      walkScore: 85,
      transitScore: 72,
      bikeScore: 68
    },
    taxHistory: [
      { year: 2023, amount: 4521 },
      { year: 2022, amount: 4350 },
      { year: 2021, amount: 4200 }
    ],
    priceHistory: [
      { date: "2023-06-15", price: 36500, event: "Listed for rent" },
      { date: "2022-01-10", price: 32800, event: "Rented" },
      { date: "2021-12-05", price: 32800, event: "Listed for rent" }
    ],
    schools: [
      { name: "Washington Elementary", level: "Elementary", rating: 8, distance: 0.5 },
      { name: "Lincoln Middle School", level: "Middle", rating: 7, distance: 1.2 },
      { name: "Roosevelt High", level: "High", rating: 8, distance: 1.8 }
    ]
  },
  {
    id: 2,
    title: "Luxury Villa in Suburban Area",
    price: "$56,000/Month",
    priceValue: 56000,
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
      "/assets/images/property-2.jpg"
    ],
    agent: {
      name: "William Seklo",
      title: "Estate Agent",
      phone: "(312) 555-1234",
      email: "william@homeverse.com",
      image: "/assets/images/author.jpg"
    },
    has3DModel: true,
    modelPath: "/assets/models/property-2.glb",
    videoPath: "/assets/videos/property-2.mp4",
    yearBuilt: 2010,
    lotSize: 12000,
    parkingSpaces: 3,
    neighborhood: {
      name: "Belmont Gardens",
      walkScore: 65,
      transitScore: 58,
      bikeScore: 72
    },
    taxHistory: [
      { year: 2023, amount: 12800 },
      { year: 2022, amount: 12100 },
      { year: 2021, amount: 11500 }
    ],
    priceHistory: [
      { date: "2023-08-20", price: 1250000, event: "Listed for sale" },
      { date: "2015-05-10", price: 980000, event: "Sold" },
      { date: "2015-01-15", price: 995000, event: "Listed for sale" }
    ],
    schools: [
      { name: "Washington Elementary", level: "Elementary", rating: 8, distance: 0.8 },
      { name: "Lincoln Middle School", level: "Middle", rating: 7, distance: 1.5 },
      { name: "Roosevelt High", level: "High", rating: 8, distance: 2.1 }
    ]
  },
  {
    id: 3,
    title: "Modern Apartment in City Center",
    price: "$28,500/Month",
    priceValue: 28500,
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
      "/assets/images/property-3.jpg"
    ],
    agent: {
      name: "William Seklo",
      title: "Estate Agent",
      phone: "(312) 555-1234",
      email: "william@homeverse.com",
      image: "/assets/images/author.jpg"
    },
    has3DModel: true,
    modelPath: "/assets/models/property-3.glb",
    videoPath: "/assets/videos/property-3.mp4",
    yearBuilt: 2020,
    lotSize: 0,
    parkingSpaces: 1,
    neighborhood: {
      name: "Downtown",
      walkScore: 95,
      transitScore: 90,
      bikeScore: 75
    },
    taxHistory: [
      { year: 2023, amount: 3200 },
      { year: 2022, amount: 3100 },
      { year: 2021, amount: 3000 }
    ],
    priceHistory: [
      { date: "2023-09-01", price: 28500, event: "Listed for rent" },
      { date: "2022-08-15", price: 26000, event: "Rented" },
      { date: "2021-07-20", price: 25000, event: "Listed for rent" }
    ],
    schools: [
      { name: "City Elementary", level: "Elementary", rating: 9, distance: 0.3 },
      { name: "Downtown Middle", level: "Middle", rating: 8, distance: 0.7 },
      { name: "Central High", level: "High", rating: 9, distance: 1.1 }
    ]
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

/**
 * Home Value Estimator (Similar to Zillow's Zestimate)
 * This function provides an estimated market value for a property based on
 * various parameters such as location, size, bedrooms, etc.
 */
function estimateHomeValue(params) {
  // Default values if not provided
  const defaults = {
    location: '',
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    yearBuilt: 2000,
    lotSize: 0,
    propertyType: 'house',
    recentRenovation: false,
    hasGarage: false,
    hasBasement: false,
    hasPool: false
  };

  // Merge defaults with provided parameters
  const propertyParams = { ...defaults, ...params };
  
  // Base price per square foot by location (simplified for example)
  const locationPricing = {
    'chicago': 250,
    'new york': 750,
    'los angeles': 650,
    'miami': 350,
    'dallas': 200,
    'phoenix': 230,
    'default': 275
  };
  
  // Get base price per square foot based on location
  const locationKey = propertyParams.location.toLowerCase().split(',')[0].trim();
  const pricePerSquareFoot = locationPricing[locationKey] || locationPricing.default;
  
  // Calculate base value based on square footage
  let estimatedValue = propertyParams.area * pricePerSquareFoot;
  
  // Adjustments based on property features
  
  // Bedrooms
  if (propertyParams.bedrooms > 0) {
    estimatedValue += (propertyParams.bedrooms * 15000);
  }
  
  // Bathrooms
  if (propertyParams.bathrooms > 0) {
    estimatedValue += (propertyParams.bathrooms * 12500);
  }
  
  // Property age adjustment
  const currentYear = new Date().getFullYear();
  const age = currentYear - propertyParams.yearBuilt;
  if (age <= 5) {
    estimatedValue *= 1.1; // 10% premium for newer homes
  } else if (age > 50) {
    estimatedValue *= 0.85; // 15% discount for older homes
  }
  
  // Recent renovation
  if (propertyParams.recentRenovation) {
    estimatedValue *= 1.08; // 8% premium for renovated homes
  }
  
  // Property type adjustments
  if (propertyParams.propertyType === 'condo') {
    estimatedValue *= 0.9; // 10% discount for condos
  } else if (propertyParams.propertyType === 'townhouse') {
    estimatedValue *= 0.95; // 5% discount for townhouses
  } else if (propertyParams.propertyType === 'luxury') {
    estimatedValue *= 1.25; // 25% premium for luxury properties
  }
  
  // Additional features
  if (propertyParams.hasGarage) estimatedValue += 25000;
  if (propertyParams.hasBasement) estimatedValue += 20000;
  if (propertyParams.hasPool) estimatedValue += 35000;
  
  // Lot size adjustment (for houses)
  if (propertyParams.propertyType === 'house' && propertyParams.lotSize > 0) {
    const lotSizeAdjustment = propertyParams.lotSize * 5; // $5 per square foot of lot
    estimatedValue += lotSizeAdjustment;
  }
  
  // Return both the estimate and a typical range
  return {
    estimate: Math.round(estimatedValue),
    lowRange: Math.round(estimatedValue * 0.9), // 10% below estimate
    highRange: Math.round(estimatedValue * 1.1), // 10% above estimate
    formattedEstimate: formatCurrency(Math.round(estimatedValue)),
    formattedLowRange: formatCurrency(Math.round(estimatedValue * 0.9)),
    formattedHighRange: formatCurrency(Math.round(estimatedValue * 1.1))
  };
}

/**
 * Mortgage Calculator (Similar to Zillow's mortgage calculator)
 */
function calculateMortgage(homePrice, downPayment, interestRate, loanTerm, propertyTax, homeInsurance, hoa) {
  // Convert percentage to decimal
  const monthlyInterestRate = (interestRate / 100) / 12;
  
  // Calculate loan amount
  const loanAmount = homePrice - downPayment;
  
  // Calculate monthly mortgage payment using the formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
  // where P = payment, L = loan amount, c = monthly interest rate, n = number of payments
  const numberOfPayments = loanTerm * 12;
  const monthlyPrincipalAndInterest = loanAmount * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  
  // Calculate monthly property tax, insurance, and HOA
  const monthlyPropertyTax = propertyTax / 12;
  const monthlyHomeInsurance = homeInsurance / 12;
  const monthlyHOA = hoa || 0;
  
  // Calculate total monthly payment
  const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyHOA;
  
  return {
    principalAndInterest: monthlyPrincipalAndInterest,
    propertyTax: monthlyPropertyTax,
    homeInsurance: monthlyHomeInsurance,
    hoa: monthlyHOA,
    totalMonthlyPayment: totalMonthlyPayment,
    formattedPrincipalAndInterest: formatCurrency(monthlyPrincipalAndInterest),
    formattedTotalMonthlyPayment: formatCurrency(totalMonthlyPayment),
    loanAmount: loanAmount,
    formattedLoanAmount: formatCurrency(loanAmount),
    downPaymentPercentage: (downPayment / homePrice) * 100
  };
}

/**
 * Format currency values
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getPropertyById,
    getAllProperties,
    getPropertiesWith3DModels,
    estimateHomeValue,
    calculateMortgage,
    formatCurrency
  };
} else {
  // For browser environment
  window.propertyData = {
    getPropertyById,
    getAllProperties,
    getPropertiesWith3DModels,
    estimateHomeValue,
    calculateMortgage,
    formatCurrency
  };
} 