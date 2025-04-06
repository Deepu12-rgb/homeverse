/**
 * Property View JavaScript
 * Handles loading property details and adding the "Add to Cart" button
 */

// API URL
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const propertyTitle = document.querySelector('.property-title');
const propertyLocation = document.querySelector('.location-text');
const propertyPrice = document.querySelector('.price-value');
const propertyMainImage = document.querySelector('.property-main-image');
const thumbnailContainer = document.querySelector('.thumbnail-container');
const bedroomsCount = document.querySelector('.bedrooms-count');
const bathroomsCount = document.querySelector('.bathrooms-count');
const areaValue = document.querySelector('.area-value');
const propertyType = document.querySelector('.property-type');
const descriptionText = document.querySelector('.description-text');
const featuresList = document.querySelector('.features-list');
const modelContainer = document.querySelector('.model-placeholder');
const noModelMessage = document.querySelector('.no-model-message');
const videoContainer = document.querySelector('.video-placeholder');
const noVideoMessage = document.querySelector('.no-video-message');
const agentName = document.querySelector('.agent-name');
const agentTitle = document.querySelector('.agent-title');
const agentPhoto = document.querySelector('.agent-photo');
const agentPhone = document.querySelector('.agent-phone');
const agentEmail = document.querySelector('.agent-email');
const propertyActions = document.querySelector('.property-actions');
const contactForm = document.querySelector('.contact-form');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize property view
document.addEventListener('DOMContentLoaded', function() {
  // Get property ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('id');
  
  if (propertyId) {
    // Load property details
    loadPropertyDetails(propertyId);
  } else {
    showNotification('Property ID not found', 'error');
  }
  
  // Initialize tabs
  initTabs();
  
  // Initialize contact form
  initContactForm();
});

/**
 * Load property details from API
 * @param {string} propertyId - Property ID to load
 */
async function loadPropertyDetails(propertyId) {
  try {
    const response = await fetch(`${API_URL}/properties/${propertyId}`);
    const data = await response.json();
    
    if (data.success) {
      const property = data.data;
      
      // Update property details
      updatePropertyDetails(property);
      
      // Add "Add to Wishlist" button
      addAddToWishlistButton(property._id);
    } else {
      showNotification('Error loading property details', 'error');
    }
  } catch (error) {
    console.error('Error loading property details:', error);
    showNotification('Error loading property details', 'error');
  }
}

/**
 * Update property details in the UI
 * @param {Object} property - Property data
 */
function updatePropertyDetails(property) {
  // Update main info
  propertyTitle.textContent = property.title;
  propertyLocation.textContent = property.location;
  propertyPrice.textContent = property.price.toLocaleString();
  
  // Update main image
  if (property.images && property.images.length > 0) {
    propertyMainImage.src = property.images[0];
    propertyMainImage.alt = property.title;
    
    // Add thumbnails
    if (thumbnailContainer) {
      thumbnailContainer.innerHTML = '';
      
      property.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        
        thumbnail.innerHTML = `<img src="${image}" alt="${property.title} - Image ${index + 1}">`;
        
        thumbnail.addEventListener('click', function() {
          // Update main image
          propertyMainImage.src = image;
          
          // Update active thumbnail
          document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
          });
          thumbnail.classList.add('active');
        });
        
        thumbnailContainer.appendChild(thumbnail);
      });
    }
  }
  
  // Update specs
  if (bedroomsCount) bedroomsCount.textContent = property.bedrooms;
  if (bathroomsCount) bathroomsCount.textContent = property.bathrooms;
  if (areaValue) areaValue.textContent = property.area.toLocaleString();
  if (propertyType) propertyType.textContent = property.type;
  
  // Update description
  if (descriptionText) descriptionText.textContent = property.description;
  
  // Update features
  if (featuresList && property.features && property.features.length > 0) {
    featuresList.innerHTML = '';
    
    property.features.forEach(feature => {
      const li = document.createElement('li');
      li.innerHTML = `<ion-icon name="checkmark-circle-outline"></ion-icon> ${feature}`;
      featuresList.appendChild(li);
    });
  }
  
  // Update 3D model
  if (modelContainer) {
    if (property.has3DModel && property.modelPath) {
      if (noModelMessage) noModelMessage.classList.add('hidden');
      
      // Add model viewer
      const modelViewer = document.createElement('model-viewer');
      modelViewer.src = property.modelPath;
      modelViewer.alt = `3D model of ${property.title}`;
      modelViewer.setAttribute('camera-controls', '');
      modelViewer.setAttribute('auto-rotate', '');
      modelViewer.setAttribute('ar', '');
      modelViewer.style.width = '100%';
      modelViewer.style.height = '400px';
      
      modelContainer.appendChild(modelViewer);
    } else {
      if (noModelMessage) noModelMessage.classList.remove('hidden');
    }
  }
  
  // Update video
  if (videoContainer) {
    if (property.videoPath) {
      if (noVideoMessage) noVideoMessage.classList.add('hidden');
      
      // Add video player
      const video = document.createElement('video');
      video.src = property.videoPath;
      video.controls = true;
      video.style.width = '100%';
      video.style.height = 'auto';
      
      videoContainer.appendChild(video);
    } else {
      if (noVideoMessage) noVideoMessage.classList.remove('hidden');
    }
  }
  
  // Update agent info
  if (property.agent) {
    updateAgentInfo(property.agent);
  }
}

/**
 * Update agent information
 * @param {Object} agent - Agent data
 */
function updateAgentInfo(agent) {
  if (agentName) agentName.textContent = agent.name;
  if (agentTitle) agentTitle.textContent = agent.title;
  if (agentPhoto && agent.image) agentPhoto.src = agent.image;
  if (agentPhone) agentPhone.textContent = agent.phone;
  if (agentEmail) agentEmail.textContent = agent.email;
}

/**
 * Add "Add to Wishlist" button to property actions
 * @param {string} propertyId - Property ID
 */
function addAddToWishlistButton(propertyId) {
  if (!propertyActions) return;
  
  // Create "Add to Wishlist" button
  const addToWishlistBtn = document.createElement('button');
  addToWishlistBtn.className = 'add-to-wishlist-btn';
  addToWishlistBtn.dataset.propertyId = propertyId;
  addToWishlistBtn.innerHTML = `
    <ion-icon name="heart-outline"></ion-icon>
    Add to Wishlist
  `;
  
  // Add event listener to the button
  addToWishlistBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Call addToWishlist function from wishlist.js
    if (window.wishlistFunctions && window.wishlistFunctions.addToWishlist) {
      window.wishlistFunctions.addToWishlist(propertyId);
    } else {
      console.error('Wishlist functions not available');
    }
  });
  
  // Append button to property actions
  propertyActions.appendChild(addToWishlistBtn);
}

/**
 * Initialize tabs functionality
 */
function initTabs() {
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get tab ID
      const tabId = this.dataset.tab;
      
      // Hide all tab contents
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Show selected tab content
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
}

/**
 * Initialize contact form
 */
function initContactForm() {
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');
    
    // Validate form data
    if (!name || !email || !message) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    // Show success message
    showNotification('Message sent successfully!', 'success');
    
    // Reset form
    contactForm.reset();
  });
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hide and remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
} 