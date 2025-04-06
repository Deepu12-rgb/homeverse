'use strict';

/**
 * element toggle function
 */

const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [overlay, navCloseBtn, navOpenBtn];

/**
 * close navbar when click on any navbar link
 */

for (let i = 0; i < navbarLinks.length; i++) { navElemArr.push(navbarLinks[i]); }

/**
 * addd event on all elements for toggling navbar
 */

for (let i = 0; i < navElemArr.length; i++) {
  navElemArr[i].addEventListener("click", function () {
    elemToggleFunc(navbar);
    elemToggleFunc(overlay);
  });
}



/**
 * header active state
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 400 ? header.classList.add("active")
    : header.classList.remove("active");
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