/**
 * API Connection Test
 * This script tests the connection between frontend and backend
 */

// Base API URL
const API_BASE_URL = 'http://localhost:5000/api';

// Test the API connection
const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('✅ API Health Check Successful:', healthData);
    } else {
      console.error('❌ API Health Check Failed:', healthData);
    }
    
    // Test public enquiries endpoint
    const enquiriesResponse = await fetch(`${API_BASE_URL}/public/enquiries`);
    const enquiriesData = await enquiriesResponse.json();
    
    if (enquiriesResponse.ok) {
      console.log('✅ Public Enquiries Endpoint Successful:', enquiriesData);
    } else {
      console.error('❌ Public Enquiries Endpoint Failed:', enquiriesData);
    }
    
    return {
      success: healthResponse.ok && enquiriesResponse.ok,
      health: healthData,
      enquiries: enquiriesData
    };
  } catch (error) {
    console.error('❌ API Connection Test Failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Run the test when the script is loaded
testApiConnection().then(result => {
  // Create a notification element to display the result
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '15px 20px';
  notification.style.borderRadius = '5px';
  notification.style.color = 'white';
  notification.style.fontWeight = 'bold';
  notification.style.zIndex = '9999';
  
  if (result.success) {
    notification.style.backgroundColor = '#4CAF50';
    notification.textContent = 'Backend API Connection Successful!';
  } else {
    notification.style.backgroundColor = '#F44336';
    notification.textContent = `Backend API Connection Failed: ${result.error || 'Unknown error'}`;
  }
  
  document.body.appendChild(notification);
  
  // Remove the notification after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
});

// Export the test function
export default testApiConnection; 