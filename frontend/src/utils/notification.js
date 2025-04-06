/**
 * Notification Utility
 * Handles displaying notifications to the user
 */

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success', 'error', 'info')
 * @param {number} duration - How long to show the notification in milliseconds
 */
const showNotification = (message, type = 'success', duration = 3000) => {
  // Create notification element if it doesn't exist
  let notification = document.querySelector('.notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  // Set notification content and type
  notification.textContent = message;
  notification.className = `notification ${type}`;
  
  // Show notification
  notification.classList.add('show');
  
  // Hide notification after duration
  setTimeout(() => {
    notification.classList.remove('show');
  }, duration);
};

/**
 * Show a success notification
 * @param {string} message - The message to display
 * @param {number} duration - How long to show the notification in milliseconds
 */
const showSuccess = (message, duration = 3000) => {
  showNotification(message, 'success', duration);
};

/**
 * Show an error notification
 * @param {string} message - The message to display
 * @param {number} duration - How long to show the notification in milliseconds
 */
const showError = (message, duration = 3000) => {
  showNotification(message, 'error', duration);
};

/**
 * Show an info notification
 * @param {string} message - The message to display
 * @param {number} duration - How long to show the notification in milliseconds
 */
const showInfo = (message, duration = 3000) => {
  showNotification(message, 'info', duration);
};

// Export notification functions
export {
  showNotification,
  showSuccess,
  showError,
  showInfo
}; 