/**
 * Add Listing JavaScript
 * Handles the functionality for the property listing form
 */

document.addEventListener('DOMContentLoaded', () => {
  initAddListingPage();
});

/**
 * Initialize the Add Listing page
 */
function initAddListingPage() {
  const addListingForm = document.getElementById('addListingForm');
  const imageInput = document.getElementById('images');
  const imagePreview = document.getElementById('imagePreview');
  const videoInput = document.getElementById('video');
  
  // Check if user is logged in
  checkUserAuthentication();
  
  // Initialize form event listeners
  if (addListingForm) {
    addListingForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Initialize image upload preview
  if (imageInput) {
    imageInput.addEventListener('change', handleImageUpload);
  }
  
  // Initialize video upload
  if (videoInput) {
    videoInput.addEventListener('change', handleVideoUpload);
  }
  
  // Pre-fill user data if available
  prefillUserData();
}

/**
 * Check if user is authenticated
 */
function checkUserAuthentication() {
  const token = localStorage.getItem('token');
  const isLoginPage = window.location.pathname.includes('login.html');
  
  // For demo purposes, we'll just show a notification if not logged in
  // In a real app, you might redirect to login page
  if (!token && !isLoginPage) {
    showNotification('Please log in to submit a property listing. For demo purposes, you can continue without logging in.', 'info');
  }
}

/**
 * Handle form submission
 * @param {Event} event - The form submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();
  
  // Validate form
  if (!validateForm()) {
    return;
  }
  
  // Get form data
  const formData = new FormData(event.target);
  
  // In a real application, you would send this data to your backend
  // For demo purposes, we'll just show a success message
  
  // Show loading state
  const submitBtn = document.querySelector('.submit-listing-btn');
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Reset button state
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
    
    // Show success message
    showNotification('Your property listing has been submitted successfully! Our team will review it shortly.', 'success');
    
    // Reset form after successful submission
    event.target.reset();
    clearImagePreview();
    
    // Redirect to homepage after a delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
  }, 2000);
}

/**
 * Validate the form fields
 * @returns {boolean} - Whether the form is valid
 */
function validateForm() {
  const requiredFields = document.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add('error');
      
      // Add error message if it doesn't exist
      const errorMsg = field.parentElement.querySelector('.error-message');
      if (!errorMsg) {
        const message = document.createElement('p');
        message.classList.add('error-message');
        message.textContent = 'This field is required';
        field.parentElement.appendChild(message);
      }
    } else {
      field.classList.remove('error');
      const errorMsg = field.parentElement.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.remove();
      }
    }
  });
  
  if (!isValid) {
    showNotification('Please fill in all required fields', 'error');
  }
  
  return isValid;
}

/**
 * Handle image upload and preview
 * @param {Event} event - The change event
 */
function handleImageUpload(event) {
  const files = event.target.files;
  
  if (files.length === 0) {
    return;
  }
  
  // Clear existing preview
  clearImagePreview();
  
  // Create preview for each selected image
  Array.from(files).forEach(file => {
    if (!file.type.match('image.*')) {
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const previewItem = document.createElement('div');
      previewItem.classList.add('image-preview-item');
      
      const img = document.createElement('img');
      img.src = e.target.result;
      
      const removeBtn = document.createElement('button');
      removeBtn.classList.add('remove-image');
      removeBtn.innerHTML = '&times;';
      removeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        previewItem.remove();
      });
      
      previewItem.appendChild(img);
      previewItem.appendChild(removeBtn);
      imagePreview.appendChild(previewItem);
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Clear the image preview container
 */
function clearImagePreview() {
  if (imagePreview) {
    imagePreview.innerHTML = '';
  }
}

/**
 * Handle video upload
 * @param {Event} event - The change event
 */
function handleVideoUpload(event) {
  const file = event.target.files[0];
  
  if (!file) {
    return;
  }
  
  if (!file.type.match('video.*')) {
    showNotification('Please select a valid video file', 'error');
    event.target.value = '';
    return;
  }
  
  // In a real application, you might want to show a video preview
  // For simplicity, we'll just show a notification
  showNotification(`Video "${file.name}" selected`, 'info');
}

/**
 * Pre-fill user data if available
 */
function prefillUserData() {
  // In a real application, you would get this from your auth system
  // For demo purposes, we'll check localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.name) {
    const nameInput = document.getElementById('contactName');
    if (nameInput) nameInput.value = user.name;
  }
  
  if (user.email) {
    const emailInput = document.getElementById('contactEmail');
    if (emailInput) emailInput.value = user.email;
  }
  
  if (user.phone) {
    const phoneInput = document.getElementById('contactPhone');
    if (phoneInput) phoneInput.value = user.phone;
  }
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
  // Check if notification container exists, create if not
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.classList.add('notification-container');
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.classList.add('notification', `notification-${type}`);
  notification.textContent = message;
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('notification-close');
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

/**
 * Update the "Add Listing" button in the header to link to the add listing page
 */
function updateAddListingButton() {
  const addListingBtn = document.querySelector('.header-top-btn');
  
  if (addListingBtn) {
    addListingBtn.addEventListener('click', () => {
      window.location.href = 'add-listing.html';
    });
  }
}

// Initialize the "Add Listing" button in the header
updateAddListingButton(); 