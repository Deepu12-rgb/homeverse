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