/**
 * Enquiry API Integration
 * Handles communication with the backend API for enquiry submissions
 */

// Import API services (adjust the path as needed)
import { publicEnquiriesApi } from '../../services/api.js';
import { showSuccess, showError } from '../../utils/notification.js';

// Initialize enquiry form functionality
const initEnquiryForm = () => {
  const enquiryForm = document.getElementById('enquiry-form');
  
  if (!enquiryForm) return;
  
  enquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(enquiryForm);
    const enquiryData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      subject: formData.get('subject') || 'General Enquiry',
      message: formData.get('message')
    };
    
    // Validate form data
    if (!enquiryData.name || !enquiryData.email || !enquiryData.message) {
      showError('Please fill in all required fields');
      return;
    }
    
    try {
      // Show loading state
      const submitButton = enquiryForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      // Submit enquiry to API
      const response = await publicEnquiriesApi.submit(enquiryData);
      
      // Show success message
      showSuccess('Your enquiry has been submitted successfully!');
      
      // Reset form
      enquiryForm.reset();
      
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      
      // Close modal if it exists
      const modal = document.querySelector('.enquiry-modal');
      if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
      }
    } catch (error) {
      // Show error message
      showError(error.message || 'Failed to submit enquiry. Please try again.');
      
      // Reset button state
      const submitButton = enquiryForm.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = 'Submit';
    }
  });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initEnquiryForm();
}); 