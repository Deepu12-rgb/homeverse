const { MongoClient } = require('mongodb');

// Try different credentials
const credentials = [
  // Original credentials
  { username: 'Homeverse', password: 'm1gYtdYznqMOn2vZ' },
  
  // Lowercase username
  { username: 'homeverse', password: 'm1gYtdYznqMOn2vZ' },
  
  // Try admin username
  { username: 'admin', password: 'm1gYtdYznqMOn2vZ' },
  
  // Try admin with admin password
  { username: 'admin', password: 'admin' },
  
  // Try root username
  { username: 'root', password: 'm1gYtdYznqMOn2vZ' }
];

// Try to connect with each set of credentials
async function testCredentials() {
  for (let i = 0; i < credentials.length; i++) {
    const { username, password } = credentials[i];
    const uri = `mongodb+srv://${username}:${password}@realestate.09dx3.mongodb.net/?retryWrites=true&w=majority`;
    
    console.log(`\nTrying credentials #${i + 1}:`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password.substring(0, 3)}${'*'.repeat(password.length - 3)}`);
    
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      console.log('✅ Connected successfully!');
      
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
      console.error('❌ Connection error:', err.message);
    } finally {
      await client.close();
      console.log('Connection closed');
    }
  }
}

testCredentials().catch(console.error); 