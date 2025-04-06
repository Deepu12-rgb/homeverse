require('dotenv').config();
const { MongoClient } = require('mongodb');

// Test different connection string formats
async function testConnectionFormats() {
  // Base credentials
  const username = 'testuser';
  const password = 'password123';
  const cluster = 'realestate.09dx3.mongodb.net';
  
  // Different connection string formats to try
  const connectionStrings = [
    // Format 1: Basic SRV format
    `mongodb+srv://${username}:${password}@${cluster}`,
    
    // Format 2: With database name
    `mongodb+srv://${username}:${password}@${cluster}/homeverse`,
    
    // Format 3: With options
    `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`,
    
    // Format 4: With database name and options
    `mongodb+srv://${username}:${password}@${cluster}/homeverse?retryWrites=true&w=majority`,
    
    // Format 5: With authSource
    `mongodb+srv://${username}:${password}@${cluster}/?authSource=admin`,
    
    // Format 6: Complete format
    `mongodb+srv://${username}:${password}@${cluster}/homeverse?retryWrites=true&w=majority&authSource=admin`
  ];
  
  // Try each connection string
  for (let i = 0; i < connectionStrings.length; i++) {
    const uri = connectionStrings[i];
    console.log(`\n[Test ${i+1}] Trying connection string format:`);
    console.log(uri);
    
    const client = new MongoClient(uri);
    
    try {
      // Connect to the MongoDB server
      await client.connect();
      console.log('✅ Connected successfully!');
      
      // Get database info
      const db = client.db('homeverse');
      console.log(`Database: ${db.databaseName}`);
      
      // This format works - update the .env file
      console.log('This connection string format works! Update your .env file with this format.');
      
    } catch (err) {
      console.error('❌ Connection error:', err.message);
    } finally {
      // Close the connection
      await client.close();
      console.log('Connection closed');
    }
  }
}

// Run the tests
testConnectionFormats().catch(console.error); 