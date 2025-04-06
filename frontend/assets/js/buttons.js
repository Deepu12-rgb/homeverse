// Functionality for Add Listing, Cart, Search, and Contact buttons

document.addEventListener('DOMContentLoaded', function() {
  // Add Listing Button
  const addListingButtons = document.querySelectorAll('.header-top-btn');
  addListingButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        showModal('Login Required', 'Please login or create an account to add a listing.', [
          { text: 'Login', action: () => window.location.href = 'login.html' },
          { text: 'Sign Up', action: () => window.location.href = 'signup.html' },
          { text: 'Cancel', action: () => closeModal() }
        ]);
      } else {
        window.location.href = 'add-listing.html';
      }
    });
  });

  // Search Button
  const searchButtons = document.querySelectorAll('.header-bottom-actions-btn[aria-label="Search"]');
  searchButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Check if we're on the search page already
      if (window.location.pathname.includes('search.html')) {
        // If already on search page, just focus the search input
        document.getElementById('search-query').focus();
      } else {
        // Otherwise, either show the search overlay or redirect to search page
        if (config.isDirectFileAccess) {
          showSearchOverlay();
        } else {
          window.location.href = 'search.html';
        }
      }
    });
  });

  // Cart Button
  const cartButtons = document.querySelectorAll('.header-bottom-actions-btn[aria-label="Cart"]');
  cartButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Check if we're on the cart page already
      if (window.location.pathname.includes('cart.html')) {
        // If already on cart page, do nothing
        return;
      } else {
        // Otherwise, either show the cart overlay or redirect to cart page
        if (config.isDirectFileAccess) {
          showCartOverlay();
        } else {
          window.location.href = 'cart.html';
        }
      }
    });
  });

  // Note: Contact button functionality is now handled in navigation.js

  // Create modal container if it doesn't exist
  if (!document.getElementById('modal-container')) {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    modalContainer.style.display = 'none';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalContainer.style.zIndex = '9999';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    document.body.appendChild(modalContainer);
  }

  // Create search overlay if it doesn't exist
  if (!document.getElementById('search-overlay')) {
    const searchOverlay = document.createElement('div');
    searchOverlay.id = 'search-overlay';
    searchOverlay.style.display = 'none';
    searchOverlay.style.position = 'fixed';
    searchOverlay.style.top = '0';
    searchOverlay.style.left = '0';
    searchOverlay.style.width = '100%';
    searchOverlay.style.height = '100%';
    searchOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    searchOverlay.style.zIndex = '9998';
    searchOverlay.style.padding = '20px';
    document.body.appendChild(searchOverlay);
  }

  // Create cart overlay if it doesn't exist
  if (!document.getElementById('cart-overlay')) {
    const cartOverlay = document.createElement('div');
    cartOverlay.id = 'cart-overlay';
    cartOverlay.style.display = 'none';
    cartOverlay.style.position = 'fixed';
    cartOverlay.style.top = '0';
    cartOverlay.style.right = '0';
    cartOverlay.style.width = '350px';
    cartOverlay.style.height = '100%';
    cartOverlay.style.backgroundColor = 'white';
    cartOverlay.style.zIndex = '9997';
    cartOverlay.style.boxShadow = '-2px 0 5px rgba(0, 0, 0, 0.1)';
    cartOverlay.style.padding = '20px';
    document.body.appendChild(cartOverlay);
  }
});

// Show modal function
function showModal(title, message, buttons) {
  const modalContainer = document.getElementById('modal-container');
  
  // Clear previous content
  modalContainer.innerHTML = '';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '8px';
  modalContent.style.maxWidth = '400px';
  modalContent.style.width = '100%';
  modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
  
  // Add title
  const modalTitle = document.createElement('h3');
  modalTitle.textContent = title;
  modalTitle.style.marginTop = '0';
  modalTitle.style.color = 'var(--orange-soda, #f85a40)';
  modalContent.appendChild(modalTitle);
  
  // Add message
  const modalMessage = document.createElement('p');
  modalMessage.textContent = message;
  modalContent.appendChild(modalMessage);
  
  // Add buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'flex-end';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.marginTop = '20px';
  
  buttons.forEach(button => {
    const btn = document.createElement('button');
    btn.textContent = button.text;
    btn.style.padding = '8px 16px';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    
    if (button.text === 'Cancel') {
      btn.style.backgroundColor = '#f1f1f1';
      btn.style.color = '#333';
    } else {
      btn.style.backgroundColor = 'var(--orange-soda, #f85a40)';
      btn.style.color = 'white';
    }
    
    btn.addEventListener('click', button.action);
    buttonContainer.appendChild(btn);
  });
  
  modalContent.appendChild(buttonContainer);
  modalContainer.appendChild(modalContent);
  
  // Show modal
  modalContainer.style.display = 'flex';
}

// Close modal function
function closeModal() {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.style.display = 'none';
}

// Show search overlay function
function showSearchOverlay() {
  const searchOverlay = document.getElementById('search-overlay');
  
  // Clear previous content
  searchOverlay.innerHTML = '';
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '20px';
  closeButton.style.right = '20px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '30px';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => {
    searchOverlay.style.display = 'none';
  });
  
  // Create search container
  const searchContainer = document.createElement('div');
  searchContainer.style.maxWidth = '600px';
  searchContainer.style.margin = '100px auto 0';
  searchContainer.style.textAlign = 'center';
  
  // Create search title
  const searchTitle = document.createElement('h2');
  searchTitle.textContent = 'Search Properties';
  searchTitle.style.marginBottom = '30px';
  searchTitle.style.color = 'var(--orange-soda, #f85a40)';
  
  // Create search form
  const searchForm = document.createElement('form');
  searchForm.innerHTML = `
    <div style="display: flex; margin-bottom: 20px;">
      <input type="text" placeholder="Enter location, property type, or keyword" style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 4px 0 0 4px; font-size: 16px;">
      <button type="submit" style="background-color: var(--orange-soda, #f85a40); color: white; border: none; padding: 0 20px; border-radius: 0 4px 4px 0; cursor: pointer;">
        <ion-icon name="search-outline" style="font-size: 20px;"></ion-icon>
      </button>
    </div>
  `;
  
  // Create filter options
  const filterOptions = document.createElement('div');
  filterOptions.style.display = 'flex';
  filterOptions.style.justifyContent = 'space-between';
  filterOptions.style.marginBottom = '30px';
  
  const filters = ['Property Type', 'Price Range', 'Bedrooms', 'Bathrooms'];
  
  filters.forEach(filter => {
    const select = document.createElement('select');
    select.style.padding = '10px';
    select.style.border = '1px solid #ddd';
    select.style.borderRadius = '4px';
    select.style.backgroundColor = 'white';
    
    const defaultOption = document.createElement('option');
    defaultOption.textContent = filter;
    defaultOption.value = '';
    select.appendChild(defaultOption);
    
    // Add some dummy options
    if (filter === 'Property Type') {
      ['Apartment', 'House', 'Villa', 'Office'].forEach(type => {
        const option = document.createElement('option');
        option.textContent = type;
        option.value = type.toLowerCase();
        select.appendChild(option);
      });
    } else if (filter === 'Price Range') {
      ['$0 - $100,000', '$100,000 - $300,000', '$300,000 - $500,000', '$500,000+'].forEach((range, index) => {
        const option = document.createElement('option');
        option.textContent = range;
        option.value = index;
        select.appendChild(option);
      });
    } else if (filter === 'Bedrooms') {
      ['1', '2', '3', '4+'].forEach(count => {
        const option = document.createElement('option');
        option.textContent = count;
        option.value = count;
        select.appendChild(option);
      });
    } else if (filter === 'Bathrooms') {
      ['1', '2', '3', '4+'].forEach(count => {
        const option = document.createElement('option');
        option.textContent = count;
        option.value = count;
        select.appendChild(option);
      });
    }
    
    filterOptions.appendChild(select);
  });
  
  // Create popular searches
  const popularSearches = document.createElement('div');
  popularSearches.style.marginTop = '40px';
  
  const popularTitle = document.createElement('h3');
  popularTitle.textContent = 'Popular Searches';
  popularTitle.style.marginBottom = '15px';
  popularTitle.style.textAlign = 'left';
  
  const tagContainer = document.createElement('div');
  tagContainer.style.display = 'flex';
  tagContainer.style.flexWrap = 'wrap';
  tagContainer.style.gap = '10px';
  
  ['New York Apartments', 'Chicago Houses', 'Miami Villas', 'Los Angeles Offices', 'San Francisco Condos'].forEach(tag => {
    const tagElement = document.createElement('span');
    tagElement.textContent = tag;
    tagElement.style.padding = '8px 15px';
    tagElement.style.backgroundColor = '#f1f1f1';
    tagElement.style.borderRadius = '20px';
    tagElement.style.cursor = 'pointer';
    tagElement.addEventListener('click', () => {
      const input = searchForm.querySelector('input');
      input.value = tag;
    });
    
    tagContainer.appendChild(tagElement);
  });
  
  popularSearches.appendChild(popularTitle);
  popularSearches.appendChild(tagContainer);
  
  // Add event listener to search form
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = searchForm.querySelector('input').value;
    alert(`Searching for: ${searchTerm}`);
    // In a real application, you would redirect to search results page
  });
  
  // Assemble the search overlay
  searchContainer.appendChild(searchTitle);
  searchContainer.appendChild(searchForm);
  searchContainer.appendChild(filterOptions);
  searchContainer.appendChild(popularSearches);
  
  searchOverlay.appendChild(closeButton);
  searchOverlay.appendChild(searchContainer);
  
  // Show search overlay
  searchOverlay.style.display = 'block';
}

// Show cart overlay function
function showCartOverlay() {
  const cartOverlay = document.getElementById('cart-overlay');
  
  // Clear previous content
  cartOverlay.innerHTML = '';
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '20px';
  closeButton.style.right = '20px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '30px';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => {
    cartOverlay.style.display = 'none';
  });
  
  // Create cart title
  const cartTitle = document.createElement('h2');
  cartTitle.textContent = 'Your Cart';
  cartTitle.style.marginBottom = '30px';
  cartTitle.style.paddingBottom = '10px';
  cartTitle.style.borderBottom = '1px solid #eee';
  
  // Create empty cart message
  const emptyCartMessage = document.createElement('p');
  emptyCartMessage.textContent = 'Your cart is empty.';
  emptyCartMessage.style.textAlign = 'center';
  emptyCartMessage.style.color = '#888';
  emptyCartMessage.style.margin = '50px 0';
  
  // Create continue shopping button
  const continueShoppingButton = document.createElement('button');
  continueShoppingButton.textContent = 'Continue Shopping';
  continueShoppingButton.style.display = 'block';
  continueShoppingButton.style.width = '100%';
  continueShoppingButton.style.padding = '12px';
  continueShoppingButton.style.backgroundColor = 'var(--orange-soda, #f85a40)';
  continueShoppingButton.style.color = 'white';
  continueShoppingButton.style.border = 'none';
  continueShoppingButton.style.borderRadius = '4px';
  continueShoppingButton.style.cursor = 'pointer';
  continueShoppingButton.style.marginTop = '20px';
  continueShoppingButton.addEventListener('click', () => {
    cartOverlay.style.display = 'none';
  });
  
  // Assemble the cart overlay
  cartOverlay.appendChild(closeButton);
  cartOverlay.appendChild(cartTitle);
  cartOverlay.appendChild(emptyCartMessage);
  cartOverlay.appendChild(continueShoppingButton);
  
  // Show cart overlay
  cartOverlay.style.display = 'block';
}

// Create Add Listing page
function createAddListingPage() {
  // This function would create the add-listing.html page
  // For now, we'll just create a simple placeholder
  const addListingHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Listing - Homeverse</title>
    <link rel="shortcut icon" href="./favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="./assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <!-- Header would go here -->
    
    <main>
      <section class="add-listing-section" style="padding: 80px 0;">
        <div class="container">
          <h2 class="h2">Add New Listing</h2>
          
          <form id="add-listing-form" style="margin-top: 40px;">
            <!-- Form fields would go here -->
            <p>This page is under construction. Please check back later.</p>
          </form>
        </div>
      </section>
    </main>
    
    <!-- Footer would go here -->
    
    <script src="./assets/js/script.js"></script>
    <script src="./assets/js/config.js"></script>
    <script src="./assets/js/buttons.js"></script>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
  </body>
  </html>
  `;
  
  return addListingHTML;
}

/**
 * Button functionality for Homeverse
 */

document.addEventListener('DOMContentLoaded', () => {
  initButtons();
});

/**
 * Initialize button functionality
 */
function initButtons() {
  // Add Listing Button functionality
  initAddListingButtons();
  
  // Search Button functionality
  initSearchButtons();
  
  // Cart Button functionality
  initCartButtons();
  
  // CTA Explore Properties button
  const ctaButton = document.querySelector('.cta-btn');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      const propertySection = document.getElementById('property');
      if (propertySection) {
        propertySection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// Initialize Add Listing Buttons
function initAddListingButtons() {
  const addListingButtons = document.querySelectorAll('.header-top-btn');
  addListingButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        showModal('Login Required', 'Please login or create an account to add a listing.', [
          { text: 'Login', action: () => window.location.href = 'login.html' },
          { text: 'Sign Up', action: () => window.location.href = 'signup.html' },
          { text: 'Cancel', action: () => closeModal() }
        ]);
      } else {
        window.location.href = 'add-listing.html';
      }
    });
  });
}

// Initialize Search Buttons
function initSearchButtons() {
  const searchButtons = document.querySelectorAll('.header-bottom-actions-btn[aria-label="Search"]');
  searchButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Check if we're on the search page already
      if (window.location.pathname.includes('search.html')) {
        // If already on search page, just focus the search input
        document.getElementById('search-query').focus();
      } else {
        // Otherwise, either show the search overlay or redirect to search page
        if (typeof config !== 'undefined' && config.isDirectFileAccess) {
          showSearchOverlay();
        } else {
          window.location.href = 'search.html';
        }
      }
    });
  });
}

// Initialize Cart Buttons
function initCartButtons() {
  const cartButtons = document.querySelectorAll('.header-bottom-actions-btn[aria-label="Cart"]');
  cartButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Check if we're on the cart page already
      if (window.location.pathname.includes('cart.html')) {
        // If already on cart page, do nothing
        return;
      } else {
        // Otherwise, either show the cart overlay or redirect to cart page
        if (typeof config !== 'undefined' && config.isDirectFileAccess) {
          showCartOverlay();
        } else {
          window.location.href = 'cart.html';
        }
      }
    });
  });
} 