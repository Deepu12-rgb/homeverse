// Property Search Functionality

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const sortBtn = document.querySelector('.sort-btn');
  
  // Helper function to fetch properties
  function fetchProperties() {
    // This would be an API call in a real application
    console.log('Fetching properties');
    
    // For demonstration, we'll show a loading state
    const propertyGrid = document.querySelector('.property-grid');
    if (propertyGrid) {
      propertyGrid.innerHTML = '<div class="loading">Loading properties...</div>';
      
      // Simulate API delay
      setTimeout(() => {
        // You would replace this with actual API data
        propertyGrid.innerHTML = getPropertyCards(8);
        
        // Add pagination after results
        if (!document.querySelector('.pagination')) {
          const pagination = createPagination(5, 1);
          document.querySelector('.property-results').appendChild(pagination);
        }
      }, 1000);
    }
  }
  
  // Helper function to generate property cards (for demo)
  function getPropertyCards(count) {
    let cards = '';
    for (let i = 0; i < count; i++) {
      cards += `
        <div class="property-card" data-id="property-${i+1}">
          <figure class="card-banner">
            <a href="property-details.html?id=${i+1}">
              <img src="./assets/images/property-${(i % 4) + 1}.jpg" alt="Property" class="w-100">
            </a>
            <div class="card-badge ${i % 2 === 0 ? 'green' : 'orange'}">${i % 2 === 0 ? 'For Rent' : 'For Sale'}</div>
          </figure>
          <div class="card-content">
            <div class="card-price">
              <strong>$${(Math.floor(Math.random() * 9) + 1) * 100},${Math.floor(Math.random() * 900) + 100}</strong>${i % 2 === 0 ? '/Month' : ''}
            </div>
            <h3 class="h3 card-title">
              <a href="property-details.html?id=${i+1}">Beautiful Home in Location ${i+1}</a>
            </h3>
            <p class="card-text">
              Modern property with great amenities in a prime location, featuring stunning views and updated interiors.
            </p>
            <ul class="card-list">
              <li class="card-item">
                <strong>${Math.floor(Math.random() * 4) + 1}</strong>
                <ion-icon name="bed-outline"></ion-icon>
                <span>Bedrooms</span>
              </li>
              <li class="card-item">
                <strong>${Math.floor(Math.random() * 3) + 1}</strong>
                <ion-icon name="man-outline"></ion-icon>
                <span>Bathrooms</span>
              </li>
              <li class="card-item">
                <strong>${(Math.floor(Math.random() * 20) + 10) * 100}</strong>
                <ion-icon name="square-outline"></ion-icon>
                <span>Square Ft</span>
              </li>
            </ul>
          </div>
        </div>
      `;
    }
    return cards;
  }
  
  // Helper function to create pagination
  function createPagination(totalPages, currentPage) {
    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = `page-link ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.innerHTML = '<ion-icon name="chevron-back-outline"></ion-icon>';
    pagination.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('button');
      pageLink.className = `page-link ${i === currentPage ? 'active' : ''}`;
      pageLink.textContent = i;
      pagination.appendChild(pageLink);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = `page-link ${currentPage === totalPages ? 'disabled' : ''}`;
    nextBtn.innerHTML = '<ion-icon name="chevron-forward-outline"></ion-icon>';
    pagination.appendChild(nextBtn);
    
    return pagination;
  }
  
  // Initialize the page
  fetchProperties();
}); 