/**
 * Navigation - Handles navigation functionality for the Homeverse website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation links
  initNavLinks();
  
  // Initialize contact button
  initContactButton();
  
  // Initialize contact form if on contact page
  if (window.location.pathname.includes('contact.html')) {
    initContactForm();
  }
  
  // Initialize logout functionality
  initLogout();
});

/**
 * Initialize navigation links
 */
function initNavLinks() {
  const navLinks = document.querySelectorAll('.navbar-link[data-nav-link]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const target = this.getAttribute('href');
      
      // If it's a section on the current page
      if (target.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(target);
        
        if (targetSection) {
          // Scroll to the section
          targetSection.scrollIntoView({ behavior: 'smooth' });
          
          // Close mobile menu if open
          const navbar = document.querySelector('[data-navbar]');
          if (navbar && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            document.querySelector('[data-overlay]').classList.remove('active');
          }
        } else {
          // If section doesn't exist on current page, redirect to home page with anchor
          if (!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html' + target;
          }
        }
      }
    });
  });
}

/**
 * Initialize contact button
 */
function initContactButton() {
  // Target all contact links in the navigation menu
  const contactLinks = document.querySelectorAll('a[href="#contact"]');
  
  // Handle navigation contact links
  contactLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Redirect to contact page
      window.location.href = 'contact.html';
    });
  });
  
  // Handle "Contact us" links in the footer
  const footerLinks = document.querySelectorAll('.footer-link');
  footerLinks.forEach(link => {
    if (link.textContent.trim() === 'Contact us') {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Redirect to contact page
        window.location.href = 'contact.html';
      });
    }
  });
}

/**
 * Initialize form submission
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const formValues = Object.fromEntries(formData.entries());
      
      // In a real application, you would send this data to the server
      console.log('Form data:', formValues);
      
      // Show success message
      alert('Thank you for your message. We will get back to you soon!');
      
      // Reset form
      contactForm.reset();
    });
  }
}

/**
 * Initialize logout functionality
 */
function initLogout() {
  const logoutLinks = document.querySelectorAll('#logout-link');
  
  logoutLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Clear user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to home page
      window.location.href = 'index.html';
    });
  });
} 