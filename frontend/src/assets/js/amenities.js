/**
 * Amenities functionality for Homeverse
 * Handles displaying and interacting with property amenities
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmenities();
  initBuildingAmenities();
});

/**
 * Initialize amenities functionality
 */
function initAmenities() {
  // Add event listeners to amenity buttons on property cards
  const amenityButtons = document.querySelectorAll('.card-footer-actions-btn ion-icon[name="options-outline"]');
  if (amenityButtons.length > 0) {
    amenityButtons.forEach(button => {
      button.parentElement.addEventListener('click', function(e) {
        e.preventDefault();
        const propertyCard = this.closest('.property-card');
        if (propertyCard) {
          showAmenitiesModal(propertyCard);
        }
      });
    });
  } else {
    // If no amenity buttons with options-outline icon, try to find other buttons
    const alternativeButtons = document.querySelectorAll('.card-footer-actions-btn');
    alternativeButtons.forEach(button => {
      // Check if this is the third button (usually for amenities)
      const isThirdButton = Array.from(button.parentElement.children).indexOf(button) === 2;
      if (isThirdButton) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          const propertyCard = this.closest('.property-card');
          if (propertyCard) {
            showAmenitiesModal(propertyCard);
          }
        });
      }
    });
  }
}

/**
 * Initialize Building Amenities section
 */
function initBuildingAmenities() {
  const amenityCards = document.querySelectorAll('.features-card');
  
  amenityCards.forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const amenityType = this.querySelector('.card-title').textContent.trim();
      showBuildingAmenityDetails(amenityType, this);
    });
  });
}

/**
 * Show details for a specific building amenity
 * @param {string} amenityType - The type of amenity
 * @param {HTMLElement} cardElement - The card element that was clicked
 */
function showBuildingAmenityDetails(amenityType, cardElement) {
  // Get amenity details
  const amenityDetails = getBuildingAmenityDetails(amenityType);
  
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'amenities-modal';
  modal.innerHTML = `
    <div class="amenities-modal-content">
      <div class="amenities-modal-header">
        <h3>${amenityType}</h3>
        <button class="amenities-modal-close">&times;</button>
      </div>
      <div class="amenities-modal-body">
        <div class="amenity-details">
          <div class="amenity-icon">
            ${amenityDetails.icon}
          </div>
          <div class="amenity-description">
            <p>${amenityDetails.description}</p>
          </div>
          <div class="amenity-features">
            <h4>Features</h4>
            <ul class="amenities-list">
              ${amenityDetails.features.map(feature => `
                <li class="amenity-item">
                  <ion-icon name="${feature.icon}"></ion-icon>
                  <span>${feature.name}</span>
                  ${feature.description ? `<p class="amenity-description">${feature.description}</p>` : ''}
                </li>
              `).join('')}
            </ul>
          </div>
          ${amenityDetails.image ? `
            <div class="amenity-image">
              <img src="${amenityDetails.image}" alt="${amenityType}">
            </div>
          ` : ''}
        </div>
      </div>
      <div class="amenities-modal-footer">
        <button class="btn schedule-viewing-btn">Schedule Viewing</button>
      </div>
    </div>
  `;
  
  // Add modal to body
  document.body.appendChild(modal);
  
  // Add event listeners
  const closeButton = modal.querySelector('.amenities-modal-close');
  closeButton.addEventListener('click', () => {
    modal.classList.add('closing');
    setTimeout(() => {
      modal.remove();
    }, 300);
  });
  
  // Close when clicking outside the modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('closing');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  });
  
  // Schedule viewing button
  const scheduleButton = modal.querySelector('.schedule-viewing-btn');
  scheduleButton.addEventListener('click', () => {
    modal.remove();
    
    // Open enquiry modal if it exists
    const enquiryModal = document.getElementById('enquiryModal');
    if (enquiryModal) {
      // Pre-fill subject with amenity information
      const subjectField = enquiryModal.querySelector('#subject');
      if (subjectField) {
        subjectField.value = `Enquiry about ${amenityType}`;
      }
      
      // Pre-fill message with amenity information
      const messageField = enquiryModal.querySelector('#message');
      if (messageField) {
        messageField.value = `I would like more information about the ${amenityType.toLowerCase()} amenity. Please contact me with details about properties that offer this feature.`;
      }
      
      // Show the modal
      enquiryModal.style.display = 'flex';
    }
  });
  
  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
}

/**
 * Get details for a specific building amenity
 * @param {string} amenityType - The type of amenity
 * @returns {Object} - Object containing amenity details
 */
function getBuildingAmenityDetails(amenityType) {
  // Default details
  const defaultDetails = {
    icon: '<ion-icon name="help-outline"></ion-icon>',
    description: 'Information about this amenity is not available.',
    features: [],
    image: null
  };
  
  // Amenity details by type
  const amenityDetails = {
    'Parking Space': {
      icon: '<ion-icon name="car-sport-outline"></ion-icon>',
      description: 'Our properties offer convenient and secure parking options for residents and their guests.',
      features: [
        { name: 'Reserved Parking', icon: 'checkmark-circle-outline', description: 'Dedicated parking spots for residents' },
        { name: 'Covered Parking', icon: 'umbrella-outline', description: 'Protection from weather elements' },
        { name: 'EV Charging Stations', icon: 'flash-outline', description: 'Charging points for electric vehicles' },
        { name: '24/7 Security', icon: 'shield-checkmark-outline', description: 'Constant surveillance and security measures' },
        { name: 'Visitor Parking', icon: 'people-outline', description: 'Designated areas for guests' }
      ],
      image: './assets/images/amenities/parking.jpg'
    },
    'Swimming Pool': {
      icon: '<ion-icon name="water-outline"></ion-icon>',
      description: 'Enjoy our luxurious swimming pools designed for relaxation and recreation.',
      features: [
        { name: 'Heated Pool', icon: 'thermometer-outline', description: 'Comfortable swimming year-round' },
        { name: 'Infinity Edge', icon: 'expand-outline', description: 'Stunning visual effect with panoramic views' },
        { name: 'Lap Lanes', icon: 'fitness-outline', description: 'Dedicated areas for exercise swimming' },
        { name: 'Poolside Lounging', icon: 'sunny-outline', description: 'Comfortable seating areas around the pool' },
        { name: 'Children\'s Pool', icon: 'happy-outline', description: 'Shallow area for younger swimmers' }
      ],
      image: './assets/images/amenities/pool.jpg'
    },
    'Private Security': {
      icon: '<ion-icon name="shield-checkmark-outline"></ion-icon>',
      description: 'Our comprehensive security systems ensure peace of mind for all residents.',
      features: [
        { name: '24/7 Security Personnel', icon: 'person-outline', description: 'Round-the-clock security staff' },
        { name: 'CCTV Surveillance', icon: 'videocam-outline', description: 'Monitoring of common areas and entry points' },
        { name: 'Access Control', icon: 'key-outline', description: 'Secure entry systems for residents and guests' },
        { name: 'Alarm Systems', icon: 'alert-circle-outline', description: 'Immediate response to security breaches' },
        { name: 'Secure Parking', icon: 'car-outline', description: 'Protected parking areas for vehicles' }
      ],
      image: './assets/images/amenities/security.jpg'
    },
    'Medical Center': {
      icon: '<ion-icon name="fitness-outline"></ion-icon>',
      description: 'On-site medical facilities provide convenient healthcare access for residents.',
      features: [
        { name: 'Emergency Response', icon: 'medkit-outline', description: 'Quick assistance for medical emergencies' },
        { name: 'General Practitioner', icon: 'person-outline', description: 'Regular consultations with doctors' },
        { name: 'Pharmacy Services', icon: 'medical-outline', description: 'Easy access to medications' },
        { name: 'Health Screenings', icon: 'pulse-outline', description: 'Regular health check-ups and preventive care' },
        { name: 'Wellness Programs', icon: 'heart-outline', description: 'Activities promoting overall wellbeing' }
      ],
      image: './assets/images/amenities/medical.jpg'
    },
    'Library Area': {
      icon: '<ion-icon name="library-outline"></ion-icon>',
      description: 'Our library areas provide quiet spaces for reading, working, and studying.',
      features: [
        { name: 'Extensive Book Collection', icon: 'book-outline', description: 'Wide range of books across genres' },
        { name: 'Reading Lounges', icon: 'cafe-outline', description: 'Comfortable seating for extended reading sessions' },
        { name: 'Study Spaces', icon: 'desktop-outline', description: 'Quiet areas for focused work' },
        { name: 'Digital Resources', icon: 'tablet-portrait-outline', description: 'Access to e-books and online materials' },
        { name: 'Community Events', icon: 'people-outline', description: 'Book clubs and literary gatherings' }
      ],
      image: './assets/images/amenities/library.jpg'
    },
    'King Size Beds': {
      icon: '<ion-icon name="bed-outline"></ion-icon>',
      description: 'Our properties feature luxurious king-size beds for ultimate comfort and rest.',
      features: [
        { name: 'Premium Mattresses', icon: 'checkmark-circle-outline', description: 'High-quality sleep surfaces for optimal comfort' },
        { name: 'Luxury Linens', icon: 'layers-outline', description: 'Fine bedding materials for a restful sleep' },
        { name: 'Spacious Design', icon: 'expand-outline', description: 'Ample space for comfortable sleeping' },
        { name: 'Elegant Headboards', icon: 'construct-outline', description: 'Stylish and functional bed frames' },
        { name: 'Reading Lights', icon: 'bulb-outline', description: 'Convenient lighting for nighttime reading' }
      ],
      image: './assets/images/amenities/bed.jpg'
    },
    'Smart Homes': {
      icon: '<ion-icon name="home-outline"></ion-icon>',
      description: 'Our smart home features bring convenience, efficiency, and security to modern living.',
      features: [
        { name: 'Voice Control', icon: 'mic-outline', description: 'Control home features with voice commands' },
        { name: 'Smart Lighting', icon: 'bulb-outline', description: 'Automated and customizable lighting systems' },
        { name: 'Climate Control', icon: 'thermometer-outline', description: 'Intelligent temperature management' },
        { name: 'Security Systems', icon: 'shield-outline', description: 'Advanced home security features' },
        { name: 'Entertainment Integration', icon: 'tv-outline', description: 'Connected audio and video systems' }
      ],
      image: './assets/images/amenities/smart-home.jpg'
    },
    'Kid\'s Playland': {
      icon: '<ion-icon name="football-outline"></ion-icon>',
      description: 'Dedicated play areas designed for children\'s enjoyment, safety, and development.',
      features: [
        { name: 'Playground Equipment', icon: 'construct-outline', description: 'Age-appropriate play structures' },
        { name: 'Safety Surfaces', icon: 'shield-checkmark-outline', description: 'Soft ground materials for safe play' },
        { name: 'Indoor Play Areas', icon: 'home-outline', description: 'Climate-controlled spaces for year-round fun' },
        { name: 'Educational Activities', icon: 'school-outline', description: 'Learning through play opportunities' },
        { name: 'Supervision', icon: 'eye-outline', description: 'Monitored play areas for peace of mind' }
      ],
      image: './assets/images/amenities/playground.jpg'
    }
  };
  
  // Return details for the specified amenity type, or default if not found
  return amenityDetails[amenityType] || defaultDetails;
}

/**
 * Show amenities modal for a property
 * @param {HTMLElement} propertyCard - The property card element
 */
function showAmenitiesModal(propertyCard) {
  // Extract property data
  const propertyId = propertyCard.dataset.id;
  const title = propertyCard.querySelector('.card-title a').textContent.trim();
  
  // Get amenities data for this property
  const amenities = getPropertyAmenities(propertyId);
  
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'amenities-modal';
  modal.innerHTML = `
    <div class="amenities-modal-content">
      <div class="amenities-modal-header">
        <h3>Amenities for ${title}</h3>
        <button class="amenities-modal-close">&times;</button>
      </div>
      <div class="amenities-modal-body">
        <div class="amenities-tabs">
          <button class="amenity-tab active" data-category="indoor">Indoor</button>
          <button class="amenity-tab" data-category="outdoor">Outdoor</button>
          <button class="amenity-tab" data-category="community">Community</button>
          <button class="amenity-tab" data-category="safety">Safety & Security</button>
        </div>
        <div class="amenities-content">
          <div class="amenity-category active" id="indoor-amenities">
            ${renderAmenityList(amenities.indoor)}
          </div>
          <div class="amenity-category" id="outdoor-amenities">
            ${renderAmenityList(amenities.outdoor)}
          </div>
          <div class="amenity-category" id="community-amenities">
            ${renderAmenityList(amenities.community)}
          </div>
          <div class="amenity-category" id="safety-amenities">
            ${renderAmenityList(amenities.safety)}
          </div>
        </div>
      </div>
      <div class="amenities-modal-footer">
        <button class="btn schedule-viewing-btn" data-property-id="${propertyId}">Schedule Viewing</button>
      </div>
    </div>
  `;
  
  // Add modal to body
  document.body.appendChild(modal);
  
  // Add event listeners
  const closeButton = modal.querySelector('.amenities-modal-close');
  closeButton.addEventListener('click', () => {
    modal.classList.add('closing');
    setTimeout(() => {
      modal.remove();
    }, 300);
  });
  
  // Close when clicking outside the modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('closing');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  });
  
  // Tab switching functionality
  const tabs = modal.querySelectorAll('.amenity-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and content
      tabs.forEach(t => t.classList.remove('active'));
      modal.querySelectorAll('.amenity-category').forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const category = tab.dataset.category;
      modal.querySelector(`#${category}-amenities`).classList.add('active');
    });
  });
  
  // Schedule viewing button
  const scheduleButton = modal.querySelector('.schedule-viewing-btn');
  scheduleButton.addEventListener('click', () => {
    modal.remove();
    
    // Open enquiry modal if it exists
    const enquiryModal = document.getElementById('enquiryModal');
    if (enquiryModal) {
      // Pre-fill subject with property information
      const subjectField = enquiryModal.querySelector('#subject');
      if (subjectField) {
        subjectField.value = `Schedule viewing for ${title}`;
      }
      
      // Pre-fill message with property information
      const messageField = enquiryModal.querySelector('#message');
      if (messageField) {
        messageField.value = `I would like to schedule a viewing for ${title}. I'm particularly interested in the amenities. Please contact me with available dates and times.`;
      }
      
      // Show the modal
      enquiryModal.style.display = 'flex';
    }
  });
  
  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
}

/**
 * Render a list of amenities
 * @param {Array} amenities - List of amenities
 * @returns {string} - HTML for the amenity list
 */
function renderAmenityList(amenities) {
  if (!amenities || amenities.length === 0) {
    return '<p class="no-amenities">No amenities listed in this category</p>';
  }
  
  let html = '<ul class="amenities-list">';
  
  amenities.forEach(amenity => {
    const iconName = amenity.icon || 'checkmark-circle-outline';
    html += `
      <li class="amenity-item">
        <ion-icon name="${iconName}"></ion-icon>
        <span>${amenity.name}</span>
        ${amenity.description ? `<p class="amenity-description">${amenity.description}</p>` : ''}
      </li>
    `;
  });
  
  html += '</ul>';
  return html;
}

/**
 * Get amenities for a specific property
 * @param {string} propertyId - Property ID
 * @returns {Object} - Object containing amenities by category
 */
function getPropertyAmenities(propertyId) {
  // In a real application, you would fetch this data from an API
  // For demo purposes, we'll return mock data based on property ID
  
  // Default amenities for all properties
  const defaultAmenities = {
    indoor: [
      { name: 'Air Conditioning', icon: 'snow-outline', description: 'Central air conditioning throughout the property' },
      { name: 'Heating', icon: 'flame-outline', description: 'Central heating system' },
      { name: 'High-Speed Internet', icon: 'wifi-outline', description: 'Fiber optic internet connection available' },
      { name: 'Modern Kitchen', icon: 'restaurant-outline', description: 'Fully equipped kitchen with modern appliances' }
    ],
    outdoor: [
      { name: 'Private Balcony', icon: 'sunny-outline', description: 'Spacious balcony with scenic views' },
      { name: 'Parking Space', icon: 'car-outline', description: 'Dedicated parking space included' }
    ],
    community: [
      { name: 'Fitness Center', icon: 'barbell-outline', description: 'State-of-the-art fitness center with modern equipment' },
      { name: 'Swimming Pool', icon: 'water-outline', description: 'Outdoor swimming pool with lounging area' }
    ],
    safety: [
      { name: '24/7 Security', icon: 'shield-checkmark-outline', description: 'Round-the-clock security personnel' },
      { name: 'Fire Alarm System', icon: 'flame-outline', description: 'Advanced fire detection and sprinkler system' },
      { name: 'Secure Entry', icon: 'lock-closed-outline', description: 'Secure entry system with intercom' }
    ]
  };
  
  // Additional amenities based on property ID
  // In a real app, this would come from your database
  const propertySpecificAmenities = {
    // Luxury properties (IDs 1-3)
    '1': {
      indoor: [
        { name: 'Smart Home System', icon: 'home-outline', description: 'Fully integrated smart home technology' },
        { name: 'Wine Cellar', icon: 'wine-outline', description: 'Temperature-controlled wine storage' },
        { name: 'Home Theater', icon: 'film-outline', description: 'Dedicated home theater room with premium sound system' }
      ],
      outdoor: [
        { name: 'Infinity Pool', icon: 'water-outline', description: 'Private infinity pool with ocean views' },
        { name: 'Outdoor Kitchen', icon: 'restaurant-outline', description: 'Fully equipped outdoor kitchen and dining area' },
        { name: 'Landscaped Garden', icon: 'leaf-outline', description: 'Professionally designed and maintained garden' }
      ],
      community: [
        { name: 'Concierge Service', icon: 'person-outline', description: '24/7 concierge service for residents' },
        { name: 'Private Beach Access', icon: 'umbrella-outline', description: 'Exclusive access to private beach area' }
      ],
      safety: [
        { name: 'Biometric Access', icon: 'finger-print-outline', description: 'Biometric security access system' },
        { name: 'Security Cameras', icon: 'videocam-outline', description: 'Advanced CCTV system throughout the property' }
      ]
    },
    // Mid-range properties (IDs 4-6)
    '4': {
      indoor: [
        { name: 'Dishwasher', icon: 'water-outline', description: 'Energy-efficient dishwasher' },
        { name: 'Walk-in Closet', icon: 'shirt-outline', description: 'Spacious walk-in closet in master bedroom' }
      ],
      outdoor: [
        { name: 'BBQ Area', icon: 'flame-outline', description: 'Dedicated BBQ area for residents' }
      ],
      community: [
        { name: 'Playground', icon: 'happy-outline', description: 'Children\'s playground within the community' },
        { name: 'Jogging Track', icon: 'walk-outline', description: 'Dedicated jogging track around the property' }
      ],
      safety: []
    },
    // Budget properties (IDs 7-9)
    '7': {
      indoor: [
        { name: 'Storage Space', icon: 'archive-outline', description: 'Additional storage space included' }
      ],
      outdoor: [
        { name: 'Shared Garden', icon: 'leaf-outline', description: 'Access to shared garden space' }
      ],
      community: [
        { name: 'Laundry Facilities', icon: 'shirt-outline', description: 'Shared laundry facilities on premises' }
      ],
      safety: [
        { name: 'Intercom System', icon: 'call-outline', description: 'Intercom system for visitor access' }
      ]
    }
  };
  
  // Determine which specific amenities to add based on property ID
  let specificAmenities = {};
  
  // Convert propertyId to a number for comparison
  const idNum = parseInt(propertyId.replace('property-', ''), 10);
  
  if (idNum >= 1 && idNum <= 3) {
    specificAmenities = propertySpecificAmenities['1'];
  } else if (idNum >= 4 && idNum <= 6) {
    specificAmenities = propertySpecificAmenities['4'];
  } else if (idNum >= 7 && idNum <= 9) {
    specificAmenities = propertySpecificAmenities['7'];
  }
  
  // Combine default and specific amenities
  const result = {
    indoor: [...defaultAmenities.indoor],
    outdoor: [...defaultAmenities.outdoor],
    community: [...defaultAmenities.community],
    safety: [...defaultAmenities.safety]
  };
  
  // Add specific amenities if available
  if (specificAmenities.indoor) {
    result.indoor = [...result.indoor, ...specificAmenities.indoor];
  }
  if (specificAmenities.outdoor) {
    result.outdoor = [...result.outdoor, ...specificAmenities.outdoor];
  }
  if (specificAmenities.community) {
    result.community = [...result.community, ...specificAmenities.community];
  }
  if (specificAmenities.safety) {
    result.safety = [...result.safety, ...specificAmenities.safety];
  }
  
  return result;
}

// Export functions for use in other files
window.amenitiesFunctions = {
  showAmenitiesModal,
  showBuildingAmenityDetails
}; 