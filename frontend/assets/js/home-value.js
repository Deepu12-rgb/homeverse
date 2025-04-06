/**
 * Home Value Estimator JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const addressInput = document.getElementById('address-input');
  const addressSubmit = document.getElementById('address-submit');
  const propertyDetailsForm = document.querySelector('.property-details-form');
  const estimateResults = document.querySelector('.estimate-results');
  const propertyForm = document.getElementById('property-details');
  
  // Results elements
  const estimateAddress = document.querySelector('.estimate-address');
  const lowValue = document.querySelector('.low-value');
  const highValue = document.querySelector('.high-value');
  const estimateAmount = document.querySelector('.estimate-amount');
  const estimateDate = document.getElementById('estimate-date');
  const resultBedrooms = document.getElementById('result-bedrooms');
  const resultBathrooms = document.getElementById('result-bathrooms');
  const resultSqft = document.getElementById('result-sqft');
  const rangeMarker = document.querySelector('.range-marker');
  const updateEstimateBtn = document.getElementById('update-estimate-btn');
  const sellHomeBtn = document.getElementById('sell-home-btn');
  const calculateMortgageBtn = document.getElementById('calculate-mortgage-btn');
  
  // Set current date
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  if (estimateDate) {
    estimateDate.textContent = today.toLocaleDateString('en-US', options);
  }
  
  // Address submit handler
  if (addressSubmit) {
    addressSubmit.addEventListener('click', function() {
      const address = addressInput.value.trim();
      
      if (address) {
        // In a real app, here you would validate the address with an API
        // For now, we'll just show the property form
        propertyDetailsForm.style.display = 'block';
        
        // Save address for later
        localStorage.setItem('property_address', address);
        
        // Smooth scroll to property form
        propertyDetailsForm.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert('Please enter a valid address');
      }
    });
  }
  
  // Property form submit handler
  if (propertyForm) {
    propertyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(propertyForm);
      const propertyParams = {
        location: localStorage.getItem('property_address') || 'Unknown',
        area: parseInt(formData.get('area')) || 2000,
        bedrooms: parseInt(formData.get('bedrooms')) || 3,
        bathrooms: parseFloat(formData.get('bathrooms')) || 2,
        yearBuilt: parseInt(formData.get('yearBuilt')) || 2000,
        lotSize: parseInt(formData.get('lotSize')) || 5000,
        propertyType: formData.get('propertyType') || 'house',
        hasGarage: formData.get('hasGarage') === 'on',
        hasBasement: formData.get('hasBasement') === 'on',
        hasPool: formData.get('hasPool') === 'on',
        recentRenovation: formData.get('recentRenovation') === 'on'
      };
      
      // Calculate estimate using estimateHomeValue function from property-data.js
      const estimate = window.propertyData.estimateHomeValue(propertyParams);
      
      // Update results UI
      updateEstimateUI(propertyParams, estimate);
      
      // Show results
      estimateResults.style.display = 'block';
      
      // Smooth scroll to results
      estimateResults.scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  // Update estimate button handler
  if (updateEstimateBtn) {
    updateEstimateBtn.addEventListener('click', function() {
      // Hide results and show form again
      estimateResults.style.display = 'none';
      propertyDetailsForm.style.display = 'block';
      
      // Smooth scroll to form
      propertyDetailsForm.scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  // Sell home button handler
  if (sellHomeBtn) {
    sellHomeBtn.addEventListener('click', function() {
      window.location.href = 'add-listing.html';
    });
  }
  
  // Calculate mortgage button handler
  if (calculateMortgageBtn) {
    calculateMortgageBtn.addEventListener('click', function() {
      // Get the estimated value
      const value = parseInt(estimateAmount.textContent.replace(/[^0-9]/g, ''));
      
      // Set up URL with parameters for mortgage calculator
      const mortgageUrl = `mortgage-calculator.html?homePrice=${value}&location=${encodeURIComponent(estimateAddress.textContent)}`;
      
      // Navigate to mortgage calculator
      window.location.href = mortgageUrl;
    });
  }
  
  // Function to update the estimate UI
  function updateEstimateUI(propertyParams, estimate) {
    // Update address
    estimateAddress.textContent = propertyParams.location;
    
    // Update values
    lowValue.textContent = estimate.formattedLowRange;
    highValue.textContent = estimate.formattedHighRange;
    estimateAmount.textContent = estimate.formattedEstimate;
    
    // Update property details
    resultBedrooms.textContent = propertyParams.bedrooms;
    resultBathrooms.textContent = propertyParams.bathrooms;
    resultSqft.textContent = propertyParams.area.toLocaleString();
    
    // Update range marker position
    // Calculate percentage position based on estimate within range
    const range = estimate.highRange - estimate.lowRange;
    const position = ((estimate.estimate - estimate.lowRange) / range) * 100;
    rangeMarker.style.left = `${position}%`;
    
    // Store estimate data for sharing
    localStorage.setItem('property_estimate', JSON.stringify({
      address: propertyParams.location,
      estimate: estimate.estimate,
      lowRange: estimate.lowRange,
      highRange: estimate.highRange,
      bedrooms: propertyParams.bedrooms,
      bathrooms: propertyParams.bathrooms,
      sqft: propertyParams.area,
      date: today.toISOString()
    }));
  }
}); 