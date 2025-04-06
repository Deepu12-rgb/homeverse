/**
 * Enquiry functionality for Homeverse
 * Handles general enquiries and service-specific enquiries
 */

// DOM Elements
const enquiryModal = document.querySelector('.enquiry-modal');
const enquiryForm = document.querySelector('.enquiry-form');
const closeEnquiryBtn = document.querySelector('.close-enquiry-btn');

/**
 * Initialize enquiry functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize enquiry modal
  initEnquiryModal();
});

/**
 * Initialize enquiry modal
 */
function initEnquiryModal() {
  const modal = document.getElementById('enquiryModal');
  const closeBtn = modal.querySelector('.close-enquiry-btn');
  const form = document.getElementById('enquiryForm');
  const heroEnquiryBtn = document.querySelector('.hero-enquiry-btn');
  const enquiryLinks = document.querySelectorAll('.enquiry-link');
  
  // Add event listener to the hero enquiry button
  if (heroEnquiryBtn) {
    heroEnquiryBtn.addEventListener('click', function() {
      openEnquiryModal();
      // Set subject to "General Enquiry" for hero button
      document.getElementById('subject').value = "General Enquiry";
    });
  }
  
  // Add event listeners to all enquiry links in service cards
  enquiryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const service = this.getAttribute('data-service');
      openEnquiryModal();
      // Set subject based on the service
      document.getElementById('subject').value = `Enquiry about ${service}`;
    });
  });
  
  // Close modal when clicking the close button
  closeBtn.addEventListener('click', closeEnquiryModal);
  
  // Close modal when clicking outside the modal content
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeEnquiryModal();
    }
  });
  
  // Handle form submission
  form.addEventListener('submit', handleEnquirySubmit);
}

/**
 * Open enquiry modal
 */
function openEnquiryModal() {
  const modal = document.getElementById('enquiryModal');
  modal.style.display = 'block';
  
  // Add active class to body to prevent scrolling
  document.body.classList.add('modal-open');
  
  // Focus on the first input field
  setTimeout(() => {
    document.getElementById('name').focus();
  }, 100);
}

/**
 * Close enquiry modal
 */
function closeEnquiryModal() {
  const modal = document.getElementById('enquiryModal');
  modal.style.display = 'none';
  
  // Reset form
  document.getElementById('enquiryForm').reset();
  
  // Remove active class from body
  document.body.classList.remove('modal-open');
}

/**
 * Handle enquiry form submission
 * @param {Event} e - Form submit event
 */
async function handleEnquirySubmit(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(e.target);
  const enquiryData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    message: formData.get('message')
  };
  
  try {
    // Disable submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Check if API service is available
    if (window.EnquiryService) {
      // Submit enquiry using API service
      const response = await EnquiryService.submitEnquiry(enquiryData);
      
      if (response.success) {
        // Close the enquiry modal
        closeEnquiryModal();
        
        // Show the token modal if it exists
        if (typeof showTokenModal === 'function') {
          showTokenModal(response.token);
        } else {
          // Otherwise, show a notification
          showNotification(`Your enquiry has been submitted successfully! Your token number is: ${response.token}`);
        }
        
        // Save to local storage if QueryManager exists
        if (window.QueryManager) {
          QueryManager.saveQuery({
            ...enquiryData,
            token: response.token,
            status: 'Pending',
            timestamp: new Date().toISOString()
          });
        }
      } else {
        // Show error notification
        showNotification('Error submitting enquiry. Please try again.', 'error');
      }
    } else {
      // Fallback to local storage if API service is not available
      if (window.QueryManager) {
        const token = QueryManager.saveQuery(enquiryData);
        
        // Close the enquiry modal
        closeEnquiryModal();
        
        // Show the token modal if it exists
        if (typeof showTokenModal === 'function') {
          showTokenModal(token);
        } else {
          // Otherwise, show a notification
          showNotification(`Your enquiry has been submitted successfully! Your token number is: ${token}`);
        }
      } else {
        // Just show a success message
        console.log('Enquiry submitted:', enquiryData);
        
        // Close the enquiry modal
        closeEnquiryModal();
        
        // Show success message
        showNotification('Your enquiry has been submitted successfully! We will contact you soon.');
      }
    }
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    showNotification('Error submitting enquiry. Please try again.', 'error');
  } finally {
    // Re-enable submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Enquiry';
  }
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
  // Check if notification element already exists
  let notification = document.querySelector('.enquiry-notification');
  
  // If not, create it
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'enquiry-notification';
    document.body.appendChild(notification);
  }
  
  // Add error class if type is error
  if (type === 'error') {
    notification.classList.add('error');
  } else {
    notification.classList.remove('error');
  }
  
  // Set the message and show the notification
  notification.textContent = message;
  notification.classList.add('show');
  
  // Hide the notification after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
}

// Export functions for use in other files
window.enquiryFunctions = {
  openEnquiryModal,
  closeEnquiryModal
}; 