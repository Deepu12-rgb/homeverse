'use strict';

/**
 * element toggle function
 */

const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }

/**
 * add event on element
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}

/**
 * navbar toggle
 */

const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector(".overlay");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElem(navToggleBtn, "click", toggleNavbar);

/**
 * close navbar when clicking on overlay or close button
 */

const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("nav-active");
}

addEventOnElem(navCloseBtn, "click", closeNavbar);
addEventOnElem(overlay, "click", closeNavbar);

/**
 * close navbar when clicking on a nav link on mobile
 */

const navbarLinks = document.querySelectorAll(".navbar-link");
if (window.innerWidth < 1200) {
  addEventOnElem(navbarLinks, "click", closeNavbar);
}

/**
 * header active state
 */

const header = document.querySelector(".header");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", function () {
  if (lastScrollY < window.scrollY) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }
  
  lastScrollY = window.scrollY;
  
  if (window.scrollY > 50) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});

/**
 * Check if user is logged in and update navigation
 */

document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  const loginLinks = document.querySelectorAll('a[href="login.html"]');
  const signupLinks = document.querySelectorAll('a[href="signup.html"]');
  const profileLinks = document.querySelectorAll('a[href="profile.html"]');
  
  if (token) {
    // User is logged in
    loginLinks.forEach(link => {
      const listItem = link.parentElement;
      if (listItem) {
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.className = link.className;
        logoutLink.textContent = 'Logout';
        logoutLink.addEventListener('click', function(e) {
          e.preventDefault();
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.reload();
        });
        listItem.replaceChild(logoutLink, link);
      }
    });
    
    // Hide signup links
    signupLinks.forEach(link => {
      const listItem = link.parentElement;
      if (listItem) {
        listItem.style.display = 'none';
      }
    });
  } else {
    // User is not logged in
    profileLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'login.html';
      });
    });
  }
});

// Remove property search code and filter dropdowns
document.addEventListener('DOMContentLoaded', function() {
  // Keep only essential functionality for the site
  // All property search filter code has been removed
});

// Initialize dropdown functionality if needed
const dropdownButtons = document.querySelectorAll('.header-bottom-actions-btn[aria-label="Profile"]');
dropdownButtons.forEach(button => {
  const dropdown = button.querySelector('.profile-dropdown');
  if (dropdown) {
    button.addEventListener('click', () => {
      dropdown.classList.toggle('show');
    });
  }
});

// Search functionality
const searchBtn = document.querySelector('[aria-label="Search"]');
const searchModal = document.createElement('div');
searchModal.className = 'search-modal';
searchModal.innerHTML = `
  <div class="search-modal-content">
    <div class="search-modal-header">
      <h3>Search Properties</h3>
      <button class="close-search-btn">&times;</button>
    </div>
    <div class="search-modal-body">
      <form class="search-form" id="searchForm">
        <div class="form-group">
          <input type="text" placeholder="Search by location, property type, or keywords" required>
        </div>
        <div class="form-group">
          <select>
            <option value="">Property Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div class="form-group">
          <select>
            <option value="">Price Range</option>
            <option value="0-100000">$0 - $100,000</option>
            <option value="100000-500000">$100,000 - $500,000</option>
            <option value="500000-1000000">$500,000 - $1,000,000</option>
            <option value="1000000+">$1,000,000+</option>
          </select>
        </div>
        <button type="submit" class="btn">Search</button>
      </form>
    </div>
  </div>
`;

document.body.appendChild(searchModal);

searchBtn.addEventListener('click', () => {
  searchModal.classList.add('active');
});

searchModal.querySelector('.close-search-btn').addEventListener('click', () => {
  searchModal.classList.remove('active');
});

searchModal.querySelector('#searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const searchData = new FormData(e.target);
  // Handle search functionality here
  console.log('Search submitted:', Object.fromEntries(searchData));
  searchModal.classList.remove('active');
});

// Add styles for search modal
const style = document.createElement('style');
style.textContent = `
  .search-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .search-modal.active {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
  }

  .search-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .close-search-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .search-form .form-group {
    margin-bottom: 1rem;
  }

  .search-form input,
  .search-form select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;
document.head.appendChild(style); 