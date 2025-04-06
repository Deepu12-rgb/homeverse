require('dotenv').config();
const mongoose = require('mongoose');

// Function to test MongoDB connection
const testMongoDBConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    
    // Direct connection string
    const connectionString = 'mongodb+srv://Homeverse:m1gYtdYznqMOn2vZ@realestate.09dx3.mongodb.net/homeverse?retryWrites=true&w=majority';
    console.log(`Using direct connection string`);
    
    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Atlas Connected Successfully!`);
    console.log(`Connected to: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // List all collections in the database
    console.log('\nCollections in the database:');
    const collections = await conn.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('No collections found. Database is empty.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed successfully.');
    
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error.message}`);
    console.error(error);
    if (error.name === 'MongoServerSelectionError') {
      console.error('This may be due to network issues or incorrect connection string.');
    }
    process.exit(1);
  }
};

// Run the test
testMongoDBConnection(); 