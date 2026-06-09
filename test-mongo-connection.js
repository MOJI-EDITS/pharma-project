const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
const mongoUri = mongoMatch ? mongoMatch[1].trim() : null;

console.log('Testing MongoDB connection...');
console.log('URI:', mongoUri ? mongoUri.substring(0, 60) + '...' : 'NOT SET');

mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ SUCCESS: MongoDB connected!');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ ERROR:', err.message);
    console.log('Code:', err.code);
    console.log('\n🔍 DIAGNOSIS:');
    if (err.message.includes('ECONNREFUSED') || err.message.includes('getaddrinfo')) {
      console.log('   → Check IP whitelist in MongoDB Atlas');
      console.log('   → Verify cluster is running');
      console.log('   → Check firewall/network settings');
    }
    process.exit(1);
  });

setTimeout(() => {
  console.log('⏱️ Timeout - connection attempt took too long');
  process.exit(1);
}, 8000);
