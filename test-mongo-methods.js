const { MongoClient } = require('mongodb');

// Test 1: Standard SRV connection (what we've been trying)
const uriSRV = 'mongodb+srv://Pharma-platform:Pharma1234567@pharma-platform.gyoxzh0.mongodb.net/pharma-platform?retryWrites=true&w=majority&appName=Pharma-platform';

// Test 2: Direct connection (bypasses SRV)
// Get the direct host from the error message or MongoDB Atlas
const uriDirect = 'mongodb://Pharma-platform:Pharma1234567@pharma-platform-shard-00-00.gyoxzh0.mongodb.net:27017,pharma-platform-shard-00-01.gyoxzh0.mongodb.net:27017,pharma-platform-shard-00-02.gyoxzh0.mongodb.net:27017/pharma-platform?retryWrites=true&w=majority&appName=Pharma-platform';

async function testConnections() {
  console.log('Testing MongoDB connections...\n');
  
  // Test SRV
  console.log('1️⃣  Testing SRV Connection (mongodb+srv://)...');
  let srvSuccess = false;
  try {
    const client = new MongoClient(uriSRV, { 
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    await client.connect();
    console.log('✅ SRV Connection successful!');
    srvSuccess = true;
    await client.close();
  } catch (error) {
    console.log('❌ SRV Connection failed:', error.message);
  }
  
  console.log('\n2️⃣  Testing Direct Connection (mongodb://)...');
  console.log('Note: This requires direct host IP addresses from MongoDB Atlas');
  try {
    const client = new MongoClient(uriDirect, { 
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      retryWrites: true,
      tls: true
    });
    await client.connect();
    console.log('✅ Direct Connection successful!');
    await client.close();
  } catch (error) {
    console.log('❌ Direct Connection failed:', error.message);
  }
  
  if (!srvSuccess) {
    console.log('\n⚠️  SRV Connection Issue Detected!');
    console.log('\nPossible causes:');
    console.log('1. Network/ISP blocking DNS SRV queries');
    console.log('2. Firewall blocking port 53 (DNS)');
    console.log('3. VPN/Proxy interfering with DNS');
    console.log('4. MongoDB Atlas cluster issue');
    console.log('\nSolutions to try:');
    console.log('1. Check MongoDB Atlas > SECURITY > Network Access:');
    console.log('   - Verify IP 39.34.86.38 is listed and ACTIVE');
    console.log('   - Verify 0.0.0.0/0 is listed and ACTIVE');
    console.log('2. Try connecting from a different network (mobile hotspot)');
    console.log('3. Try direct connection string (see config below)');
    console.log('4. Contact MongoDB Atlas support if issue persists');
  }
}

testConnections();
