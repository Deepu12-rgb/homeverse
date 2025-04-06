// Saved Homes Functionality
document.addEventListener('DOMContentLoaded', () => {
  loadSavedHomes();
  setupEventListeners();
});

// Load saved homes
function loadSavedHomes() {
  const savedHomes = JSON.parse(localStorage.getItem('savedHomes')) || [];
  const savedHomesGrid = document.querySelector('.saved-homes-grid');
  const emptyState = document.querySelector('.empty-state');

  if (savedHomes.length === 0) {
    savedHomesGrid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  savedHomesGrid.style.display = 'grid';
  emptyState.style.display = 'none';

  savedHomesGrid.innerHTML = savedHomes.map(home => createPropertyCard(home)).join('');
  updateWishlistCount();
}

// Create property card HTML
function createPropertyCard(property) {
  return `
    <div class="property-card" data-id="${property.id}">
      <div class="card-banner">
        <img src="${property.image}" alt="${property.title}">
        <div class="banner-actions">
          <button class="banner-actions-btn remove-saved" data-id="${property.id}">
            <ion-icon name="heart-dislike-outline"></ion-icon>
            Remove
          </button>
        </div>
      </div>
      <div class="card-content">
        <div class="card-price">$${property.price.toLocaleString()}</div>
        <h3 class="card-title">
          <a href="property-details.html?id=${property.id}">${property.title}</a>
        </h3>
        <p class="card-text">${property.description}</p>
        <ul class="card-list">
          <li class="card-item">
            <ion-icon name="bed-outline"></ion-icon>
            <span>${property.bedrooms} Beds</span>
          </li>
          <li class="card-item">
            <ion-icon name="water-outline"></ion-icon>
            <span>${property.bathrooms} Baths</span>
          </li>
          <li class="card-item">
            <ion-icon name="square-outline"></ion-icon>
            <span>${property.area} sqft</span>
          </li>
        </ul>
        <div class="card-buttons">
          <a href="property-details.html?id=${property.id}" class="card-btn">View Details</a>
          <button class="card-btn contact-agent" data-id="${property.id}">Contact Agent</button>
        </div>
      </div>
    </div>
  `;
}

// Setup event listeners
function setupEventListeners() {
  // Remove saved home
  document.addEventListener('click', (e) => {
    if (e.target.closest('.remove-saved')) {
      const propertyId = e.target.closest('.remove-saved').dataset.id;
      removeSavedHome(propertyId);
    }
  });

  // Contact agent
  document.addEventListener('click', (e) => {
    if (e.target.closest('.contact-agent')) {
      const propertyId = e.target.closest('.contact-agent').dataset.id;
      contactAgent(propertyId);
    }
  });

  // Browse properties button
  const browseBtn = document.querySelector('.empty-state .btn');
  if (browseBtn) {
    browseBtn.addEventListener('click', () => {
      window.location.href = 'properties.html';
    });
  }
}

// Remove saved home
function removeSavedHome(propertyId) {
  const savedHomes = JSON.parse(localStorage.getItem('savedHomes')) || [];
  const updatedHomes = savedHomes.filter(home => home.id !== propertyId);
  
  localStorage.setItem('savedHomes', JSON.stringify(updatedHomes));
  
  // Animate card removal
  const card = document.querySelector(`.property-card[data-id="${propertyId}"]`);
  card.style.transform = 'scale(0.8)';
  card.style.opacity = '0';
  
  setTimeout(() => {
    loadSavedHomes();
  }, 300);

  showNotification('Property removed from saved homes');
}

// Contact agent
function contactAgent(propertyId) {
  window.location.href = `contact.html?property=${propertyId}`;
}

// Update wishlist count in header
function updateWishlistCount() {
  const savedHomes = JSON.parse(localStorage.getItem('savedHomes')) || [];
  const wishlistCount = document.querySelector('.wishlist-count');
  if (wishlistCount) {
    wishlistCount.textContent = savedHomes.length;
  }
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