/**
 * Wishlist functionality for Homeverse
 * Handles adding, removing, and displaying properties in the wishlist
 */

// Wishlist state
let wishlistState = {
  items: [],
  count: 0,
  total: 0
};

// DOM Elements
const wishlistCountElements = document.querySelectorAll('.wishlist-count');
const wishlistToggleBtn = document.querySelector('.wishlist-toggle-btn');
const wishlistSidebar = document.querySelector('.wishlist-sidebar');
const wishlistItemsContainer = document.querySelector('.wishlist-items');
const wishlistEmptyMessage = document.querySelector('.wishlist-empty');
const wishlistTotalElement = document.querySelector('.wishlist-total-value');
const wishlistCloseBtn = document.querySelector('.wishlist-close-btn');
const clearWishlistBtn = document.querySelector('.clear-wishlist-btn');
const contactAgentsBtn = document.querySelector('.contact-agents-btn');

/**
 * Initialize wishlist functionality
 */
function initWishlist() {
  // Load wishlist from localStorage
  loadWishlistFromStorage();

  // Add event listeners
  if (wishlistToggleBtn) {
    wishlistToggleBtn.addEventListener('click', toggleWishlist);
  }

  if (wishlistCloseBtn) {
    wishlistCloseBtn.addEventListener('click', closeWishlist);
  }

  if (clearWishlistBtn) {
    clearWishlistBtn.addEventListener('click', clearWishlist);
  }

  if (contactAgentsBtn) {
    contactAgentsBtn.addEventListener('click', contactAgents);
  }

  // Add event listeners to heart buttons (Add to Wishlist)
  const heartButtons = document.querySelectorAll('.card-footer-actions-btn ion-icon[name="heart-outline"]');
  heartButtons.forEach(button => {
    button.parentElement.addEventListener('click', function(e) {
      e.preventDefault();
      const propertyCard = this.closest('.property-card');
      if (propertyCard) {
        const propertyId = propertyCard.dataset.id;
        addToWishlist(propertyCard);
      }
    });
  });

  // Add event listeners to resize buttons
  const resizeButtons = document.querySelectorAll('.card-footer-actions-btn ion-icon[name="resize-outline"]');
  resizeButtons.forEach(button => {
    button.parentElement.addEventListener('click', function(e) {
      e.preventDefault();
      const propertyCard = this.closest('.property-card');
      if (propertyCard) {
        expandPropertyView(propertyCard);
      }
    });
  });

  // Add event listeners to plus buttons
  const plusButtons = document.querySelectorAll('.card-footer-actions-btn ion-icon[name="add-circle-outline"]');
  plusButtons.forEach(button => {
    button.parentElement.addEventListener('click', function(e) {
      e.preventDefault();
      const propertyCard = this.closest('.property-card');
      if (propertyCard) {
        showPropertyOptions(propertyCard);
      }
    });
  });
  
  // Update UI
  updateWishlistUI();
}

/**
 * Load wishlist from localStorage
 */
function loadWishlistFromStorage() {
  const savedWishlist = localStorage.getItem('wishlist');
  if (savedWishlist) {
    try {
      const parsedWishlist = JSON.parse(savedWishlist);
      wishlistState.items = parsedWishlist.items || [];
      wishlistState.count = wishlistState.items.length;
      calculateWishlistTotal();
    } catch (error) {
      console.error('Error parsing wishlist from localStorage:', error);
      wishlistState.items = [];
      wishlistState.count = 0;
      wishlistState.total = 0;
    }
  }
}

/**
 * Save wishlist to localStorage
 */
function saveWishlistToStorage() {
  localStorage.setItem('wishlist', JSON.stringify({
    items: wishlistState.items,
    count: wishlistState.count,
    total: wishlistState.total
  }));
}

/**
 * Add property to wishlist
 * @param {HTMLElement} propertyCard - The property card element
 */
function addToWishlist(propertyCard) {
  // Extract property data from the card
  const propertyId = propertyCard.dataset.id;
  const title = propertyCard.querySelector('.card-title a').textContent.trim();
  const priceElement = propertyCard.querySelector('.card-price');
  const price = extractPrice(priceElement.textContent);
  const isRental = propertyCard.querySelector('.card-badge.green') !== null;
  const image = propertyCard.querySelector('.card-banner img').src;
  const location = propertyCard.querySelector('.banner-actions-btn address')?.textContent.trim() || '';
  const bedrooms = propertyCard.querySelector('.card-item ion-icon[name="bed-outline"]')?.closest('.card-item').querySelector('strong').textContent || '0';
  const bathrooms = propertyCard.querySelector('.card-item ion-icon[name="man-outline"]')?.closest('.card-item').querySelector('strong').textContent || '0';
  const area = propertyCard.querySelector('.card-item ion-icon[name="square-outline"]')?.closest('.card-item').querySelector('strong').textContent || '0';
  const agent = propertyCard.querySelector('.author-name a')?.textContent.trim() || 'Unknown Agent';

  // Check if property is already in wishlist
  const existingItemIndex = wishlistState.items.findIndex(item => item.id === propertyId);
  
  if (existingItemIndex !== -1) {
    // Property already in wishlist, remove it
    wishlistState.items.splice(existingItemIndex, 1);
    wishlistState.count--;
    
    // Update heart icon
    const heartIcon = propertyCard.querySelector('.card-footer-actions-btn ion-icon[name="heart"]');
    if (heartIcon) {
      heartIcon.setAttribute('name', 'heart-outline');
    }
    
    showNotification('Property removed from wishlist', 'info');
  } else {
    // Add property to wishlist
    const newItem = {
      id: propertyId,
      title: title,
      price: price,
      isRental: isRental,
      image: image,
      location: location,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      area: area,
      agent: agent
    };
    
    wishlistState.items.push(newItem);
    wishlistState.count++;
    
    // Update heart icon
    const heartIcon = propertyCard.querySelector('.card-footer-actions-btn ion-icon[name="heart-outline"]');
    if (heartIcon) {
      heartIcon.setAttribute('name', 'heart');
    }
    
    showNotification('Property added to wishlist!', 'success');
  }
  
  // Calculate total
  calculateWishlistTotal();
  
  // Save to localStorage
  saveWishlistToStorage();
      
      // Update UI
      updateWishlistUI();
      
      // Open wishlist sidebar
      openWishlist();
}

/**
 * Extract price from price string
 * @param {string} priceString - Price string (e.g. "$34,900/Month" or "$845,000")
 * @returns {number} - Extracted price as a number
 */
function extractPrice(priceString) {
  const priceMatch = priceString.match(/\$([0-9,]+)/);
  if (priceMatch && priceMatch[1]) {
    return parseFloat(priceMatch[1].replace(/,/g, ''));
  }
  return 0;
}

/**
 * Calculate total value of wishlist items
 */
function calculateWishlistTotal() {
  wishlistState.total = wishlistState.items.reduce((total, item) => total + item.price, 0);
}

/**
 * Remove property from wishlist
 * @param {string} propertyId - Property ID to remove from wishlist
 */
function removeFromWishlist(propertyId) {
  // Find the item index
  const itemIndex = wishlistState.items.findIndex(item => item.id === propertyId);
  
  if (itemIndex !== -1) {
    // Remove the item
    wishlistState.items.splice(itemIndex, 1);
    wishlistState.count--;
    
    // Calculate total
    calculateWishlistTotal();
    
    // Save to localStorage
    saveWishlistToStorage();
      
      // Update UI
      updateWishlistUI();
      
    // Update heart icon if property card exists on page
    const propertyCard = document.querySelector(`.property-card[data-id="${propertyId}"]`);
    if (propertyCard) {
      const heartIcon = propertyCard.querySelector('.card-footer-actions-btn ion-icon[name="heart"]');
      if (heartIcon) {
        heartIcon.setAttribute('name', 'heart-outline');
      }
    }
    
    showNotification('Property removed from wishlist', 'info');
  }
}

/**
 * Clear all items from wishlist
 */
function clearWishlist() {
  // Clear wishlist state
      wishlistState.items = [];
      wishlistState.count = 0;
  wishlistState.total = 0;
  
  // Save to localStorage
  saveWishlistToStorage();
      
      // Update UI
      updateWishlistUI();
      
  // Update all heart icons on page
  const heartIcons = document.querySelectorAll('.card-footer-actions-btn ion-icon[name="heart"]');
  heartIcons.forEach(icon => {
    icon.setAttribute('name', 'heart-outline');
  });
  
  showNotification('Wishlist cleared', 'info');
}

/**
 * Update wishlist UI elements
 */
function updateWishlistUI() {
  // Update wishlist count
  wishlistCountElements.forEach(element => {
    element.textContent = wishlistState.count;
    
    // Show/hide based on count
    if (wishlistState.count > 0) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  });
  
  // Update wishlist items
  if (wishlistItemsContainer) {
    if (wishlistState.items.length === 0) {
      // Show empty wishlist message
      if (wishlistEmptyMessage) {
        wishlistEmptyMessage.style.display = 'block';
      }
      wishlistItemsContainer.innerHTML = '';
    } else {
      // Hide empty wishlist message
      if (wishlistEmptyMessage) {
        wishlistEmptyMessage.style.display = 'none';
      }
      
      // Render wishlist items
      renderWishlistItems();
    }
  }
  
  // Update wishlist total
  if (wishlistTotalElement) {
    wishlistTotalElement.textContent = formatCurrency(wishlistState.total);
  }
}

/**
 * Format currency value
 * @param {number} value - Value to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value) {
  return '$' + value.toLocaleString('en-US');
}

/**
 * Render wishlist items in the sidebar
 */
function renderWishlistItems() {
  if (!wishlistItemsContainer) return;
  
  wishlistItemsContainer.innerHTML = '';
  
  wishlistState.items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'wishlist-item';
    itemElement.innerHTML = `
      <div class="wishlist-item-image">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="wishlist-item-content">
        <h4 class="wishlist-item-title">${item.title}</h4>
        <p class="wishlist-item-price">${formatCurrency(item.price)}${item.isRental ? '/month' : ''}</p>
        <p class="wishlist-item-details">
          <span>${item.bedrooms} bed</span> • 
          <span>${item.bathrooms} bath</span> • 
          <span>${item.area} sq ft</span>
        </p>
        <p class="wishlist-item-location">${item.location}</p>
      </div>
      <button class="wishlist-item-remove" data-id="${item.id}">×</button>
    `;
    
    wishlistItemsContainer.appendChild(itemElement);
    
    // Add event listener to remove button
    const removeButton = itemElement.querySelector('.wishlist-item-remove');
    if (removeButton) {
    removeButton.addEventListener('click', function() {
        removeFromWishlist(this.dataset.id);
      });
    }
  });
}

/**
 * Toggle wishlist sidebar
 */
function toggleWishlist() {
  if (wishlistSidebar) {
    wishlistSidebar.classList.toggle('active');
    document.body.classList.toggle('wishlist-open');
  }
}

/**
 * Open wishlist sidebar
 */
function openWishlist() {
  if (wishlistSidebar) {
    wishlistSidebar.classList.add('active');
    document.body.classList.add('wishlist-open');
  }
}

/**
 * Close wishlist sidebar
 */
function closeWishlist() {
  if (wishlistSidebar) {
    wishlistSidebar.classList.remove('active');
    document.body.classList.remove('wishlist-open');
  }
}

/**
 * Contact agents for properties in wishlist
 */
function contactAgents() {
  if (wishlistState.items.length === 0) {
    showNotification('Your wishlist is empty', 'error');
    return;
  }
  
  // Get unique agents
  const agents = [...new Set(wishlistState.items.map(item => item.agent))];
  
  // Open enquiry modal if it exists
  const enquiryModal = document.getElementById('enquiryModal');
  if (enquiryModal) {
    // Pre-fill subject with wishlist information
    const subjectField = enquiryModal.querySelector('#subject');
    if (subjectField) {
      subjectField.value = `Inquiry about ${wishlistState.items.length} properties in my wishlist`;
    }
    
    // Pre-fill message with wishlist information
    const messageField = enquiryModal.querySelector('#message');
    if (messageField) {
      let message = `I am interested in the following properties:\n\n`;
      wishlistState.items.forEach(item => {
        message += `- ${item.title} (${formatCurrency(item.price)}${item.isRental ? '/month' : ''})\n`;
      });
      message += `\nPlease contact me with more information about these properties.`;
      messageField.value = message;
    }
    
    // Show the modal
    enquiryModal.style.display = 'flex';
  } else {
    // If no modal exists, show notification with agent information
    let message = `Contact the following agents about your wishlist:\n`;
    agents.forEach(agent => {
      message += `- ${agent}\n`;
    });
    showNotification(message, 'info');
  }
}

/**
 * Expand property view
 * @param {HTMLElement} propertyCard - The property card element
 */
function expandPropertyView(propertyCard) {
  const propertyId = propertyCard.dataset.id;
  // Redirect to property details page
  window.location.href = `property-details.html?id=${propertyId}`;
}

/**
 * Show property options
 * @param {HTMLElement} propertyCard - The property card element
 */
function showPropertyOptions(propertyCard) {
  const propertyId = propertyCard.dataset.id;
  const title = propertyCard.querySelector('.card-title a').textContent.trim();
  
  // Create options menu
  const optionsMenu = document.createElement('div');
  optionsMenu.className = 'property-options-menu';
  optionsMenu.innerHTML = `
    <div class="property-options-content">
      <h4>${title}</h4>
      <ul>
        <li><a href="property-details.html?id=${propertyId}">View Details</a></li>
        <li><a href="property-3d-view.html?id=${propertyId}">View 3D Tour</a></li>
        <li><a href="#" class="schedule-viewing" data-id="${propertyId}">Schedule Viewing</a></li>
        <li><a href="#" class="share-property" data-id="${propertyId}">Share Property</a></li>
      </ul>
      <button class="close-options">Close</button>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(optionsMenu);
  
  // Add event listeners
  const closeButton = optionsMenu.querySelector('.close-options');
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      optionsMenu.remove();
    });
  }
  
  const scheduleViewingLink = optionsMenu.querySelector('.schedule-viewing');
  if (scheduleViewingLink) {
    scheduleViewingLink.addEventListener('click', function(e) {
      e.preventDefault();
      optionsMenu.remove();
      
      // Open enquiry modal if it exists
      const enquiryModal = document.getElementById('enquiryModal');
      if (enquiryModal) {
        // Pre-fill subject with property information
        const subjectField = enquiryModal.querySelector('#subject');
        if (subjectField) {
          subjectField.value = `Schedule viewing for ${title}`;
        }
        
        // Pre-fill message with property information
        const messageField = enquiryModal.querySelector('#message');
        if (messageField) {
          messageField.value = `I would like to schedule a viewing for ${title}. Please contact me with available dates and times.`;
        }
        
        // Show the modal
        enquiryModal.style.display = 'flex';
      }
    });
  }
  
  const sharePropertyLink = optionsMenu.querySelector('.share-property');
  if (sharePropertyLink) {
    sharePropertyLink.addEventListener('click', function(e) {
      e.preventDefault();
      optionsMenu.remove();
      
      // Create share URL
      const shareUrl = `${window.location.origin}/property-details.html?id=${propertyId}`;
      
      // Try to use Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: title,
          text: `Check out this property: ${title}`,
          url: shareUrl
        }).catch(error => {
          console.error('Error sharing:', error);
          showNotification('Error sharing property', 'error');
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
          showNotification('Property link copied to clipboard!', 'success');
        }).catch(error => {
          console.error('Error copying to clipboard:', error);
          showNotification('Error copying property link', 'error');
        });
      }
    });
  }
  
  // Close when clicking outside
  optionsMenu.addEventListener('click', function(e) {
    if (e.target === optionsMenu) {
      optionsMenu.remove();
    }
  });
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.className = 'notification-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    notification.remove();
  });
  
  notification.appendChild(closeButton);
  
  // Check if notification container exists, create if not
  let container = document.querySelector('.notification-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  
  // Add notification to container
  container.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

// Initialize wishlist when DOM is loaded
document.addEventListener('DOMContentLoaded', initWishlist);