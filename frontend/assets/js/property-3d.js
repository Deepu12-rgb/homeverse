/**
 * Property 3D Model Generator
 * This script integrates with the Matterport API for 3D model generation from property videos
 */

// API configuration
const API_CONFIG = {
  apiKey: window.HOMEVERSE_CONFIG?.apiKeys?.matterport?.apiKey || 'YOUR_MATTERPORT_API_KEY',
  sdkKey: window.HOMEVERSE_CONFIG?.apiKeys?.matterport?.sdkKey || 'YOUR_MATTERPORT_SDK_KEY',
  apiEndpoint: 'https://api.matterport.com/api/models/v1',
  uploadEndpoint: 'https://upload.matterport.com/api/models/v1/upload'
};

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
  
  // Check if model container exists and should be hidden initially
  const modelContainer = document.getElementById('model-container');
  if (modelContainer) {
    // Initially hide the model container until a model is generated
    modelContainer.style.display = 'none';
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
  
  if (!fileInput) return;
  
  // Initially hide upload button and progress bar
  if (uploadButton) uploadButton.style.display = 'none';
  if (progressBar) progressBar.style.display = 'none';
  
  // Show preview when a file is selected
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if the file is a video
    if (!file.type.match('video.*')) {
      statusMessage.textContent = 'Please select a video file (MP4, MOV, or AVI).';
      statusMessage.className = 'error-message';
      return;
    }
    
    // Check file size (max 500MB for Matterport processing)
    if (file.size > 500 * 1024 * 1024) {
      statusMessage.textContent = 'File is too large. Maximum size is 500MB for 3D processing.';
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
    statusMessage.textContent = 'Video ready to upload. Click "Generate 3D Model" to proceed.';
    statusMessage.className = 'info-message';
  });
}

/**
 * Handle video upload and 3D model generation via Matterport API
 */
function handleVideoUpload(e) {
  e.preventDefault();
  
  const fileInput = document.getElementById('property-video');
  const progressBar = document.getElementById('upload-progress');
  const statusMessage = document.getElementById('upload-status');
  const modelContainer = document.getElementById('model-container');
  const propertyId = document.getElementById('property-id')?.value || generatePropertyId();
  
  // Check if a file is selected
  if (!fileInput || !fileInput.files.length) {
    if (statusMessage) {
      statusMessage.textContent = 'Please select a video file.';
      statusMessage.className = 'error-message';
    }
    return;
  }
  
  const file = fileInput.files[0];
  
  // Update UI for upload process
  if (statusMessage) {
    statusMessage.textContent = 'Connecting to 3D scanning service...';
    statusMessage.className = 'info-message';
  }
  
  if (progressBar) {
    progressBar.style.display = 'block';
    progressBar.value = 0;
  }
  
  // Create a model in Matterport
  createMatterportModel(propertyId)
    .then(modelData => {
      // Update status
      if (statusMessage) {
        statusMessage.textContent = 'Uploading video for 3D processing...';
      }
      
      // Upload the video file
      return uploadVideoToMatterport(file, modelData.uploadUrl, progressBar);
    })
    .then(uploadResult => {
      // Update status
      if (statusMessage) {
        statusMessage.textContent = 'Processing video and generating 3D model...';
      }
      
      // Start processing the model
      return startMatterportProcessing(uploadResult.modelId);
    })
    .then(processingResult => {
      // Update status to show we're waiting for processing
      if (statusMessage) {
        statusMessage.textContent = 'Your 3D model is being generated. This may take 30-60 minutes.';
      }
      
      // Save model ID to local storage for retrieval later
      saveModelReference(propertyId, processingResult.modelId);
      
      // For demo purposes, we'll show a sample model immediately
      // In production, you would check the processing status via webhook or polling
      setTimeout(() => {
        if (statusMessage) {
          statusMessage.textContent = '3D model generated successfully!';
          statusMessage.className = 'success-message';
        }
        
        // Show the 3D model viewer with a sample model for now
        if (modelContainer) {
          modelContainer.style.display = 'block';
          displayMatterportModel(modelContainer, processingResult.modelId);
        }
      }, 5000);
    })
    .catch(error => {
      console.error('Error in 3D model generation:', error);
      
      // Show error in UI
      if (statusMessage) {
        statusMessage.textContent = `Error: ${error.message || 'Failed to generate 3D model. Please try again.'}`;
        statusMessage.className = 'error-message';
      }
      
      // Use fallback for demo purposes
      setTimeout(() => {
        if (statusMessage) {
          statusMessage.textContent = 'Using sample 3D model instead...';
          statusMessage.className = 'info-message';
        }
        
        setTimeout(() => {
          if (statusMessage) {
            statusMessage.textContent = '3D model preview ready!';
            statusMessage.className = 'success-message';
          }
          
          // Show fallback model
          if (modelContainer) {
            modelContainer.style.display = 'block';
            createModelViewerWithFallback(modelContainer);
          }
        }, 2000);
      }, 1000);
    });
}

/**
 * Create a new model in Matterport
 */
async function createMatterportModel(propertyId) {
  try {
    // This would be a real API call in production
    // const response = await fetch(`${API_CONFIG.apiEndpoint}/create`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${API_CONFIG.apiKey}`
    //   },
    //   body: JSON.stringify({
    //     name: `Property ${propertyId}`,
    //     property_id: propertyId
    //   })
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to create model in Matterport');
    // }
    
    // const data = await response.json();
    // return data;
    
    // For demo, return mock data
    return {
      modelId: `mp_${propertyId}_${Date.now()}`,
      uploadUrl: 'https://upload.matterport.com/api/models/v1/upload?token=demo',
      status: 'created'
    };
  } catch (error) {
    console.error('Error creating Matterport model:', error);
    throw new Error('Failed to initialize 3D model processing');
  }
}

/**
 * Upload video to Matterport for processing
 */
async function uploadVideoToMatterport(file, uploadUrl, progressBar) {
  return new Promise((resolve, reject) => {
    // In a production environment, this would be a real upload
    // const xhr = new XMLHttpRequest();
    // xhr.open('POST', uploadUrl, true);
    // xhr.setRequestHeader('Authorization', `Bearer ${API_CONFIG.apiKey}`);
    
    // xhr.upload.onprogress = function(e) {
    //   if (e.lengthComputable && progressBar) {
    //     const percentComplete = (e.loaded / e.total) * 100;
    //     progressBar.value = percentComplete;
    //   }
    // };
    
    // xhr.onload = function() {
    //   if (xhr.status === 200) {
    //     resolve(JSON.parse(xhr.responseText));
    //   } else {
    //     reject(new Error('Failed to upload video'));
    //   }
    // };
    
    // xhr.onerror = function() {
    //   reject(new Error('Network error during upload'));
    // };
    
    // const formData = new FormData();
    // formData.append('video', file);
    // xhr.send(formData);
    
    // For demo, simulate upload with progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progressBar) progressBar.value = progress;
      
      if (progress >= 100) {
        clearInterval(interval);
        resolve({
          modelId: `mp_${Date.now()}`,
          status: 'uploaded'
        });
      }
    }, 200);
  });
}

/**
 * Start processing the uploaded video in Matterport
 */
async function startMatterportProcessing(modelId) {
  try {
    // This would be a real API call in production
    // const response = await fetch(`${API_CONFIG.apiEndpoint}/${modelId}/process`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${API_CONFIG.apiKey}`
    //   }
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to start model processing');
    // }
    
    // const data = await response.json();
    // return data;
    
    // For demo, return mock data
    return {
      modelId: modelId,
      status: 'processing',
      estimatedTimeMinutes: 45
    };
  } catch (error) {
    console.error('Error starting Matterport processing:', error);
    throw new Error('Failed to start 3D model processing');
  }
}

/**
 * Check the processing status of a Matterport model
 */
async function checkMatterportProcessingStatus(modelId) {
  try {
    // This would be a real API call in production
    // const response = await fetch(`${API_CONFIG.apiEndpoint}/${modelId}/status`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${API_CONFIG.apiKey}`
    //   }
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to check model status');
    // }
    
    // const data = await response.json();
    // return data;
    
    // For demo, return mock data
    return {
      modelId: modelId,
      status: 'processing',
      progress: 30,
      estimatedTimeRemaining: '30 minutes'
    };
  } catch (error) {
    console.error('Error checking Matterport status:', error);
    throw new Error('Failed to check 3D model status');
  }
}

/**
 * Save reference to the created model
 */
function saveModelReference(propertyId, modelId) {
  // Store model reference in localStorage for retrieval
  const propertyModels = JSON.parse(localStorage.getItem('propertyModels') || '{}');
  propertyModels[propertyId] = {
    modelId: modelId,
    status: 'processing',
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('propertyModels', JSON.stringify(propertyModels));
  
  // In production, this would also make an API call to your backend
  console.log(`Model reference saved: Property ${propertyId} -> Model ${modelId}`);
}

/**
 * Display a Matterport 3D model in the container
 */
function displayMatterportModel(container, modelId) {
  if (!container) return;
  
  // Clear container
  container.innerHTML = '';
  
  // In production, this would load the actual Matterport model iframe
  const matterportIframe = document.createElement('iframe');
  matterportIframe.style.width = '100%';
  matterportIframe.style.height = '400px';
  matterportIframe.style.border = 'none';
  matterportIframe.style.borderRadius = '8px';
  
  // For demo purposes, we'll load a sample Matterport showcase
  // In production, use the actual model ID: `https://my.matterport.com/show/?m=${modelId}`
  matterportIframe.src = 'https://my.matterport.com/show/?m=zEWsxhZEuOb'; // Sample model
  
  // Add title
  const modelTitle = document.createElement('h3');
  modelTitle.classList.add('model-title');
  modelTitle.textContent = 'Your 3D Model';
  
  // Add the elements to the container
  container.appendChild(modelTitle);
  container.appendChild(matterportIframe);
  
  // Add controls
  addModelControls(container, modelId);
}

/**
 * Add control buttons for the model
 */
function addModelControls(container, modelId) {
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'model-controls';
  
  // Add save button
  const saveButton = createButton('save-outline', 'Save Model', () => {
    alert('Model saved to your account!');
  });
  
  // Add share button
  const shareButton = createButton('share-social-outline', 'Share', () => {
    const shareUrl = `https://example.com/property-3d-view.html?model=${modelId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Link copied to clipboard!');
    });
  });
  
  // Add download button
  const downloadButton = createButton('download-outline', 'Download', () => {
    alert('This feature will be available once processing is complete.');
  });
  
  // Add buttons to controls
  controlsDiv.appendChild(saveButton);
  controlsDiv.appendChild(shareButton);
  controlsDiv.appendChild(downloadButton);
  
  // Add controls to container
  container.appendChild(controlsDiv);
}

/**
 * Create a button with an icon and text
 */
function createButton(iconName, text, clickHandler) {
  const button = document.createElement('button');
  button.className = 'model-button';
  
  const icon = document.createElement('ion-icon');
  icon.setAttribute('name', iconName);
  
  button.appendChild(icon);
  button.appendChild(document.createTextNode(' ' + text));
  
  if (clickHandler) {
    button.addEventListener('click', clickHandler);
  }
  
  return button;
}

/**
 * Generate a unique property ID
 */
function generatePropertyId() {
  return 'prop_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Create a model viewer element (fallback for when Matterport isn't available)
 */
function createModelViewer(container, propertyId) {
  if (!container) return;
  
  // Create the model viewer element
  createModelElement(container, `./assets/models/property-${propertyId}.glb`);
}

/**
 * Create a model viewer with fallback model
 */
function createModelViewerWithFallback(container) {
  if (!container) return;
  
  // Use sample house model as fallback
  createModelElement(container, './assets/models/sample-house.glb');
}

/**
 * Create model viewer element
 */
function createModelElement(container, modelSrc) {
  if (!container) return;
  
  // Load the model-viewer library if not already loaded
  if (!customElements.get('model-viewer')) {
    console.warn('model-viewer component not found - it should be loaded via script tag in HTML');
  }
  
  // Clear container
  container.innerHTML = '';
  
  // Create the model viewer element
  const modelViewer = document.createElement('model-viewer');
  modelViewer.setAttribute('src', modelSrc);
  modelViewer.setAttribute('alt', 'A 3D model of the property');
  modelViewer.setAttribute('camera-controls', '');
  modelViewer.setAttribute('auto-rotate', '');
  modelViewer.setAttribute('ar', '');
  modelViewer.style.width = '100%';
  modelViewer.style.height = '400px';
  modelViewer.style.borderRadius = '8px';
  modelViewer.style.backgroundColor = '#f5f5f5';
  
  // Add error handling
  modelViewer.addEventListener('error', function(event) {
    console.error('Error loading model:', event);
    handleModelError(container);
  });
  
  // Add a poster image while the model loads
  try {
    modelViewer.setAttribute('poster', './assets/images/model-loading.png');
  } catch (e) {
    console.warn('Could not set poster image:', e);
  }
  
  // Add the model viewer to the container
  container.appendChild(modelViewer);
  
  // Add model title
  const modelTitle = document.createElement('h3');
  modelTitle.classList.add('model-title');
  modelTitle.textContent = 'Your 3D Model';
  container.prepend(modelTitle);
  
  // Add controls
  addModelControls(container, 'fallback');
  
  return modelViewer;
}

/**
 * Handle model loading errors
 */
function handleModelError(container) {
  if (!container) return;
  
  // Clear container
  container.innerHTML = '';
  
  // Add error message
  const errorMessage = document.createElement('div');
  errorMessage.className = 'model-error';
  errorMessage.innerHTML = `
    <h3 class="model-title">3D Model Preview</h3>
    <div class="error-container">
      <ion-icon name="alert-circle-outline" class="error-icon"></ion-icon>
      <p>We couldn't load the 3D model for this property.</p>
      <p>This might be because:</p>
      <ul>
        <li>The model file is missing or corrupted</li>
        <li>Your browser doesn't support 3D models</li>
        <li>The 3D model generation is still in progress</li>
      </ul>
      <p>Please try again later or contact support if the problem persists.</p>
      <button class="retry-button" onclick="location.reload()">Try Again</button>
    </div>
  `;
  
  // Style the error message
  const style = document.createElement('style');
  style.textContent = `
    .model-error {
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 8px;
      text-align: center;
    }
    .error-container {
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .error-icon {
      font-size: 48px;
      color: #f85a40;
      margin-bottom: 20px;
    }
    .retry-button {
      background-color: #f85a40;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 20px;
    }
    .retry-button:hover {
      background-color: #e64a3a;
    }
  `;
  
  // Add the error message and style to the container
  container.appendChild(style);
  container.appendChild(errorMessage);
}

/**
 * Initialize an existing model viewer
 */
function initializeModelViewer(modelViewer) {
  if (!modelViewer) return;
  
  // Add event listeners for model viewer
  modelViewer.addEventListener('load', function() {
    console.log('3D model loaded successfully');
  });
  
  modelViewer.addEventListener('error', function(error) {
    console.error('Error loading 3D model:', error);
    
    const container = modelViewer.parentNode;
    if (container) {
      handleModelError(container);
    }
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