/**
 * Wishlist functionality for Homeverse
 * Handles adding, removing, and displaying properties in the wishlist
 */

// API URL
const API_URL = 'http://localhost:5000/api';

// Wishlist state
let wishlistState = {
  items: [],
  guestId: null,
  count: 0
};

// DOM Elements
const wishlistCountElements = document.querySelectorAll('.wishlist-count');
const wishlistToggleBtn = document.querySelector('.wishlist-toggle-btn');
const wishlistSidebar = document.querySelector('.cart-sidebar');
const wishlistItemsContainer = document.querySelector('.cart-items');
const wishlistEmptyMessage = document.querySelector('.cart-empty');
const wishlistTotalElement = document.querySelector('.cart-total');
const wishlistCloseBtn = document.querySelector('.cart-close-btn');
const clearWishlistBtn = document.querySelector('.clear-cart-btn');

/**
 * Initialize wishlist functionality
 */
function initWishlist() {
  // Load wishlist from localStorage
  const savedGuestId = localStorage.getItem('guestId');
  if (savedGuestId) {
    wishlistState.guestId = savedGuestId;
  }

  // Fetch wishlist data from API
  fetchWishlist();

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

  // Add event listeners to "Add to Wishlist" buttons
  const addToWishlistButtons = document.querySelectorAll('.add-to-cart-btn');
  addToWishlistButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const propertyId = this.dataset.propertyId;
      addToWishlist(propertyId);
    });
  });
  
  // Add search functionality to wishlist
  initWishlistSearch();
}

/**
 * Fetch wishlist data from API
 */
async function fetchWishlist() {
  try {
    const url = wishlistState.guestId 
      ? `${API_URL}/cart?guestId=${wishlistState.guestId}`
      : `${API_URL}/cart`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();
    
    if (data.success) {
      // Update wishlist state
      wishlistState.items = data.data.items || [];
      wishlistState.count = wishlistState.items.length;
      
      // Save guest ID if provided
      if (data.guestId) {
        wishlistState.guestId = data.guestId;
        localStorage.setItem('guestId', data.guestId);
      }
      
      // Update UI
      updateWishlistUI();
    } else {
      console.error('Error fetching wishlist:', data.error);
    }
  } catch (error) {
    console.error('Error fetching wishlist:', error);
  }
}

/**
 * Add property to wishlist
 * @param {string} propertyId - Property ID to add to wishlist
 */
async function addToWishlist(propertyId) {
  try {
    const url = `${API_URL}/cart/add/${propertyId}`;
    const queryParams = wishlistState.guestId ? `?guestId=${wishlistState.guestId}` : '';
    
    const response = await fetch(`${url}${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();
    
    if (data.success) {
      // Update wishlist state
      wishlistState.items = data.data.items || [];
      wishlistState.count = wishlistState.items.length;
      
      // Save guest ID if provided
      if (data.guestId) {
        wishlistState.guestId = data.guestId;
        localStorage.setItem('guestId', data.guestId);
      }
      
      // Update UI
      updateWishlistUI();
      
      // Show success message
      showNotification('Property added to wishlist!', 'success');
      
      // Open wishlist sidebar
      openWishlist();
    } else {
      console.error('Error adding to wishlist:', data.error);
      showNotification(data.error || 'Error adding to wishlist', 'error');
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    showNotification('Error adding to wishlist', 'error');
  }
}

/**
 * Remove property from wishlist
 * @param {string} propertyId - Property ID to remove from wishlist
 */
async function removeFromWishlist(propertyId) {
  try {
    const url = `${API_URL}/cart/remove/${propertyId}`;
    const queryParams = wishlistState.guestId ? `?guestId=${wishlistState.guestId}` : '';
    
    const response = await fetch(`${url}${queryParams}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();
    
    if (data.success) {
      // Update wishlist state
      wishlistState.items = data.data.items || [];
      wishlistState.count = wishlistState.items.length;
      
      // Update UI
      updateWishlistUI();
      
      // Show success message
      showNotification('Property removed from wishlist', 'success');
    } else {
      console.error('Error removing from wishlist:', data.error);
      showNotification(data.error || 'Error removing from wishlist', 'error');
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    showNotification('Error removing from wishlist', 'error');
  }
}

/**
 * Clear all items from wishlist
 */
async function clearWishlist() {
  try {
    const url = `${API_URL}/cart/clear`;
    const queryParams = wishlistState.guestId ? `?guestId=${wishlistState.guestId}` : '';
    
    const response = await fetch(`${url}${queryParams}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();
    
    if (data.success) {
      // Update wishlist state
      wishlistState.items = [];
      wishlistState.count = 0;
      
      // Update UI
      updateWishlistUI();
      
      // Show success message
      showNotification('Wishlist cleared', 'success');
    } else {
      console.error('Error clearing wishlist:', data.error);
      showNotification(data.error || 'Error clearing wishlist', 'error');
    }
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    showNotification('Error clearing wishlist', 'error');
  }
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
      wishlistItemsContainer.innerHTML = '';
      if (wishlistEmptyMessage) {
        wishlistEmptyMessage.classList.remove('hidden');
      }
      if (wishlistTotalElement) {
        wishlistTotalElement.classList.add('hidden');
      }
      if (clearWishlistBtn) {
        clearWishlistBtn.classList.add('hidden');
      }
    } else {
      // Hide empty wishlist message
      if (wishlistEmptyMessage) {
        wishlistEmptyMessage.classList.add('hidden');
      }
      if (wishlistTotalElement) {
        wishlistTotalElement.classList.remove('hidden');
      }
      if (clearWishlistBtn) {
        clearWishlistBtn.classList.remove('hidden');
      }
      
      // Render wishlist items
      renderWishlistItems();
    }
  }
}

/**
 * Filter wishlist items by price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Array} - Filtered wishlist items
 */
function filterWishlistItemsByPrice(minPrice, maxPrice) {
  return wishlistState.items.filter(item => {
    const price = item.property.price;
    
    if (minPrice !== null && maxPrice !== null) {
      return price >= minPrice && price <= maxPrice;
    } else if (minPrice !== null) {
      return price >= minPrice;
    } else if (maxPrice !== null) {
      return price <= maxPrice;
    }
    
    return true;
  });
}

/**
 * Initialize wishlist search functionality
 */
function initWishlistSearch() {
  // Create search container
  const searchContainer = document.createElement('div');
  searchContainer.className = 'cart-search-container';
  
  searchContainer.innerHTML = `
    <input type="text" class="cart-search-input" placeholder="Search in wishlist...">
    <button class="cart-search-btn">
      <ion-icon name="search-outline"></ion-icon>
    </button>
  `;
  
  // Create price filter container
  const priceFilterContainer = document.createElement('div');
  priceFilterContainer.className = 'cart-price-filter';
  
  priceFilterContainer.innerHTML = `
    <div class="price-filter-header">
      <span>Filter by price</span>
      <button class="price-filter-toggle">
        <ion-icon name="chevron-down-outline"></ion-icon>
      </button>
    </div>
    <div class="price-filter-content hidden">
      <div class="price-inputs">
        <div class="price-input-group">
          <label for="min-price">Min Price</label>
          <input type="number" id="min-price" placeholder="Min $" min="0">
        </div>
        <div class="price-input-group">
          <label for="max-price">Max Price</label>
          <input type="number" id="max-price" placeholder="Max $" min="0">
        </div>
      </div>
      <button class="price-filter-apply">Apply Filter</button>
      <button class="price-filter-reset">Reset</button>
    </div>
  `;
  
  // Insert search container after wishlist header
  const wishlistHeader = document.querySelector('.cart-header');
  if (wishlistHeader) {
    wishlistHeader.insertAdjacentElement('afterend', searchContainer);
    searchContainer.insertAdjacentElement('afterend', priceFilterContainer);
  }
  
  // Add event listener to search input
  const searchInput = searchContainer.querySelector('.cart-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value;
      const minPrice = parseFloat(document.getElementById('min-price').value) || null;
      const maxPrice = parseFloat(document.getElementById('max-price').value) || null;
      
      applyFilters(query, minPrice, maxPrice);
    });
  }
  
  // Add event listener to search button
  const searchButton = searchContainer.querySelector('.cart-search-btn');
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      const query = searchInput.value;
      const minPrice = parseFloat(document.getElementById('min-price').value) || null;
      const maxPrice = parseFloat(document.getElementById('max-price').value) || null;
      
      applyFilters(query, minPrice, maxPrice);
    });
  }
  
  // Add event listener to price filter toggle
  const priceFilterToggle = priceFilterContainer.querySelector('.price-filter-toggle');
  const priceFilterContent = priceFilterContainer.querySelector('.price-filter-content');
  
  if (priceFilterToggle && priceFilterContent) {
    priceFilterToggle.addEventListener('click', function() {
      priceFilterContent.classList.toggle('hidden');
      
      // Toggle icon
      const icon = this.querySelector('ion-icon');
      if (priceFilterContent.classList.contains('hidden')) {
        icon.setAttribute('name', 'chevron-down-outline');
      } else {
        icon.setAttribute('name', 'chevron-up-outline');
      }
    });
  }
  
  // Add event listener to apply filter button
  const applyFilterButton = priceFilterContainer.querySelector('.price-filter-apply');
  if (applyFilterButton) {
    applyFilterButton.addEventListener('click', function() {
      const query = searchInput.value;
      const minPrice = parseFloat(document.getElementById('min-price').value) || null;
      const maxPrice = parseFloat(document.getElementById('max-price').value) || null;
      
      applyFilters(query, minPrice, maxPrice);
    });
  }
  
  // Add event listener to reset filter button
  const resetFilterButton = priceFilterContainer.querySelector('.price-filter-reset');
  if (resetFilterButton) {
    resetFilterButton.addEventListener('click', function() {
      document.getElementById('min-price').value = '';
      document.getElementById('max-price').value = '';
      
      applyFilters(searchInput.value, null, null);
    });
  }
}

/**
 * Apply all filters to wishlist items
 * @param {string} query - Search query
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 */
function applyFilters(query, minPrice, maxPrice) {
  // First filter by price
  let filteredItems = filterWishlistItemsByPrice(minPrice, maxPrice);
  
  // Then filter by search query
  if (query && query.trim() !== '') {
    const searchTerm = query.toLowerCase().trim();
    
    filteredItems = filteredItems.filter(item => {
      const property = item.property;
      
      // Search in various property fields
      return (
        (property.title && property.title.toLowerCase().includes(searchTerm)) ||
        (property.location && property.location.toLowerCase().includes(searchTerm)) ||
        (property.description && property.description.toLowerCase().includes(searchTerm)) ||
        (property.type && property.type.toLowerCase().includes(searchTerm)) ||
        (property.features && property.features.some(feature => 
          feature.toLowerCase().includes(searchTerm)
        ))
      );
    });
  }
  
  // Render filtered items
  renderFilteredItems(filteredItems, query, minPrice, maxPrice);
}

/**
 * Render filtered items
 * @param {Array} filteredItems - Filtered wishlist items
 * @param {string} query - Search query
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 */
function renderFilteredItems(filteredItems, query, minPrice, maxPrice) {
  if (!wishlistItemsContainer) return;
  
  wishlistItemsContainer.innerHTML = '';
  
  if (filteredItems.length === 0) {
    const noResultsMessage = document.createElement('div');
    noResultsMessage.className = 'cart-empty';
    
    let message = 'Your wishlist is empty';
    
    if (query || minPrice !== null || maxPrice !== null) {
      message = 'No results found for the applied filters';
      
      if (query) {
        message += `: "${query}"`;
      }
      
      if (minPrice !== null || maxPrice !== null) {
        message += ' and price range';
        
        if (minPrice !== null && maxPrice !== null) {
          message += ` $${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`;
        } else if (minPrice !== null) {
          message += ` from $${minPrice.toLocaleString()}`;
        } else if (maxPrice !== null) {
          message += ` up to $${maxPrice.toLocaleString()}`;
        }
      }
    }
    
    noResultsMessage.textContent = message;
    wishlistItemsContainer.appendChild(noResultsMessage);
    
    if (wishlistTotalElement) {
      wishlistTotalElement.classList.add('hidden');
    }
    
    return;
  }
  
  // Show wishlist total
  if (wishlistTotalElement) {
    wishlistTotalElement.classList.remove('hidden');
  }
  
  // Render filtered items
  filteredItems.forEach(item => {
    const property = item.property;
    
    const wishlistItem = document.createElement('div');
    wishlistItem.className = 'cart-item';
    
    wishlistItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${property.images[0] || '/assets/images/properties/property-placeholder.jpg'}" alt="${property.title}">
      </div>
      <div class="cart-item-content">
        <h4 class="cart-item-title">${property.title}</h4>
        <p class="cart-item-price">$${property.price.toLocaleString()}</p>
        <p class="cart-item-location">${property.location}</p>
      </div>
      <button class="cart-item-remove" data-property-id="${property._id}">
        <ion-icon name="close-outline"></ion-icon>
      </button>
    `;
    
    wishlistItemsContainer.appendChild(wishlistItem);
    
    // Add event listener to remove button
    const removeButton = wishlistItem.querySelector('.cart-item-remove');
    removeButton.addEventListener('click', function() {
      const propertyId = this.dataset.propertyId;
      removeFromWishlist(propertyId);
    });
  });
  
  // Update total based on filtered items
  updateWishlistTotal(filteredItems);
}

/**
 * Render wishlist items in the sidebar
 */
function renderWishlistItems() {
  if (!wishlistItemsContainer) return;
  
  wishlistItemsContainer.innerHTML = '';
  
  if (wishlistState.items.length === 0) {
    // Show empty wishlist message
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'cart-empty';
    emptyMessage.textContent = 'Your wishlist is empty';
    wishlistItemsContainer.appendChild(emptyMessage);
    return;
  }
  
  wishlistState.items.forEach(item => {
    const property = item.property;
    
    const wishlistItem = document.createElement('div');
    wishlistItem.className = 'cart-item';
    
    wishlistItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${property.images[0] || '/assets/images/properties/property-placeholder.jpg'}" alt="${property.title}">
      </div>
      <div class="cart-item-content">
        <h4 class="cart-item-title">${property.title}</h4>
        <p class="cart-item-price">$${property.price.toLocaleString()}</p>
        <p class="cart-item-location">${property.location}</p>
      </div>
      <button class="cart-item-remove" data-property-id="${property._id}">
        <ion-icon name="close-outline"></ion-icon>
      </button>
    `;
    
    wishlistItemsContainer.appendChild(wishlistItem);
    
    // Add event listener to remove button
    const removeButton = wishlistItem.querySelector('.cart-item-remove');
    removeButton.addEventListener('click', function() {
      const propertyId = this.dataset.propertyId;
      removeFromWishlist(propertyId);
    });
  });
  
  // Update total
  updateWishlistTotal();
}

/**
 * Update wishlist total price
 * @param {Array} items - Wishlist items to calculate total from (optional)
 */
function updateWishlistTotal(items = null) {
  if (!wishlistTotalElement) return;
  
  const itemsToCalculate = items || wishlistState.items;
  
  const total = itemsToCalculate.reduce((sum, item) => {
    return sum + (item.property.price || 0);
  }, 0);
  
  wishlistTotalElement.innerHTML = `
    <div class="cart-total-label">Total Value:</div>
    <div class="cart-total-value">$${total.toLocaleString()}</div>
  `;
}

/**
 * Toggle wishlist sidebar
 */
function toggleWishlist() {
  if (wishlistSidebar) {
    wishlistSidebar.classList.toggle('open');
    document.body.classList.toggle('cart-open');
  }
}

/**
 * Open wishlist sidebar
 */
function openWishlist() {
  if (wishlistSidebar) {
    wishlistSidebar.classList.add('open');
    document.body.classList.add('cart-open');
  }
}

/**
 * Close wishlist sidebar
 */
function closeWishlist() {
  if (wishlistSidebar) {
    wishlistSidebar.classList.remove('open');
    document.body.classList.remove('cart-open');
  }
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hide and remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Initialize wishlist when DOM is loaded
document.addEventListener('DOMContentLoaded', initWishlist);

// Export functions for use in other files
window.wishlistFunctions = {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  openWishlist,
  closeWishlist,
  toggleWishlist,
  filterWishlistItemsByPrice,
  applyFilters
}; 