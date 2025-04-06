/**
 * Queries Management for Homeverse
 * Handles displaying and managing user queries
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the queries page
  initQueriesPage();
  
  // Initialize the query detail modal
  initQueryDetailModal();
  
  // Initialize the token modal
  initTokenModal();
});

/**
 * Initialize the queries page
 */
function initQueriesPage() {
  const queriesEmpty = document.querySelector('.queries-empty');
  const queriesList = document.querySelector('.queries-list');
  const searchInput = document.getElementById('querySearchInput');
  const searchBtn = document.getElementById('querySearchBtn');
  const enquiryBtn = document.querySelector('.queries-empty .hero-enquiry-btn');
  
  // Add event listener to search button
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      renderQueries(searchTerm);
    });
  }
  
  // Add event listener to search input for enter key
  if (searchInput) {
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim().toLowerCase();
        renderQueries(searchTerm);
      }
    });
  }
  
  // Add event listener to enquiry button
  if (enquiryBtn) {
    enquiryBtn.addEventListener('click', function() {
      openEnquiryModal();
    });
  }
  
  // Render queries on page load
  renderQueries();
  
  /**
   * Render queries based on search term
   * @param {string} searchTerm - Optional search term
   */
  async function renderQueries(searchTerm = '') {
    // Show loading state
    queriesList.innerHTML = '<div class="loading-spinner">Loading...</div>';
    
    try {
      let queries = [];
      
      // Try to get queries from API first
      if (window.EnquiryService) {
        // Get user email from localStorage or session
        const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
        
        if (userEmail) {
          const response = await EnquiryService.getEnquiriesByEmail(userEmail);
          
          if (response.success) {
            queries = response.enquiries;
          }
        }
      }
      
      // Fallback to local storage if API failed or no email
      if (queries.length === 0 && window.QueryManager) {
        queries = QueryManager.getAllQueries();
      }
      
      // Filter queries if search term is provided
      const filteredQueries = searchTerm 
        ? queries.filter(query => 
            query.token.toLowerCase().includes(searchTerm) || 
            query.subject.toLowerCase().includes(searchTerm) ||
            query.message.toLowerCase().includes(searchTerm)
          )
        : queries;
      
      // Show empty state if no queries
      if (filteredQueries.length === 0) {
        queriesEmpty.style.display = 'block';
        queriesList.style.display = 'none';
        return;
      }
      
      // Hide empty state and show queries list
      queriesEmpty.style.display = 'none';
      queriesList.style.display = 'grid';
      
      // Clear existing queries
      queriesList.innerHTML = '';
      
      // Sort queries by timestamp (newest first)
      filteredQueries.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
      
      // Render each query
      filteredQueries.forEach(query => {
        const queryCard = createQueryCard(query);
        queriesList.appendChild(queryCard);
      });
    } catch (error) {
      console.error('Error rendering queries:', error);
      queriesList.innerHTML = '<div class="error-message">Error loading queries. Please try again.</div>';
    }
  }
  
  /**
   * Create a query card element
   * @param {Object} query - The query object
   * @returns {HTMLElement} The query card element
   */
  function createQueryCard(query) {
    const card = document.createElement('div');
    card.className = 'query-card';
    card.dataset.token = query.token;
    
    const formattedDate = formatDate(query.timestamp || query.createdAt);
    const statusBadge = getStatusBadgeHTML(query.status);
    const messagePreview = query.message.length > 100 
      ? query.message.substring(0, 100) + '...' 
      : query.message;
    
    card.innerHTML = `
      <div class="query-card-header">
        <div class="query-token">${query.token}</div>
        <div class="query-date">${formattedDate}</div>
      </div>
      <div class="query-card-body">
        <h3 class="query-subject">${query.subject}</h3>
        <p class="query-message">${messagePreview}</p>
        <div class="query-info">
          <div class="query-info-item">
            <ion-icon name="person-outline"></ion-icon>
            <span>${query.name}</span>
          </div>
          <div class="query-info-item">
            <ion-icon name="mail-outline"></ion-icon>
            <span>${query.email}</span>
          </div>
          ${query.phone ? `
          <div class="query-info-item">
            <ion-icon name="call-outline"></ion-icon>
            <span>${query.phone}</span>
          </div>
          ` : ''}
        </div>
      </div>
      <div class="query-card-footer">
        <div>${statusBadge}</div>
        <div class="query-actions">
          <button class="query-action-btn view-btn" data-token="${query.token}">View Details</button>
          <button class="query-action-btn delete-btn" data-token="${query.token}">Delete</button>
        </div>
      </div>
    `;
    
    // Add event listeners to buttons
    const viewBtn = card.querySelector('.view-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    
    viewBtn.addEventListener('click', function() {
      openQueryDetailModal(query.token);
    });
    
    deleteBtn.addEventListener('click', async function() {
      if (confirm(`Are you sure you want to delete query ${query.token}?`)) {
        // Delete from local storage
        if (window.QueryManager) {
          QueryManager.deleteQuery(query.token);
        }
        
        // Refresh the queries list
        renderQueries();
      }
    });
    
    return card;
  }
  
  /**
   * Format a date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  /**
   * Get status badge HTML
   * @param {string} status - The status
   * @returns {string} HTML for the status badge
   */
  function getStatusBadgeHTML(status) {
    let colorClass = '';
    
    switch(status) {
      case 'Pending':
        colorClass = 'status-pending';
        break;
      case 'In Progress':
        colorClass = 'status-in-progress';
        break;
      case 'Resolved':
        colorClass = 'status-resolved';
        break;
      case 'Closed':
        colorClass = 'status-closed';
        break;
      default:
        colorClass = 'status-pending';
    }
    
    return `<span class="status-badge ${colorClass}">${status}</span>`;
  }
}

/**
 * Initialize the query detail modal
 */
function initQueryDetailModal() {
  const modal = document.getElementById('queryDetailModal');
  const closeBtn = modal.querySelector('.close-query-detail-btn');
  const updateStatusBtn = document.getElementById('updateStatusBtn');
  const closeQueryBtn = document.getElementById('closeQueryBtn');
  
  // Close modal when clicking the close button
  closeBtn.addEventListener('click', closeQueryDetailModal);
  
  // Close modal when clicking outside the modal content
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeQueryDetailModal();
    }
  });
  
  // Update status button
  updateStatusBtn.addEventListener('click', async function() {
    const token = modal.dataset.token;
    const status = document.getElementById('queryStatusSelect').value;
    
    // Update status in local storage
    if (window.QueryManager) {
      QueryManager.updateQueryStatus(token, status);
    }
    
    // Update the query card status badge
    const queryCard = document.querySelector(`.query-card[data-token="${token}"]`);
    if (queryCard) {
      const statusBadgeContainer = queryCard.querySelector('.query-card-footer > div:first-child');
      statusBadgeContainer.innerHTML = getStatusBadgeHTML(status);
    }
    
    // Show notification
    showNotification(`Query status updated to ${status}`);
    
    // Refresh the modal
    openQueryDetailModal(token);
  });
  
  // Close query button
  closeQueryBtn.addEventListener('click', async function() {
    const token = modal.dataset.token;
    
    if (confirm('Are you sure you want to close this query? This will mark it as Closed.')) {
      // Update status in local storage
      if (window.QueryManager) {
        QueryManager.updateQueryStatus(token, 'Closed');
      }
      
      // Update the query card status badge
      const queryCard = document.querySelector(`.query-card[data-token="${token}"]`);
      if (queryCard) {
        const statusBadgeContainer = queryCard.querySelector('.query-card-footer > div:first-child');
        statusBadgeContainer.innerHTML = getStatusBadgeHTML('Closed');
      }
      
      // Show notification
      showNotification('Query has been closed');
      
      closeQueryDetailModal();
    }
  });
  
  /**
   * Get status badge HTML
   * @param {string} status - The status
   * @returns {string} HTML for the status badge
   */
  function getStatusBadgeHTML(status) {
    let colorClass = '';
    
    switch(status) {
      case 'Pending':
        colorClass = 'status-pending';
        break;
      case 'In Progress':
        colorClass = 'status-in-progress';
        break;
      case 'Resolved':
        colorClass = 'status-resolved';
        break;
      case 'Closed':
        colorClass = 'status-closed';
        break;
      default:
        colorClass = 'status-pending';
    }
    
    return `<span class="status-badge ${colorClass}">${status}</span>`;
  }
}

/**
 * Open the query detail modal
 * @param {string} token - The token of the query to display
 */
async function openQueryDetailModal(token) {
  const modal = document.getElementById('queryDetailModal');
  const modalBody = modal.querySelector('.query-detail-body');
  const statusSelect = document.getElementById('queryStatusSelect');
  
  // Show loading state
  modalBody.innerHTML = '<div class="loading-spinner">Loading...</div>';
  
  try {
    let query = null;
    
    // Try to get query from API first
    if (window.EnquiryService) {
      const response = await EnquiryService.getEnquiryByToken(token);
      
      if (response.success) {
        query = response.enquiry;
      }
    }
    
    // Fallback to local storage if API failed
    if (!query && window.QueryManager) {
      query = QueryManager.getQueryByToken(token);
    }
    
    if (!query) {
      showNotification('Query not found', 'error');
      closeQueryDetailModal();
      return;
    }
    
    // Set the token in the modal dataset
    modal.dataset.token = token;
    
    // Set the status select value
    statusSelect.value = query.status;
    
    // Format the date
    const formattedDate = formatDate(query.timestamp || query.createdAt);
    
    // Create the modal content
    let modalContent = `
      <div class="query-detail-info">
        <div class="query-detail-item">
          <div class="query-detail-label">Token</div>
          <div class="query-detail-value">${query.token}</div>
        </div>
        <div class="query-detail-item">
          <div class="query-detail-label">Date</div>
          <div class="query-detail-value">${formattedDate}</div>
        </div>
        <div class="query-detail-item">
          <div class="query-detail-label">Status</div>
          <div class="query-detail-value">${getStatusBadgeHTML(query.status)}</div>
        </div>
        <div class="query-detail-item">
          <div class="query-detail-label">Name</div>
          <div class="query-detail-value">${query.name}</div>
        </div>
        <div class="query-detail-item">
          <div class="query-detail-label">Email</div>
          <div class="query-detail-value">${query.email}</div>
        </div>
        ${query.phone ? `
        <div class="query-detail-item">
          <div class="query-detail-label">Phone</div>
          <div class="query-detail-value">${query.phone}</div>
        </div>
        ` : ''}
      </div>
      
      <div class="query-message-container">
        <div class="query-message-label">Subject</div>
        <div class="query-message-text">${query.subject}</div>
      </div>
      
      <div class="query-message-container">
        <div class="query-message-label">Message</div>
        <div class="query-message-text">${query.message}</div>
      </div>
    `;
    
    // Add responses if any
    if (query.responses && query.responses.length > 0) {
      modalContent += `
        <div class="query-responses">
          <h4 class="query-responses-title">Responses</h4>
          <div class="response-list">
      `;
      
      query.responses.forEach(response => {
        const formattedResponseDate = formatDate(response.timestamp);
        const responseClass = response.isAdmin ? 'admin' : 'user';
        const author = response.isAdmin ? 'Homeverse Support' : query.name;
        
        modalContent += `
          <div class="response-item ${responseClass}">
            <div class="response-header">
              <div class="response-author">${author}</div>
              <div class="response-time">${formattedResponseDate}</div>
            </div>
            <div class="response-text">${response.text}</div>
          </div>
        `;
      });
      
      modalContent += `
          </div>
        </div>
      `;
    }
    
    // Add reply form
    modalContent += `
      <div class="query-reply-form">
        <textarea id="queryReplyText" placeholder="Write your reply here..."></textarea>
        <button id="queryReplyBtn">Send Reply</button>
      </div>
    `;
    
    // Set the modal content
    modalBody.innerHTML = modalContent;
    
    // Add event listener to reply button
    const replyBtn = document.getElementById('queryReplyBtn');
    const replyText = document.getElementById('queryReplyText');
    
    replyBtn.addEventListener('click', async function() {
      const reply = replyText.value.trim();
      
      if (!reply) {
        showNotification('Please enter a reply', 'error');
        return;
      }
      
      try {
        // Disable button
        replyBtn.disabled = true;
        replyBtn.textContent = 'Sending...';
        
        let success = false;
        
        // Try to add response via API first
        if (window.EnquiryService) {
          const response = await EnquiryService.addResponse(token, reply, query.email);
          success = response.success;
        }
        
        // Fallback to local storage if API failed
        if (!success && window.QueryManager) {
          success = QueryManager.addUserReply(token, reply);
        }
        
        if (success) {
          showNotification('Reply sent successfully');
          replyText.value = '';
          
          // Refresh the modal
          openQueryDetailModal(token);
        } else {
          showNotification('Error sending reply. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error sending reply:', error);
        showNotification('Error sending reply. Please try again.', 'error');
      } finally {
        // Re-enable button
        replyBtn.disabled = false;
        replyBtn.textContent = 'Send Reply';
      }
    });
    
    // Show the modal
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
  } catch (error) {
    console.error('Error opening query detail modal:', error);
    showNotification('Error loading query details. Please try again.', 'error');
    closeQueryDetailModal();
  }
  
  /**
   * Format a date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  /**
   * Get status badge HTML
   * @param {string} status - The status
   * @returns {string} HTML for the status badge
   */
  function getStatusBadgeHTML(status) {
    let colorClass = '';
    
    switch(status) {
      case 'Pending':
        colorClass = 'status-pending';
        break;
      case 'In Progress':
        colorClass = 'status-in-progress';
        break;
      case 'Resolved':
        colorClass = 'status-resolved';
        break;
      case 'Closed':
        colorClass = 'status-closed';
        break;
      default:
        colorClass = 'status-pending';
    }
    
    return `<span class="status-badge ${colorClass}">${status}</span>`;
  }
}

/**
 * Close the query detail modal
 */
function closeQueryDetailModal() {
  const modal = document.getElementById('queryDetailModal');
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
}

/**
 * Initialize the token modal
 */
function initTokenModal() {
  const modal = document.getElementById('tokenModal');
  const closeBtn = document.getElementById('closeTokenModalBtn');
  const viewQueryBtn = document.getElementById('viewQueryBtn');
  
  // Close modal when clicking the close button
  closeBtn.addEventListener('click', closeTokenModal);
  
  // View query button
  viewQueryBtn.addEventListener('click', function() {
    const token = document.getElementById('tokenDisplay').textContent;
    closeTokenModal();
    openQueryDetailModal(token);
  });
}

/**
 * Show the token modal with the given token
 * @param {string} token - The token to display
 */
function showTokenModal(token) {
  const modal = document.getElementById('tokenModal');
  const tokenDisplay = document.getElementById('tokenDisplay');
  
  tokenDisplay.textContent = token;
  
  modal.style.display = 'flex';
  document.body.classList.add('modal-open');
}

/**
 * Close the token modal
 */
function closeTokenModal() {
  const modal = document.getElementById('tokenModal');
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('info', 'error')
 */
function showNotification(message, type = 'info') {
  // Check if notification element already exists
  let notification = document.querySelector('.enquiry-notification');
  
  // If not, create it
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'enquiry-notification';
    document.body.appendChild(notification);
  }
  
  // Add error class if type is error
  if (type === 'error') {
    notification.classList.add('error');
  } else {
    notification.classList.remove('error');
  }
  
  // Set the message and show the notification
  notification.textContent = message;
  notification.classList.add('show');
  
  // Hide the notification after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
} 