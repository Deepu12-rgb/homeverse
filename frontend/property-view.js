/**
 * Initialize property details page with 3D view and map
 */
function initPropertyDetails() {
  // Check if we're on the property details page
  const propertyDetailsContainer = document.getElementById('property-details');
  if (!propertyDetailsContainer) return;
  
  // Get property data from localStorage
  const propertyId = localStorage.getItem('selectedPropertyId');
  let propertyData;
  
  if (propertyId && window.propertyData && window.propertyData[propertyId]) {
    // Get data from our property data object
    propertyData = window.propertyData[propertyId];
  } else {
    // Fallback to localStorage data
    propertyData = JSON.parse(localStorage.getItem('selectedProperty') || '{}');
    if (!propertyData.id) {
      console.error('No property data found');
      return;
    }
  }
  
  // Populate property details
  populatePropertyDetails(propertyData);
  
  // Initialize 3D viewer
  init3DViewer(propertyData);
  
  // Initialize map
  initPropertyMap(propertyData);
} 