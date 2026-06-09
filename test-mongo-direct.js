const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Test direct connection (non-SRV)
const directUri = 'mongodb://Pharma-platform:Pharma1234567@ac-kcwpjw5-shard-00-00.gyoxzh0.mongodb.net:27017/pharma-platform?retryWrites=true&w=majority&authSource=admin';

console.log('Testing direct MongoDB connection (non-SRV)...');
console.log('URI:', directUri.substring(0, 60) + '...');

mongoose.connect(directUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ SUCCESS: MongoDB connected via direct connection!');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ ERROR:', err.message);
    console.log('Code:', err.code);
    process.exit(1);
  });

setTimeout(() => {
  console.log('⏱️ Timeout - connection took too long');
  process.exit(1);
}, 8000);
