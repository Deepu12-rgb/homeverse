/**
 * API Service for Homeverse
 * Handles all communication with the backend API
 */

// Base API URL - change this to your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Headers for JSON requests
const jsonHeaders = {
  'Content-Type': 'application/json',
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Add auth token to headers if available
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token
    ? { ...jsonHeaders, Authorization: `Bearer ${token}` }
    : jsonHeaders;
};

/**
 * Generic API request function
 */
const apiRequest = async (endpoint, method = 'GET', data = null, requiresAuth = false) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = requiresAuth ? getAuthHeaders() : jsonHeaders;
  
  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Something went wrong');
    }

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Public Enquiries API
 */
const publicEnquiriesApi = {
  // Get all public enquiries
  getAll: () => apiRequest('/public/enquiries'),
  
  // Submit a new enquiry
  submit: (enquiryData) => apiRequest('/public/enquiries', 'POST', enquiryData),
};

/**
 * Authentication API
 */
const authApi = {
  // Register a new user
  register: (userData) => apiRequest('/auth/register', 'POST', userData),
  
  // Login a user
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', 'POST', credentials);
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  },
  
  // Get current user information
  getCurrentUser: () => apiRequest('/auth/me', 'GET', null, true),
  
  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('authToken');
    return Promise.resolve({ success: true });
  },
};

/**
 * Properties API
 */
const propertiesApi = {
  // Get all properties
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/properties?${queryString}` : '/properties';
    
    return apiRequest(endpoint);
  },
  
  // Get a specific property
  getById: (id) => apiRequest(`/properties/${id}`),
  
  // Create a new property (requires authentication)
  create: (propertyData) => apiRequest('/properties', 'POST', propertyData, true),
  
  // Update a property (requires authentication)
  update: (id, propertyData) => apiRequest(`/properties/${id}`, 'PUT', propertyData, true),
  
  // Delete a property (requires authentication)
  delete: (id) => apiRequest(`/properties/${id}`, 'DELETE', null, true),
};

/**
 * User API
 */
const userApi = {
  // Get user profile (requires authentication)
  getProfile: () => apiRequest('/users/profile', 'GET', null, true),
  
  // Update user profile (requires authentication)
  updateProfile: (profileData) => apiRequest('/users/profile', 'PUT', profileData, true),
};

// Export all API services
export {
  publicEnquiriesApi,
  authApi,
  propertiesApi,
  userApi,
}; 