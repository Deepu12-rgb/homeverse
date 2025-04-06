/**
 * Property Card Enhancement
 * Adds "Add to Wishlist" buttons to property cards
 */

document.addEventListener('DOMContentLoaded', function() {
  // Find all property cards
  const propertyCards = document.querySelectorAll('.property-card');
  
  // Add "Add to Wishlist" button to each card
  propertyCards.forEach(card => {
    // Get property ID from data attribute
    const propertyId = card.dataset.id || card.getAttribute('data-id');
    
    if (!propertyId) return;
    
    // Find the card footer
    const cardFooter = card.querySelector('.card-footer');
    
    if (!cardFooter) return;
    
    // Create "Add to Wishlist" button
    const addToWishlistBtn = document.createElement('button');
    addToWishlistBtn.className = 'add-to-wishlist-btn';
    addToWishlistBtn.dataset.propertyId = propertyId;
    addToWishlistBtn.innerHTML = `
      <ion-icon name="heart-outline"></ion-icon>
      Add to Wishlist
    `;
    
    // Add event listener to the button
    addToWishlistBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Call addToWishlist function from wishlist.js
      if (window.wishlistFunctions && window.wishlistFunctions.addToWishlist) {
        window.wishlistFunctions.addToWishlist(propertyId);
      } else {
        console.error('Wishlist functions not available');
      }
    });
    
    // Append button to card footer
    cardFooter.appendChild(addToWishlistBtn);
  });
  
  // Add "Add to Wishlist" button to property details page
  const propertyDetailsPage = document.querySelector('.property-details');
  
  if (propertyDetailsPage) {
    // Find the property actions section
    const propertyActions = document.querySelector('.property-actions') || 
                           document.querySelector('.property-details-actions');
    
    if (propertyActions) {
      // Get property ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const propertyId = urlParams.get('id');
      
      if (propertyId) {
        // Create "Add to Wishlist" button
        const addToWishlistBtn = document.createElement('button');
        addToWishlistBtn.className = 'add-to-wishlist-btn';
        addToWishlistBtn.dataset.propertyId = propertyId;
        addToWishlistBtn.innerHTML = `
          <ion-icon name="heart-outline"></ion-icon>
          Add to Wishlist
        `;
        
        // Add event listener to the button
        addToWishlistBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Call addToWishlist function from wishlist.js
          if (window.wishlistFunctions && window.wishlistFunctions.addToWishlist) {
            window.wishlistFunctions.addToWishlist(propertyId);
          } else {
            console.error('Wishlist functions not available');
          }
        });
        
        // Append button to property actions
        propertyActions.appendChild(addToWishlistBtn);
      }
    }
  }
});

function addToCompare(card) {
  const propertyId = card.dataset.id;
  const compareBtn = card.querySelector('[name="add-circle-outline"]').closest('button');
  
  // Get current compare list from localStorage
  let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
  
  if (compareList.includes(propertyId)) {
    // Remove from compare list
    compareList = compareList.filter(id => id !== propertyId);
    compareBtn.classList.remove('active');
  } else {
    // Add to compare list
    if (compareList.length >= 3) {
      alert('You can only compare up to 3 properties at a time');
      return;
    }
    compareList.push(propertyId);
    compareBtn.classList.add('active');
  }
  
  // Save updated compare list
  localStorage.setItem('compareList', JSON.stringify(compareList));
  
  // Update compare count in header if it exists
  updateCompareCount();
}

// Add styles for compare functionality
const compareStyle = document.createElement('style');
compareStyle.textContent = `
  .card-content {
    transition: max-height 0.3s ease-out;
    overflow: hidden;
  }
  
  .card-footer-actions-btn.active {
    color: var(--orange-soda);
  }
`;
document.head.appendChild(compareStyle); 