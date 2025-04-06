require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testSimpleConnection() {
  // Get the connection string from environment variables
  const uri = process.env.MONGO_URI;
  console.log('Attempting to connect with URI:', uri);
  
  // Create a new MongoClient
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    console.log('Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('Connected successfully to MongoDB Atlas!');
    
    // List databases
    console.log('\nAvailable databases:');
    const databasesList = await client.db().admin().listDatabases();
    databasesList.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
    // Use the homeverse database
    const database = client.db('homeverse');
    console.log(`\nUsing database: ${database.databaseName}`);
    
    // Create a test collection if it doesn't exist
    console.log('Creating a test collection...');
    await database.createCollection('test_collection');
    console.log('Test collection created or already exists');
    
    // Insert a test document
    console.log('Inserting a test document...');
    const result = await database.collection('test_collection').insertOne({
      test: true,
      message: 'This is a test document',
      createdAt: new Date()
    });
    console.log(`Document inserted with ID: ${result.insertedId}`);
    
    // Find the document we just inserted
    console.log('Finding the test document...');
    const document = await database.collection('test_collection').findOne({ test: true });
    console.log('Found document:', document);
    
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

// Run the test
testSimpleConnection().catch(console.error); 