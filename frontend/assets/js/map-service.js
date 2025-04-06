/**
 * Homeverse Map Service
 * Provides map functionality for property location display and selection
 */

// Map configuration constants
const MAP_CONFIG = {
  defaultZoom: 14,
  defaultCenter: { lat: 40.7128, lng: -74.0060 }, // New York City as default
  styles: [
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [{"color": "#444444"}]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{"color": "#f2f2f2"}]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{"saturation": -100}, {"lightness": 45}]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [{"visibility": "simplified"}]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{"visibility": "off"}]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{"color": "#c4e5f9"}, {"visibility": "on"}]
    }
  ]
};

/**
 * Map Service Class
 */
class MapService {
  constructor() {
    this.maps = [];
    this.markers = {};
    this.infoWindows = {};
    
    // Initialize maps when Google Maps API is loaded
    window.initGoogleMaps = () => this.initializeMaps();
    
    // Load Google Maps API if not already loaded
    if (!window.google || !window.google.maps) {
      this.loadGoogleMapsAPI();
    } else {
      this.initializeMaps();
    }
  }
  
  /**
   * Load Google Maps API dynamically
   */
  loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initGoogleMaps&libraries=places";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
  
  /**
   * Initialize all maps on the page
   */
  initializeMaps() {
    // Initialize property details map if exists
    const propertyLocationMap = document.getElementById('property-location-map');
    if (propertyLocationMap) {
      this.initializePropertyMap(propertyLocationMap);
    }
    
    // Initialize property listing map if exists
    const propertiesMap = document.getElementById('properties-map');
    if (propertiesMap) {
      this.initializePropertiesMap(propertiesMap);
    }
    
    // Initialize location picker if exists
    const locationPicker = document.getElementById('property-location-picker');
    if (locationPicker) {
      this.initializeLocationPicker(locationPicker);
    }
  }
  
  /**
   * Initialize single property map
   */
  initializePropertyMap(mapElement) {
    const propertyId = mapElement.dataset.propertyId;
    const lat = parseFloat(mapElement.dataset.lat) || MAP_CONFIG.defaultCenter.lat;
    const lng = parseFloat(mapElement.dataset.lng) || MAP_CONFIG.defaultCenter.lng;
    const title = mapElement.dataset.title || 'Property Location';
    
    const mapOptions = {
      zoom: MAP_CONFIG.defaultZoom,
      center: { lat, lng },
      styles: MAP_CONFIG.styles,
      mapTypeControl: false,
      scrollwheel: false,
      zoomControl: true,
      streetViewControl: true,
      fullscreenControl: true
    };
    
    // Create map
    const map = new google.maps.Map(mapElement, mapOptions);
    this.maps.push(map);
    
    // Add marker
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: {
        url: './assets/images/map-marker.png',
        scaledSize: new google.maps.Size(40, 40)
      }
    });
    
    this.markers[propertyId] = marker;
    
    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `<div class="map-info-window"><h4>${title}</h4><p>${mapElement.dataset.address || ''}</p></div>`
    });
    
    this.infoWindows[propertyId] = infoWindow;
    
    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(map, marker);
    });
  }
  
  /**
   * Initialize properties map for showing multiple properties
   */
  initializePropertiesMap(mapElement) {
    const mapOptions = {
      zoom: 12,
      center: MAP_CONFIG.defaultCenter,
      styles: MAP_CONFIG.styles,
      mapTypeControl: false,
      scrollwheel: false,
      zoomControl: true,
      streetViewControl: true,
      fullscreenControl: true
    };
    
    // Create map
    const map = new google.maps.Map(mapElement, mapOptions);
    this.maps.push(map);
    
    // Add markers from property data if available
    if (window.propertyData && window.propertyData.length) {
      window.propertyData.forEach(property => {
        if (property.lat && property.lng) {
          this.addPropertyMarker(map, property);
        }
      });
      
      // Fit bounds to show all markers
      this.fitMapToMarkers(map);
    }
    
    // Add event listener for property cards hover
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const propertyId = card.dataset.propertyId;
        if (this.markers[propertyId]) {
          this.highlightMarker(propertyId);
        }
      });
      
      card.addEventListener('mouseleave', () => {
        const propertyId = card.dataset.propertyId;
        if (this.markers[propertyId]) {
          this.unhighlightMarker(propertyId);
        }
      });
    });
  }
  
  /**
   * Initialize location picker for adding/editing property
   */
  initializeLocationPicker(mapElement) {
    const mapOptions = {
      zoom: MAP_CONFIG.defaultZoom,
      center: MAP_CONFIG.defaultCenter,
      styles: MAP_CONFIG.styles,
      mapTypeControl: true,
      scrollwheel: true,
      zoomControl: true,
      streetViewControl: true,
      fullscreenControl: true
    };
    
    // Create map
    const map = new google.maps.Map(mapElement, mapOptions);
    this.maps.push(map);
    
    // Create marker
    const marker = new google.maps.Marker({
      position: MAP_CONFIG.defaultCenter,
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP
    });
    
    // Update form fields with marker position
    const updateMarkerPosition = (position) => {
      const latInput = document.getElementById('property-latitude');
      const lngInput = document.getElementById('property-longitude');
      
      if (latInput && lngInput) {
        latInput.value = position.lat().toFixed(6);
        lngInput.value = position.lng().toFixed(6);
      }
    };
    
    // Initialize with existing values if available
    const latInput = document.getElementById('property-latitude');
    const lngInput = document.getElementById('property-longitude');
    if (latInput && lngInput && latInput.value && lngInput.value) {
      const position = {
        lat: parseFloat(latInput.value),
        lng: parseFloat(lngInput.value)
      };
      marker.setPosition(position);
      map.setCenter(position);
    }
    
    // Add event listeners for marker drag
    google.maps.event.addListener(marker, 'dragend', function() {
      updateMarkerPosition(marker.getPosition());
    });
    
    // Allow clicking on map to move marker
    google.maps.event.addListener(map, 'click', function(event) {
      marker.setPosition(event.latLng);
      updateMarkerPosition(event.latLng);
    });
    
    // Add search box for location
    const addressInput = document.getElementById('property-address');
    if (addressInput) {
      const autocomplete = new google.maps.places.Autocomplete(addressInput);
      autocomplete.bindTo('bounds', map);
      
      autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) {
          return;
        }
        
        // If the place has a geometry, center the map
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }
        
        // Set marker position
        marker.setPosition(place.geometry.location);
        updateMarkerPosition(place.geometry.location);
        
        // Fill in address components
        fillAddressComponents(place);
      });
    }
    
    // Fill address components from place
    function fillAddressComponents(place) {
      const cityInput = document.getElementById('property-city');
      const stateInput = document.getElementById('property-state');
      const zipInput = document.getElementById('property-zip');
      const countryInput = document.getElementById('property-country');
      const neighborhoodInput = document.getElementById('property-neighborhood');
      
      if (place.address_components) {
        // Reset fields
        if (cityInput) cityInput.value = '';
        if (stateInput) stateInput.value = '';
        if (zipInput) zipInput.value = '';
        if (countryInput) countryInput.value = '';
        if (neighborhoodInput) neighborhoodInput.value = '';
        
        // Fill with new values
        place.address_components.forEach(component => {
          const types = component.types;
          
          if (types.includes('locality') && cityInput) {
            cityInput.value = component.long_name;
          }
          
          if (types.includes('administrative_area_level_1') && stateInput) {
            stateInput.value = component.long_name;
          }
          
          if (types.includes('postal_code') && zipInput) {
            zipInput.value = component.long_name;
          }
          
          if (types.includes('country') && countryInput) {
            countryInput.value = component.long_name;
          }
          
          if (types.includes('neighborhood') && neighborhoodInput) {
            neighborhoodInput.value = component.long_name;
          }
        });
      }
    }
  }
  
  /**
   * Add property marker to map
   */
  addPropertyMarker(map, property) {
    const marker = new google.maps.Marker({
      position: { lat: parseFloat(property.lat), lng: parseFloat(property.lng) },
      map: map,
      title: property.title,
      propertyId: property.id,
      animation: google.maps.Animation.DROP,
      icon: {
        url: './assets/images/map-marker.png',
        scaledSize: new google.maps.Size(40, 40)
      }
    });
    
    this.markers[property.id] = marker;
    
    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="map-info-window">
          <div class="property-info-image">
            <img src="${property.image}" alt="${property.title}">
            <span class="property-status ${property.status.toLowerCase()}">${property.status}</span>
          </div>
          <div class="property-info-content">
            <h4>${property.title}</h4>
            <p class="property-info-price">$${property.price.toLocaleString()}</p>
            <p class="property-info-address">${property.address}</p>
            <a href="property-details.html?id=${property.id}" class="btn property-info-btn">View Details</a>
          </div>
        </div>
      `
    });
    
    this.infoWindows[property.id] = infoWindow;
    
    // Add click event
    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(map, marker);
    });
    
    return marker;
  }
  
  /**
   * Highlight marker when hovering on property card
   */
  highlightMarker(propertyId) {
    const marker = this.markers[propertyId];
    if (marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
      
      // Stop bouncing after 1.5 seconds
      setTimeout(() => {
        marker.setAnimation(null);
      }, 1500);
    }
  }
  
  /**
   * Stop highlighting marker
   */
  unhighlightMarker(propertyId) {
    const marker = this.markers[propertyId];
    if (marker) {
      marker.setAnimation(null);
      marker.setZIndex(null);
    }
  }
  
  /**
   * Close all info windows
   */
  closeAllInfoWindows() {
    Object.values(this.infoWindows).forEach(infoWindow => {
      infoWindow.close();
    });
  }
  
  /**
   * Fit map to show all markers
   */
  fitMapToMarkers(map) {
    const bounds = new google.maps.LatLngBounds();
    Object.values(this.markers).forEach(marker => {
      bounds.extend(marker.getPosition());
    });
    map.fitBounds(bounds);
    
    // Don't zoom in too far
    const listener = google.maps.event.addListener(map, 'idle', function() {
      if (map.getZoom() > 16) {
        map.setZoom(16);
      }
      google.maps.event.removeListener(listener);
    });
  }
  
  /**
   * Filter map markers based on criteria
   */
  filterMarkers(criteria) {
    Object.values(this.markers).forEach(marker => {
      let visible = true;
      
      // Property data
      const propertyData = window.propertyData.find(p => p.id === marker.propertyId);
      
      if (!propertyData) return;
      
      // Apply filters
      if (criteria.type && criteria.type !== 'all' && propertyData.type !== criteria.type) {
        visible = false;
      }
      
      if (criteria.status && criteria.status !== 'all' && propertyData.status !== criteria.status) {
        visible = false;
      }
      
      if (criteria.minPrice && propertyData.price < criteria.minPrice) {
        visible = false;
      }
      
      if (criteria.maxPrice && propertyData.price > criteria.maxPrice) {
        visible = false;
      }
      
      // Show/hide marker
      marker.setVisible(visible);
    });
  }
  
  /**
   * Update map with new property data
   */
  updatePropertiesMap(propertyData) {
    // Clear existing markers
    Object.values(this.markers).forEach(marker => {
      marker.setMap(null);
    });
    
    this.markers = {};
    this.infoWindows = {};
    
    // Add new markers
    const propertiesMap = document.getElementById('properties-map');
    if (propertiesMap && propertyData.length) {
      const map = this.maps.find(m => m.getDiv() === propertiesMap);
      
      if (map) {
        propertyData.forEach(property => {
          if (property.lat && property.lng) {
            this.addPropertyMarker(map, property);
          }
        });
        
        this.fitMapToMarkers(map);
      }
    }
  }
}

// Initialize map service
document.addEventListener('DOMContentLoaded', () => {
  window.mapService = new MapService();
}); 