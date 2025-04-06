// Load user settings from localStorage
document.addEventListener('DOMContentLoaded', () => {
  loadUserSettings();
  setupFormSubmissions();
  setupDeleteAccount();
});

// Load user settings
function loadUserSettings() {
  const userSettings = JSON.parse(localStorage.getItem('userSettings')) || {
    fullName: '',
    email: '',
    phone: '',
    emailNotifications: true,
    propertyAlerts: true,
    newsletter: false,
    publicProfile: false,
    showSavedProperties: true
  };

  // Populate account settings
  document.querySelector('input[name="fullName"]').value = userSettings.fullName;
  document.querySelector('input[name="email"]').value = userSettings.email;
  document.querySelector('input[name="phone"]').value = userSettings.phone;

  // Populate notification settings
  document.querySelector('input[name="emailNotifications"]').checked = userSettings.emailNotifications;
  document.querySelector('input[name="propertyAlerts"]').checked = userSettings.propertyAlerts;
  document.querySelector('input[name="newsletter"]').checked = userSettings.newsletter;

  // Populate privacy settings
  document.querySelector('input[name="publicProfile"]').checked = userSettings.publicProfile;
  document.querySelector('input[name="showSavedProperties"]').checked = userSettings.showSavedProperties;
}

// Setup form submissions
function setupFormSubmissions() {
  // Account settings form
  document.getElementById('accountSettingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settings = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone')
    };
    saveSettings('account', settings);
    showNotification('Account settings updated successfully!');
  });

  // Password settings form
  document.getElementById('passwordSettingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      showNotification('New passwords do not match!', 'error');
      return;
    }

    // Here you would typically verify the current password with your backend
    // For demo purposes, we'll just save the new password
    saveSettings('password', { newPassword });
    showNotification('Password updated successfully!');
    e.target.reset();
  });

  // Notification settings form
  document.getElementById('notificationSettingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settings = {
      emailNotifications: formData.get('emailNotifications') === 'on',
      propertyAlerts: formData.get('propertyAlerts') === 'on',
      newsletter: formData.get('newsletter') === 'on'
    };
    saveSettings('notifications', settings);
    showNotification('Notification preferences updated successfully!');
  });

  // Privacy settings form
  document.getElementById('privacySettingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settings = {
      publicProfile: formData.get('publicProfile') === 'on',
      showSavedProperties: formData.get('showSavedProperties') === 'on'
    };
    saveSettings('privacy', settings);
    showNotification('Privacy settings updated successfully!');
  });
}

// Save settings to localStorage
function saveSettings(type, settings) {
  const currentSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
  const updatedSettings = { ...currentSettings, ...settings };
  localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
}

// Setup delete account functionality
function setupDeleteAccount() {
  const deleteBtn = document.getElementById('deleteAccountBtn');
  deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Here you would typically make an API call to delete the account
      // For demo purposes, we'll just clear the localStorage
      localStorage.removeItem('userSettings');
      localStorage.removeItem('savedHomes');
      showNotification('Account deleted successfully!');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }
  });
}

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Trigger reflow
  notification.offsetHeight;
  
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
} 