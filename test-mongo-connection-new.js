const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Pharma-platform:Pharma1234567@pharma-platform.gyoxzh0.mongodb.net/pharma-platform?retryWrites=true&w=majority&appName=Pharma-platform';

async function testConnection() {
  let client;
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', uri.replace(/password=.*@/, 'password=***@'));
    
    client = new MongoClient(uri, { 
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return false;
  } finally {
    if (client) await client.close();
  }
}

testConnection().then(success => {
  if (!success) {
    console.log('\n⚠️  MongoDB Atlas Whitelist Issue Detected!');
    console.log('Your IP: 39.34.86.38');
    console.log('\nNext steps:');
    console.log('1. Go to https://cloud.mongodb.com/');
    console.log('2. Select your project');
    console.log('3. Go to SECURITY → Network Access');
    console.log('4. Click "+ ADD IP ADDRESS"');
    console.log('5. Click "Add Current IP Address" or paste: 39.34.86.38');
    console.log('6. Click CONFIRM');
    console.log('7. Wait 30-60 seconds and try again');
  }
  process.exit(success ? 0 : 1);
});
