require('dotenv').config();
const { MongoClient } = require('mongodb');

// Test connection to a local MongoDB instance
async function testLocalMongo() {
  // Try to connect to a local MongoDB instance
  const uri = "mongodb://localhost:27017/homeverse";
  
  console.log('Attempting to connect to a local MongoDB instance...');
  console.log('URI:', uri);
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // 5 seconds timeout
  });
  
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('✅ Connected successfully to local MongoDB!');
    
    // Get database info
    const db = client.db('homeverse');
    console.log(`Database: ${db.databaseName}`);
    
    // Create a test collection
    const collection = db.collection('test_collection');
    console.log('Created test collection');
    
    // Insert a test document
    const result = await collection.insertOne({ test: 'data', createdAt: new Date() });
    console.log(`Inserted document with ID: ${result.insertedId}`);
    
    // Find the document
    const doc = await collection.findOne({ test: 'data' });
    console.log('Found document:', doc);
    
    console.log('\n✅ Local MongoDB is working correctly!');
    console.log('Consider using a local MongoDB for development instead of MongoDB Atlas.');
    console.log('You can update your .env file to use the local connection string:');
    console.log('MONGO_URI=mongodb://localhost:27017/homeverse');
    
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    
    console.log('\nLocal MongoDB connection failed. This could be because:');
    console.log('1. MongoDB is not installed locally');
    console.log('2. MongoDB service is not running');
    console.log('3. MongoDB is running on a different port');
    
    console.log('\nTo use a local MongoDB:');
    console.log('1. Install MongoDB Community Edition: https://www.mongodb.com/try/download/community');
    console.log('2. Start the MongoDB service');
    console.log('3. Update your .env file to use: MONGO_URI=mongodb://localhost:27017/homeverse');
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

// Run the test
testLocalMongo().catch(console.error); 