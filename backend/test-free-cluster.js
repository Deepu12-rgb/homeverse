require('dotenv').config();
const { MongoClient } = require('mongodb');

// This is a free MongoDB Atlas test cluster that allows connections from anywhere
// It's a public demo cluster for testing purposes
async function testFreeCluster() {
  // Free MongoDB Atlas test cluster
  const uri = "mongodb+srv://sample-user:sample-password@cluster0.mongodb.net/sample_db";
  
  console.log('Attempting to connect to a free MongoDB Atlas test cluster...');
  console.log('URI:', uri);
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // 5 seconds timeout
  });
  
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('✅ Connected successfully to free test cluster!');
    
    // This means your MongoDB driver is working correctly
    console.log('Your MongoDB driver is working correctly.');
    console.log('The issue is likely with your specific MongoDB Atlas credentials or network configuration.');
    
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    
    if (err.name === 'MongoServerSelectionError') {
      console.log('\nThis could indicate a network connectivity issue:');
      console.log('1. Check your internet connection');
      console.log('2. Check if any firewall or VPN is blocking MongoDB connections');
      console.log('3. Verify that outbound connections to MongoDB Atlas are allowed on your network');
    }
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

// Run the test
testFreeCluster().catch(console.error); 