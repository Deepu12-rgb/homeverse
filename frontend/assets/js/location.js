/**
 * Location functionality for Homeverse
 * Handles geolocation and location-based property filtering
 */

document.addEventListener('DOMContentLoaded', () => {
  initLocationFeatures();
});

/**
 * Initialize location features
 */
function initLocationFeatures() {
  // Add event listeners to location icons in the property cards
  const locationButtons = document.querySelectorAll('.banner-actions-btn ion-icon[name="location"]');
  locationButtons.forEach(button => {
    button.parentElement.addEventListener('click', function(e) {
      e.preventDefault();
      const address = this.querySelector('address').textContent.trim();
      showLocationModal(address);
    });
  });

  // Add event listener to the location search button in the header
  const locationSearchButton = document.getElementById('location-search-btn');
  if (locationSearchButton) {
    locationSearchButton.addEventListener('click', function(e) {
      e.preventDefault();
      showLocationSearchModal();
    });
  }

  // Create location button in the header if it doesn't exist
  createLocationButton();
}

/**
 * Create location button in the header if it doesn't exist
 */
function createLocationButton() {
  // Check if the button already exists
  if (document.getElementById('location-search-btn')) {
    return;
  }

  // Find the header actions container
  const headerActions = document.querySelector('.header-bottom-actions');
  if (!headerActions) {
    return;
  }

  // Create the location button
  const locationButton = document.createElement('button');
  locationButton.className = 'header-bottom-actions-btn';
  locationButton.id = 'location-search-btn';
  locationButton.setAttribute('aria-label', 'Location');
  locationButton.innerHTML = `
    <ion-icon name="location-outline"></ion-icon>
    <span>Location</span>
  `;

  // Insert the button after the search button
  const searchButton = document.querySelector('.header-bottom-actions-btn[aria-label="Search"]');
  if (searchButton) {
    searchButton.parentNode.insertBefore(locationButton, searchButton.nextSibling);
  } else {
    headerActions.prepend(locationButton);
  }

  // Add event listener
  locationButton.addEventListener('click', function(e) {
    e.preventDefault();
    showLocationSearchModal();
  });
}

/**
 * Show location modal for a specific address
 * @param {string} address - The address to show on the map
 */
function showLocationModal(address) {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'location-modal';
  modal.innerHTML = `
    <div class="location-modal-content">
      <div class="location-modal-header">
        <h3>Property Location</h3>
        <button class="location-modal-close">&times;</button>
      </div>
      <div class="location-modal-body">
        <div class="location-address">
          <ion-icon name="location"></ion-icon>
          <p>${address}</p>
        </div>
        <div class="location-map" id="property-map">
          <div class="map-loading">Loading map...</div>
        </div>
        <div class="location-actions">
          <button class="btn get-directions-btn">
            <ion-icon name="navigate-outline"></ion-icon>
            Get Directions
          </button>
          <button class="btn nearby-properties-btn">
            <ion-icon name="home-outline"></ion-icon>
            Nearby Properties
          </button>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.appendChild(modal);

  // Add event listeners
  const closeButton = modal.querySelector('.location-modal-close');
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

  // Get directions button
  const directionsButton = modal.querySelector('.get-directions-btn');
  directionsButton.addEventListener('click', () => {
    // Open Google Maps directions in a new tab
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  });

  // Nearby properties button
  const nearbyButton = modal.querySelector('.nearby-properties-btn');
  nearbyButton.addEventListener('click', () => {
    modal.remove();
    filterPropertiesByLocation(address);
  });

  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);

  // Initialize map (if Google Maps API is available)
  initializeMap(address);
}

/**
 * Show location search modal
 */
function showLocationSearchModal() {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'location-modal';
  modal.innerHTML = `
    <div class="location-modal-content">
      <div class="location-modal-header">
        <h3>Find Properties by Location</h3>
        <button class="location-modal-close">&times;</button>
      </div>
      <div class="location-modal-body">
        <div class="location-search-container">
          <div class="location-search-input-container">
            <ion-icon name="search-outline"></ion-icon>
            <input type="text" id="location-search-input" placeholder="Enter city, neighborhood, or address">
            <button class="clear-search-btn" id="clear-location-search">&times;</button>
          </div>
          <button class="btn use-current-location-btn">
            <ion-icon name="locate-outline"></ion-icon>
            Use My Current Location
          </button>
        </div>
        <div class="recent-locations">
          <h4>Recent Locations</h4>
          <ul class="recent-locations-list" id="recent-locations-list">
            <!-- Recent locations will be added here dynamically -->
          </ul>
        </div>
        <div class="popular-locations">
          <h4>Popular Locations</h4>
          <div class="popular-locations-grid">
            <button class="popular-location-btn" data-location="New York, NY">New York</button>
            <button class="popular-location-btn" data-location="Los Angeles, CA">Los Angeles</button>
            <button class="popular-location-btn" data-location="Chicago, IL">Chicago</button>
            <button class="popular-location-btn" data-location="Miami, FL">Miami</button>
            <button class="popular-location-btn" data-location="San Francisco, CA">San Francisco</button>
            <button class="popular-location-btn" data-location="Seattle, WA">Seattle</button>
          </div>
        </div>
      </div>
      <div class="location-modal-footer">
        <button class="btn search-location-btn" disabled>Search Properties</button>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.appendChild(modal);

  // Add event listeners
  const closeButton = modal.querySelector('.location-modal-close');
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

  // Location search input
  const searchInput = modal.querySelector('#location-search-input');
  const searchButton = modal.querySelector('.search-location-btn');
  const clearButton = modal.querySelector('#clear-location-search');

  // Enable/disable search button based on input
  searchInput.addEventListener('input', () => {
    searchButton.disabled = searchInput.value.trim() === '';
  });

  // Clear search input
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    searchButton.disabled = true;
  });

  // Search button
  searchButton.addEventListener('click', () => {
    const location = searchInput.value.trim();
    if (location) {
      addToRecentLocations(location);
      modal.remove();
      filterPropertiesByLocation(location);
    }
  });

  // Use current location button
  const currentLocationButton = modal.querySelector('.use-current-location-btn');
  currentLocationButton.addEventListener('click', () => {
    currentLocationButton.disabled = true;
    currentLocationButton.innerHTML = '<ion-icon name="locate-outline"></ion-icon> Getting location...';
    
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success
          const { latitude, longitude } = position.coords;
          reverseGeocode(latitude, longitude, (address) => {
            searchInput.value = address;
            searchButton.disabled = false;
            currentLocationButton.disabled = false;
            currentLocationButton.innerHTML = '<ion-icon name="locate-outline"></ion-icon> Use My Current Location';
          });
        },
        (error) => {
          // Error
          console.error('Geolocation error:', error);
          showNotification('Could not get your location. Please check your browser settings.', 'error');
          currentLocationButton.disabled = false;
          currentLocationButton.innerHTML = '<ion-icon name="locate-outline"></ion-icon> Use My Current Location';
        }
      );
    } else {
      showNotification('Geolocation is not supported by your browser.', 'error');
      currentLocationButton.disabled = false;
      currentLocationButton.innerHTML = '<ion-icon name="locate-outline"></ion-icon> Use My Current Location';
    }
  });

  // Popular location buttons
  const popularLocationButtons = modal.querySelectorAll('.popular-location-btn');
  popularLocationButtons.forEach(button => {
    button.addEventListener('click', () => {
      const location = button.dataset.location;
      searchInput.value = location;
      searchButton.disabled = false;
    });
  });

  // Load and display recent locations
  loadRecentLocations();

  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
}

/**
 * Initialize map for a specific address
 * @param {string} address - The address to show on the map
 */
function initializeMap(address) {
  // Check if Google Maps API is available
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    // If not available, show a message
    const mapContainer = document.getElementById('property-map');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div class="map-error">
          <p>Map could not be loaded.</p>
          <p>You can still <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}" target="_blank">view this location on Google Maps</a>.</p>
        </div>
      `;
    }
    return;
  }

  // Get the map container
  const mapContainer = document.getElementById('property-map');
  if (!mapContainer) return;

  // Geocode the address to get coordinates
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const location = results[0].geometry.location;
      
      // Create the map
      const map = new google.maps.Map(mapContainer, {
        center: location,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: true,
      });

      // Add a marker
      const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: address,
        animation: google.maps.Animation.DROP
      });

      // Add an info window
      const infoWindow = new google.maps.InfoWindow({
        content: `<div class="map-info-window"><p>${address}</p></div>`
      });

      // Show info window when marker is clicked
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Open info window by default
      infoWindow.open(map, marker);
    } else {
      // If geocoding fails, show an error message
      mapContainer.innerHTML = `
        <div class="map-error">
          <p>Could not find this location on the map.</p>
          <p>You can still <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}" target="_blank">search for it on Google Maps</a>.</p>
        </div>
      `;
    }
  });
}

/**
 * Reverse geocode coordinates to get an address
 * @param {number} latitude - The latitude
 * @param {number} longitude - The longitude
 * @param {function} callback - Callback function to receive the address
 */
function reverseGeocode(latitude, longitude, callback) {
  // Check if Google Maps API is available
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    // If not available, use a fallback
    callback(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    return;
  }

  // Use Google Maps Geocoder
  const geocoder = new google.maps.Geocoder();
  const latlng = { lat: latitude, lng: longitude };

  geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === 'OK' && results[0]) {
      // Get the formatted address
      const address = results[0].formatted_address;
      callback(address);
    } else {
      // If geocoding fails, return the coordinates
      callback(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    }
  });
}

/**
 * Filter properties by location
 * @param {string} location - The location to filter by
 */
function filterPropertiesByLocation(location) {
  // Add to recent locations
  addToRecentLocations(location);

  // Get all property cards
  const propertyCards = document.querySelectorAll('.property-card');
  if (propertyCards.length === 0) {
    showNotification('No properties found.', 'info');
    return;
  }

  // Normalize the search location
  const searchLocation = location.toLowerCase();

  // Count of matching properties
  let matchCount = 0;

  // Filter properties
  propertyCards.forEach(card => {
    const cardLocation = card.querySelector('.banner-actions-btn address')?.textContent.trim().toLowerCase() || '';
    
    // Check if the card location contains the search location or vice versa
    const isMatch = cardLocation.includes(searchLocation) || searchLocation.includes(cardLocation);
    
    if (isMatch) {
      card.style.display = 'block';
      matchCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Update the section title
  const sectionTitle = document.querySelector('#property .section-title');
  if (sectionTitle) {
    sectionTitle.textContent = `Properties in ${location}`;
  }

  // Show a message if no properties match
  const propertyList = document.querySelector('.property-list');
  let noPropertiesMessage = document.querySelector('.no-properties-message');
  
  if (matchCount === 0) {
    if (!noPropertiesMessage) {
      noPropertiesMessage = document.createElement('div');
      noPropertiesMessage.className = 'no-properties-message';
      propertyList.parentNode.insertBefore(noPropertiesMessage, propertyList.nextSibling);
    }
    
    noPropertiesMessage.textContent = `No properties found in ${location}.`;
    noPropertiesMessage.style.display = 'block';
  } else if (noPropertiesMessage) {
    noPropertiesMessage.style.display = 'none';
  }

  // Add a "Show All" button if it doesn't exist
  let showAllButton = document.querySelector('.show-all-properties');
  if (!showAllButton) {
    showAllButton = document.createElement('button');
    showAllButton.className = 'btn show-all-properties';
    showAllButton.textContent = 'Show All Properties';
    showAllButton.addEventListener('click', resetPropertyFilters);
    
    const propertyContainer = document.querySelector('#property .container');
    if (propertyContainer) {
      propertyContainer.appendChild(showAllButton);
    }
  }
  
  showAllButton.style.display = 'block';

  // Scroll to the property section
  const propertySection = document.getElementById('property');
  if (propertySection) {
    propertySection.scrollIntoView({ behavior: 'smooth' });
  }

  // Show a notification
  showNotification(`Showing ${matchCount} properties in ${location}.`, 'success');
}

/**
 * Reset property filters to show all properties
 */
function resetPropertyFilters() {
  // Show all property cards
  const propertyCards = document.querySelectorAll('.property-card');
  propertyCards.forEach(card => {
    card.style.display = 'block';
  });
  
  // Reset the section title
  const sectionTitle = document.querySelector('#property .section-title');
  if (sectionTitle) {
    sectionTitle.textContent = 'Featured Listings';
  }
  
  // Hide the "No properties" message
  const noPropertiesMessage = document.querySelector('.no-properties-message');
  if (noPropertiesMessage) {
    noPropertiesMessage.style.display = 'none';
  }
  
  // Hide the "Show All" button
  const showAllButton = document.querySelector('.show-all-properties');
  if (showAllButton) {
    showAllButton.style.display = 'none';
  }
}

/**
 * Add a location to recent locations
 * @param {string} location - The location to add
 */
function addToRecentLocations(location) {
  // Get recent locations from localStorage
  const recentLocations = getRecentLocations();
  
  // Check if the location is already in the list
  const index = recentLocations.indexOf(location);
  if (index !== -1) {
    // If it is, remove it (to add it to the top)
    recentLocations.splice(index, 1);
  }
  
  // Add the location to the top of the list
  recentLocations.unshift(location);
  
  // Keep only the 5 most recent locations
  const updatedLocations = recentLocations.slice(0, 5);
  
  // Save to localStorage
  localStorage.setItem('recentLocations', JSON.stringify(updatedLocations));
}

/**
 * Get recent locations from localStorage
 * @returns {Array} - Array of recent locations
 */
function getRecentLocations() {
  const recentLocations = localStorage.getItem('recentLocations');
  return recentLocations ? JSON.parse(recentLocations) : [];
}

/**
 * Load and display recent locations
 */
function loadRecentLocations() {
  const recentLocationsList = document.getElementById('recent-locations-list');
  if (!recentLocationsList) return;
  
  // Clear the list
  recentLocationsList.innerHTML = '';
  
  // Get recent locations
  const recentLocations = getRecentLocations();
  
  // If there are no recent locations, hide the section
  const recentLocationsSection = recentLocationsList.closest('.recent-locations');
  if (recentLocationsSection) {
    recentLocationsSection.style.display = recentLocations.length > 0 ? 'block' : 'none';
  }
  
  // Add each location to the list
  recentLocations.forEach(location => {
    const listItem = document.createElement('li');
    listItem.className = 'recent-location-item';
    listItem.innerHTML = `
      <button class="recent-location-btn">
        <ion-icon name="time-outline"></ion-icon>
        <span>${location}</span>
      </button>
    `;
    
    // Add event listener
    const button = listItem.querySelector('.recent-location-btn');
    button.addEventListener('click', () => {
      const searchInput = document.getElementById('location-search-input');
      const searchButton = document.querySelector('.search-location-btn');
      
      if (searchInput && searchButton) {
        searchInput.value = location;
        searchButton.disabled = false;
      }
    });
    
    recentLocationsList.appendChild(listItem);
  });
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
  // Check if notification container exists, create if not
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'notification-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });
  
  notification.appendChild(closeBtn);
  notificationContainer.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

// Export functions for use in other files
window.locationFunctions = {
  showLocationModal,
  showLocationSearchModal,
  filterPropertiesByLocation
}; 