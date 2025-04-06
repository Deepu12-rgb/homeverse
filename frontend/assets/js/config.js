/**
 * Configuration settings for the Homeverse application
 */

// Site configuration
const SITE_CONFIG = {
  siteName: 'Homeverse',
  apiBaseUrl: 'https://api.homeverse.example.com',
  imageBaseUrl: './assets/images/',
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  defaultCurrency: 'USD',
  currencySymbol: '$'
};

// API Keys (In production, these should be kept server-side)
const API_KEYS = {
  // Matterport 3D scanning API
  matterport: {
    apiKey: 'YOUR_MATTERPORT_API_KEY',
    sdkKey: 'YOUR_MATTERPORT_SDK_KEY'
  },
  // Google Maps API
  googleMaps: 'YOUR_GOOGLE_MAPS_API_KEY',
  // Optional: Other services you might integrate
  stripe: 'YOUR_STRIPE_PUBLIC_KEY'
};

// Feature flags
const FEATURES = {
  enable3DModels: true,
  enableVirtualTours: true,
  enableARView: true,
  enableMortgageCalculator: true,
  enableLiveChat: false
};

// Export configurations
window.HOMEVERSE_CONFIG = {
  site: SITE_CONFIG,
  apiKeys: API_KEYS,
  features: FEATURES
};

// Configuration for the frontend
const config = {
  // API base URL - Change this to your backend server URL
  apiUrl: 'http://localhost:5000/api',
  
  // Flag to check if we're running from a server or directly from file system
  isDirectFileAccess: window.location.protocol === 'file:'
};

// If running directly from file system, provide instructions
if (config.isDirectFileAccess) {
  console.warn('Running directly from file system. Some features may not work properly.');
  console.warn('For full functionality, please run the application using the server.');
  
  // Add a warning banner when loaded directly from file system
  document.addEventListener('DOMContentLoaded', function() {
    const warningBanner = document.createElement('div');
    warningBanner.style.backgroundColor = '#fff3cd';
    warningBanner.style.color = '#856404';
    warningBanner.style.padding = '10px';
    warningBanner.style.margin = '0';
    warningBanner.style.textAlign = 'center';
    warningBanner.style.position = 'fixed';
    warningBanner.style.top = '0';
    warningBanner.style.left = '0';
    warningBanner.style.right = '0';
    warningBanner.style.zIndex = '9999';
    warningBanner.style.fontSize = '14px';
    warningBanner.innerHTML = `
      <strong>Warning:</strong> Running directly from file system. For full functionality, please run the application using the server.
      <button id="dismiss-warning" style="margin-left: 10px; padding: 2px 8px; background: #856404; color: white; border: none; border-radius: 4px; cursor: pointer;">Dismiss</button>
    `;
    document.body.prepend(warningBanner);
    
    document.getElementById('dismiss-warning').addEventListener('click', function() {
      warningBanner.style.display = 'none';
    });
  });
}

// Export the config object
window.config = config; 