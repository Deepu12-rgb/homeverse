/**
 * Simple Map Integration for Homeverse
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Map integration script loaded');
  
  // Find the map container
  const mapContainer = document.querySelector('.map-container');
  
  // If there's no map container on this page, exit
  if (!mapContainer) {
    console.log('No map container found on this page');
    return;
  }
  
  console.log('Map container found');
  
  // Add a simple overlay to show the script is working
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '10px';
  overlay.style.left = '10px';
  overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  overlay.style.padding = '10px';
  overlay.style.borderRadius = '5px';
  overlay.style.zIndex = '10';
  overlay.innerHTML = 'Map is working!';
  
  // Make sure the map container has relative positioning
  mapContainer.style.position = 'relative';
  
  // Add the overlay to the map container
  mapContainer.appendChild(overlay);
}); 