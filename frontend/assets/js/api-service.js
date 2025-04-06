/**
 * API Service for Homeverse
 * Handles API requests to the backend
 */

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Enquiry API Service
 */
const EnquiryService = {
  /**
   * Submit a new enquiry
   * @param {Object} enquiryData - The enquiry data
   * @returns {Promise} - The response from the API
   */
  submitEnquiry: async function(enquiryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/public/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enquiryData)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      throw error;
    }
  },
  
  /**
   * Get enquiry by token
   * @param {string} token - The enquiry token
   * @returns {Promise} - The response from the API
   */
  getEnquiryByToken: async function(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/public/enquiries/token/${token}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching enquiry:', error);
      throw error;
    }
  },
  
  /**
   * Get enquiries by email
   * @param {string} email - The user's email
   * @returns {Promise} - The response from the API
   */
  getEnquiriesByEmail: async function(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/public/enquiries/email/${email}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching enquiries:', error)
      throw error;
    }
  },
  
  /**
   * Add a response to an enquiry
   * @param {string} token - The enquiry token
   * @param {string} text - The response text
   * @param {string} email - The user's email
   * @returns {Promise} - The response from the API
   */
  addResponse: async function(token, text, email) {
    try {
      const response = await fetch(`${API_BASE_URL}/public/enquiries/token/${token}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, email })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error adding response:', error);
      throw error;
    }
  }
};

// Make the API service available globally
window.EnquiryService = EnquiryService; 