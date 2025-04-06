const { MongoClient } = require('mongodb');

async function testConnection() {
  // Connection URI
  const uri = 'mongodb+srv://Homeverse:m1gYtdYznqMOn2vZ@realestate.09dx3.mongodb.net/';
  
  // Create a new MongoClient
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    console.log('Attempting to connect to MongoDB Atlas...');
    await client.connect();
    console.log('Connected successfully to MongoDB Atlas!');

    // Get the database and list collections
    const db = client.db('homeverse');
    console.log(`Connected to database: ${db.databaseName}`);
    
    const collections = await db.listCollections().toArray();
    console.log('\nCollections in the database:');
    if (collections.length === 0) {
      console.log('No collections found. Database is empty.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }

  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

testConnection().catch(console.error); 