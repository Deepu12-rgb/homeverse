/**
 * Query Manager for Homeverse
 * Handles storing, retrieving, and displaying user queries with token numbers
 */

// Initialize query storage in localStorage if it doesn't exist
if (!localStorage.getItem('homeverse_queries')) {
  localStorage.setItem('homeverse_queries', JSON.stringify([]));
}

/**
 * Query Manager object
 */
const QueryManager = {
  /**
   * Generate a unique token number for a new query
   * @returns {string} A unique token number
   */
  generateToken: function() {
    // Current timestamp + random number for uniqueness
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    return `HV-${timestamp.toString().slice(-6)}${random.toString().padStart(4, '0')}`;
  },
  
  /**
   * Save a new query to localStorage
   * @param {Object} queryData - The query data to save
   * @returns {string} The token number assigned to the query
   */
  saveQuery: function(queryData) {
    // Get existing queries
    const queries = JSON.parse(localStorage.getItem('homeverse_queries') || '[]');
    
    // Generate token and add timestamp
    const token = this.generateToken();
    const timestamp = new Date().toISOString();
    
    // Create new query object
    const newQuery = {
      token,
      timestamp,
      status: 'Pending',
      ...queryData
    };
    
    // Add to queries array
    queries.push(newQuery);
    
    // Save back to localStorage
    localStorage.setItem('homeverse_queries', JSON.stringify(queries));
    
    // Return the token
    return token;
  },
  
  /**
   * Get all queries from localStorage
   * @returns {Array} Array of query objects
   */
  getAllQueries: function() {
    return JSON.parse(localStorage.getItem('homeverse_queries') || '[]');
  },
  
  /**
   * Get a specific query by token
   * @param {string} token - The token to search for
   * @returns {Object|null} The query object or null if not found
   */
  getQueryByToken: function(token) {
    const queries = this.getAllQueries();
    return queries.find(query => query.token === token) || null;
  },
  
  /**
   * Update the status of a query
   * @param {string} token - The token of the query to update
   * @param {string} status - The new status ('Pending', 'In Progress', 'Resolved', 'Closed')
   * @returns {boolean} True if successful, false if query not found
   */
  updateQueryStatus: function(token, status) {
    const queries = this.getAllQueries();
    const queryIndex = queries.findIndex(query => query.token === token);
    
    if (queryIndex === -1) return false;
    
    queries[queryIndex].status = status;
    localStorage.setItem('homeverse_queries', JSON.stringify(queries));
    return true;
  },
  
  /**
   * Add a response to a query
   * @param {string} token - The token of the query to update
   * @param {string} response - The response text
   * @returns {boolean} True if successful, false if query not found
   */
  addQueryResponse: function(token, response) {
    const queries = this.getAllQueries();
    const queryIndex = queries.findIndex(query => query.token === token);
    
    if (queryIndex === -1) return false;
    
    if (!queries[queryIndex].responses) {
      queries[queryIndex].responses = [];
    }
    
    queries[queryIndex].responses.push({
      timestamp: new Date().toISOString(),
      text: response,
      isAdmin: true
    });
    
    localStorage.setItem('homeverse_queries', JSON.stringify(queries));
    return true;
  },
  
  /**
   * Add a user reply to a query
   * @param {string} token - The token of the query to update
   * @param {string} reply - The user's reply text
   * @returns {boolean} True if successful, false if query not found
   */
  addUserReply: function(token, reply) {
    const queries = this.getAllQueries();
    const queryIndex = queries.findIndex(query => query.token === token);
    
    if (queryIndex === -1) return false;
    
    if (!queries[queryIndex].responses) {
      queries[queryIndex].responses = [];
    }
    
    queries[queryIndex].responses.push({
      timestamp: new Date().toISOString(),
      text: reply,
      isAdmin: false
    });
    
    localStorage.setItem('homeverse_queries', JSON.stringify(queries));
    return true;
  },
  
  /**
   * Delete a query
   * @param {string} token - The token of the query to delete
   * @returns {boolean} True if successful, false if query not found
   */
  deleteQuery: function(token) {
    const queries = this.getAllQueries();
    const queryIndex = queries.findIndex(query => query.token === token);
    
    if (queryIndex === -1) return false;
    
    queries.splice(queryIndex, 1);
    localStorage.setItem('homeverse_queries', JSON.stringify(queries));
    return true;
  },
  
  /**
   * Format a date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  formatDate: function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  /**
   * Get status badge HTML
   * @param {string} status - The status
   * @returns {string} HTML for the status badge
   */
  getStatusBadgeHTML: function(status) {
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
};

// Make QueryManager available globally
window.QueryManager = QueryManager; 