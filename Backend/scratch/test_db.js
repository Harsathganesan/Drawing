const connectDB = require('../config/db');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('Testing DB Connection...');
connectDB()
  .then(() => {
    console.log('✅ DB Connection Successful');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ DB Connection Failed:', error.message);
    process.exit(1);
  });
