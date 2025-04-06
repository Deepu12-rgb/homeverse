/**
 * Service Actions for Homeverse
 * Handles functionality for the service card actions in the "Our Main Focus" section
 */

document.addEventListener('DOMContentLoaded', function() {
  initServiceActions();
});

/**
 * Initialize service card action buttons
 */
function initServiceActions() {
  // Get all service card action links
  const explorePropertiesBtn = document.querySelector('.service-card a[href="#property"][data-action="buy"]');
  const browseRentalsBtn = document.querySelector('.service-card a[href="#property"][data-action="rent"]');
  const listPropertyBtn = document.querySelector('.service-card a[data-action="list"]');
  
  // Add event listeners to the buttons
  if (explorePropertiesBtn) {
    explorePropertiesBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showPropertiesByType('buy');
    });
  }
  
  if (browseRentalsBtn) {
    browseRentalsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showPropertiesByType('rent');
    });
  }
  
  if (listPropertyBtn) {
    listPropertyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openAddListingPage();
    });
  }
}

/**
 * Show properties by type (buy or rent)
 * @param {string} type - The type of properties to show ('buy' or 'rent')
 */
function showPropertiesByType(type) {
  // Scroll to the property section
  const propertySection = document.getElementById('property');
  if (propertySection) {
    propertySection.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Filter properties based on type
  const propertyCards = document.querySelectorAll('.property-card');
  let count = 0;
  
  propertyCards.forEach(card => {
    const badge = card.querySelector('.card-badge');
    
    if (badge) {
      const isRental = badge.classList.contains('green');
      const isSale = badge.classList.contains('orange');
      
      if ((type === 'rent' && isRental) || (type === 'buy' && isSale)) {
        card.style.display = 'block';
        count++;
      } else {
        card.style.display = 'none';
      }
    }
  });
  
  // Update the section title to reflect the filter
  const sectionTitle = document.querySelector('#property .section-title');
  if (sectionTitle) {
    if (type === 'buy') {
      sectionTitle.textContent = 'Properties For Sale';
    } else if (type === 'rent') {
      sectionTitle.textContent = 'Properties For Rent';
    }
  }
  
  // Show a message if no properties are found
  const propertyList = document.querySelector('.property-list');
  let noPropertiesMessage = document.querySelector('.no-properties-message');
  
  if (count === 0) {
    if (!noPropertiesMessage) {
      noPropertiesMessage = document.createElement('div');
      noPropertiesMessage.className = 'no-properties-message';
      propertyList.parentNode.insertBefore(noPropertiesMessage, propertyList.nextSibling);
    }
    
    noPropertiesMessage.textContent = `No properties available for ${type === 'buy' ? 'sale' : 'rent'} at the moment.`;
    noPropertiesMessage.style.display = 'block';
  } else if (noPropertiesMessage) {
    noPropertiesMessage.style.display = 'none';
  }
  
  // Add a "Show All" button if it doesn't exist
  let showAllButton = document.querySelector('.show-all-properties');
  if (!showAllButton) {
    showAllButton = document.createElement('button');
    showAllButton.className = 'btn show-all-properties';
    showAllButton.textContent = 'Show All Properties';
    showAllButton.addEventListener('click', resetPropertyFilters);
    
    const propertyContainer = document.querySelector('#property .container');
    if (propertyContainer) {
      propertyContainer.appendChild(showAllButton);
    }
  }
  
  showAllButton.style.display = 'block';
}

/**
 * Reset property filters to show all properties
 */
function resetPropertyFilters() {
  // Show all property cards
  const propertyCards = document.querySelectorAll('.property-card');
  propertyCards.forEach(card => {
    card.style.display = 'block';
  });
  
  // Reset the section title
  const sectionTitle = document.querySelector('#property .section-title');
  if (sectionTitle) {
    sectionTitle.textContent = 'Featured Listings';
  }
  
  // Hide the "No properties" message
  const noPropertiesMessage = document.querySelector('.no-properties-message');
  if (noPropertiesMessage) {
    noPropertiesMessage.style.display = 'none';
  }
  
  // Hide the "Show All" button
  const showAllButton = document.querySelector('.show-all-properties');
  if (showAllButton) {
    showAllButton.style.display = 'none';
  }
}

/**
 * Open the add listing page
 */
function openAddListingPage() {
  // Now that we've created the add-listing.html page, we can directly navigate to it
  window.location.href = 'add-listing.html';
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('info', 'error')
 */
function showNotification(message, type = 'info') {
  // Check if notification element already exists
  let notification = document.querySelector('.service-notification');
  
  // If not, create it
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'service-notification';
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