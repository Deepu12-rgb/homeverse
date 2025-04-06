const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";  // Listen on all network interfaces

// Serve static files
app.use(express.static(__dirname));

// Serve index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Frontend server running on http://${HOST}:${PORT}`);
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
