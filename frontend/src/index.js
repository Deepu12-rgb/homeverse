/**
 * Homeverse Frontend Application
 * Main entry point
 */

// Import necessary modules
const express = require('express');
const path = require('path');
const os = require('os');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";  // Listen on all network interfaces

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve assets from the assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve HTML pages from the pages directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/index.html'));
});

// Route handler for all other pages
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const pagePath = path.join(__dirname, `pages/${page}.html`);
  
  // Check if the file exists
  try {
    if (require('fs').existsSync(pagePath)) {
      res.sendFile(pagePath);
    } else {
      // If page doesn't exist, redirect to 404 or home
      res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Frontend server running on http://${HOST}:${PORT}`);
  
  // Display the local IP address for easier access from other devices
  const networkInterfaces = os.networkInterfaces();
  let localIp = "localhost";
  
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaces = networkInterfaces[interfaceName];
    interfaces.forEach((iface) => {
      // Skip over internal and non-ipv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        localIp = iface.address;
        console.log(`You can also access the app at: http://${localIp}:${PORT}`);
      }
    });
  });
}); 