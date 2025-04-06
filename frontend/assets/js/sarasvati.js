// Sarasvati AI Assistant
class Sarasvati {
  constructor() {
    this.isOpen = false;
    this.chatHistory = [];
    this.initializeUI();
    this.setupEventListeners();
  }

  initializeUI() {
    // Create and append Sarasvati's UI elements
    const sarasvatiHTML = `
      <div class="sarasvati-container" style="display: none;">
        <div class="sarasvati-header">
          <div class="sarasvati-title">
            <img src="./assets/images/sarasvati-avatar.png" alt="Sarasvati" class="sarasvati-avatar">
            <div>
              <h3>Sarasvati</h3>
              <span>AI Assistant</span>
            </div>
          </div>
          <button class="sarasvati-close">
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        <div class="sarasvati-chat">
          <div class="sarasvati-messages"></div>
          <div class="sarasvati-input">
            <textarea placeholder="Ask me anything about properties..." rows="1"></textarea>
            <button class="sarasvati-send">
              <ion-icon name="send-outline"></ion-icon>
            </button>
          </div>
        </div>
      </div>
      <button class="sarasvati-toggle">
        <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
        <span>Ask Sarasvati</span>
      </button>
    `;

    document.body.insertAdjacentHTML('beforeend', sarasvatiHTML);
  }

  setupEventListeners() {
    // Toggle chat window
    const toggleBtn = document.querySelector('.sarasvati-toggle');
    const container = document.querySelector('.sarasvati-container');
    const closeBtn = document.querySelector('.sarasvati-close');

    toggleBtn.addEventListener('click', () => {
      this.isOpen = !this.isOpen;
      container.style.display = this.isOpen ? 'block' : 'none';
      toggleBtn.style.display = this.isOpen ? 'none' : 'flex';
      if (this.isOpen) {
        this.addMessage('Hello! I\'m Sarasvati, your AI assistant. How can I help you today?', 'bot');
      }
    });

    closeBtn.addEventListener('click', () => {
      this.isOpen = false;
      container.style.display = 'none';
      toggleBtn.style.display = 'flex';
    });

    // Handle message sending
    const input = document.querySelector('.sarasvati-input textarea');
    const sendBtn = document.querySelector('.sarasvati-send');

    const sendMessage = () => {
      const message = input.value.trim();
      if (message) {
        this.addMessage(message, 'user');
        this.processMessage(message);
        input.value = '';
        this.autoResizeTextarea(input);
      }
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    input.addEventListener('input', () => this.autoResizeTextarea(input));
  }

  autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  addMessage(message, sender) {
    const messagesContainer = document.querySelector('.sarasvati-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `sarasvati-message ${sender}-message`;
    messageElement.innerHTML = `
      <div class="message-content">
        ${message}
        ${sender === 'bot' ? '<div class="message-typing-indicator"><span></span><span></span><span></span></div>' : ''}
      </div>
    `;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async processMessage(message) {
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Process the message and generate a response
    const response = this.generateResponse(message);
    this.addMessage(response, 'bot');
  }

  generateResponse(message) {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();

    // Property-related queries
    if (lowerMessage.includes('property') || lowerMessage.includes('house') || lowerMessage.includes('home')) {
      if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return 'Property prices vary based on location, size, and features. You can use our property search filters to find homes within your budget. Would you like me to help you set up some price filters?';
      }
      if (lowerMessage.includes('location') || lowerMessage.includes('area')) {
        return 'We have properties in various locations. You can use our map view to explore different areas. Would you like me to show you how to use the map feature?';
      }
      if (lowerMessage.includes('feature') || lowerMessage.includes('amenity')) {
        return 'Our properties come with various features like swimming pools, gardens, parking spaces, and more. You can filter properties by specific amenities in the search section.';
      }
    }

    // Saved homes queries
    if (lowerMessage.includes('save') || lowerMessage.includes('wishlist')) {
      return 'You can save properties to your wishlist by clicking the heart icon on any property card. View your saved properties in the "Saved Homes" section of your profile.';
    }

    // Contact queries
    if (lowerMessage.includes('contact') || lowerMessage.includes('agent')) {
      return 'You can contact property agents directly through our platform. Click the "Contact Agent" button on any property listing to get in touch.';
    }

    // Default response
    return 'I\'m here to help you with any questions about properties, pricing, locations, or general inquiries. Feel free to ask anything specific!';
  }
}

// Initialize Sarasvati when the page loads
document.addEventListener('DOMContentLoaded', () => {
  window.sarasvati = new Sarasvati();
}); 