/**
 * Property 3D Model Generator
 * This script handles video uploads and 3D model generation for property listings
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a page with the video upload form
  const videoUploadForm = document.getElementById('video-upload-form');
  if (!videoUploadForm) return;

  // Initialize the file upload component
  initializeFileUpload();
  
  // Handle form submission
  videoUploadForm.addEventListener('submit', handleVideoUpload);
  
  // Initialize 3D viewer if available on the page
  const modelViewer = document.querySelector('model-viewer');
  if (modelViewer) {
    initializeModelViewer(modelViewer);
  }
});

/**
 * Initialize the file upload component with preview
 */
function initializeFileUpload() {
  const fileInput = document.getElementById('property-video');
  const previewContainer = document.getElementById('video-preview');
  const uploadButton = document.getElementById('upload-button');
  const progressBar = document.getElementById('upload-progress');
  const statusMessage = document.getElementById('upload-status');
  
  // Show preview when a file is selected
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if the file is a video
    if (!file.type.match('video.*')) {
      statusMessage.textContent = 'Please select a video file.';
      statusMessage.className = 'error-message';
      return;
    }
    
    // Create video preview
    previewContainer.innerHTML = '';
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.controls = true;
    video.style.width = '100%';
    video.style.borderRadius = '8px';
    previewContainer.appendChild(video);
    
    // Show upload button
    uploadButton.style.display = 'block';
    statusMessage.textContent = 'Video ready to upload.';
    statusMessage.className = 'info-message';
  });
}

/**
 * Handle video upload and 3D model generation
 */
function handleVideoUpload(e) {
  e.preventDefault();
  
  const fileInput = document.getElementById('property-video');
  const progressBar = document.getElementById('upload-progress');
  const statusMessage = document.getElementById('upload-status');
  const modelContainer = document.getElementById('model-container');
  const propertyId = document.getElementById('property-id').value;
  
  // Check if a file is selected
  if (!fileInput.files.length) {
    statusMessage.textContent = 'Please select a video file.';
    statusMessage.className = 'error-message';
    return;
  }
  
  const file = fileInput.files[0];
  
  // Simulate upload progress
  statusMessage.textContent = 'Uploading video...';
  statusMessage.className = 'info-message';
  progressBar.style.display = 'block';
  
  simulateUploadProgress(progressBar, function() {
    // After upload is complete, simulate 3D model generation
    statusMessage.textContent = 'Generating 3D model...';
    
    setTimeout(function() {
      // Simulate model generation complete
      statusMessage.textContent = '3D model generated successfully!';
      statusMessage.className = 'success-message';
      
      // Show the 3D model viewer
      modelContainer.style.display = 'block';
      
      // Create model viewer element if it doesn't exist
      if (!document.querySelector('model-viewer')) {
        createModelViewer(modelContainer, propertyId);
      }
      
      // Add the model to the property listing
      if (window.updatePropertyWithModel) {
        window.updatePropertyWithModel(propertyId);
      }
    }, 3000);
  });
}

/**
 * Simulate upload progress for demonstration
 */
function simulateUploadProgress(progressBar, callback) {
  let progress = 0;
  const interval = setInterval(function() {
    progress += 5;
    progressBar.value = progress;
    
    if (progress >= 100) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 200);
}

/**
 * Create a model viewer element
 */
function createModelViewer(container, propertyId) {
  // Load the model-viewer library if not already loaded
  if (!document.querySelector('script[src*="model-viewer"]')) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.type = 'module';
    document.head.appendChild(script);
  }
  
  // Create the model viewer element
  const modelViewer = document.createElement('model-viewer');
  modelViewer.src = `./assets/models/property-${propertyId}.glb`;
  modelViewer.alt = 'A 3D model of the property';
  modelViewer.setAttribute('camera-controls', '');
  modelViewer.setAttribute('auto-rotate', '');
  modelViewer.setAttribute('ar', '');
  modelViewer.style.width = '100%';
  modelViewer.style.height = '400px';
  modelViewer.style.borderRadius = '8px';
  modelViewer.style.backgroundColor = '#f5f5f5';
  
  // Add a poster image while the model loads
  modelViewer.setAttribute('poster', './assets/images/model-loading.png');
  
  // Add the model viewer to the container
  container.innerHTML = '';
  container.appendChild(modelViewer);
  
  // Add a fallback message for browsers that don't support model-viewer
  const fallback = document.createElement('div');
  fallback.textContent = 'Your browser does not support 3D models. Please try a different browser.';
  fallback.style.display = 'none';
  modelViewer.appendChild(fallback);
  
  return modelViewer;
}

/**
 * Initialize an existing model viewer
 */
function initializeModelViewer(modelViewer) {
  // Add event listeners for model viewer
  modelViewer.addEventListener('load', function() {
    console.log('3D model loaded successfully');
  });
  
  modelViewer.addEventListener('error', function(error) {
    console.error('Error loading 3D model:', error);
    modelViewer.style.display = 'none';
    
    // Show error message
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.textContent = 'Failed to load 3D model. Please try again later.';
    modelViewer.parentNode.appendChild(errorContainer);
  });
}

/**
 * Update property listing with 3D model
 */
window.updatePropertyWithModel = function(propertyId) {
  // In a real application, this would make an API call to update the property
  console.log(`Property ${propertyId} updated with 3D model`);
  
  // If we're on the property details page, update the UI
  const propertyDetails = document.querySelector('.property-details');
  if (propertyDetails) {
    // Add a badge to indicate 3D model is available
    const badge = document.createElement('span');
    badge.className = 'property-badge';
    badge.textContent = '3D Model';
    badge.style.backgroundColor = '#f85a40';
    badge.style.color = 'white';
    badge.style.padding = '5px 10px';
    badge.style.borderRadius = '4px';
    badge.style.fontSize = '12px';
    badge.style.fontWeight = 'bold';
    badge.style.marginLeft = '10px';
    
    const propertyTitle = propertyDetails.querySelector('.property-title');
    if (propertyTitle) {
      propertyTitle.appendChild(badge);
    }
  }
}; 