const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the frontend directory
app.use(express.static(__dirname));

// Add support for absolute paths starting with /
app.use('/', express.static(path.join(__dirname)));

// Serve index.html for all routes except for API requests and static files
app.get("*", (req, res) => {
  // Skip API routes and static file extensions
  if (!req.path.startsWith('/api') && 
      !req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|glb|mp4)$/)) {
    res.sendFile(path.join(__dirname, "index.html"));
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
  console.log(`You can access the site at: http://localhost:${PORT}`);
});

// Display the local IP address for easier access from other devices
const os = require("os");
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
