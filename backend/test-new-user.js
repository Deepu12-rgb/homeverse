require('dotenv').config();
const mongoose = require('mongoose');

// Function to test MongoDB connection with new user
const testNewUserConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas with new user...');
    console.log(`Connection string: ${process.env.MONGO_URI}`);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`\nMongoDB Atlas Connected Successfully!`);
    console.log(`Connected to: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // List all collections in the database
    console.log('\nCollections in the database:');
    const collections = await conn.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('No collections found. Database is empty.');
      console.log('This is normal for a new database. You can now start adding data to it.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed successfully.');
    console.log('MongoDB Atlas is working correctly with the new user!');
    
  } catch (error) {
    console.error(`\nError connecting to MongoDB Atlas: ${error.message}`);
    if (error.name === 'MongoServerSelectionError') {
      console.error('This may be due to network issues or incorrect connection string.');
      console.error('Make sure you have created the new user and whitelisted your IP address in MongoDB Atlas.');
    }
    process.exit(1);
  }
};

// Run the test
testNewUserConnection(); 