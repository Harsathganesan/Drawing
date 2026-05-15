const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('Testing Cloudinary Config...');
console.log('CLOUD_NAME:', process.env.CLOUD_NAME);
console.log('API_KEY:', process.env.API_KEY);
console.log('API_SECRET length:', process.env.API_SECRET ? process.env.API_SECRET.length : 0);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary Ping Successful:', result);
  })
  .catch(error => {
    console.error('❌ Cloudinary Ping Failed:', error.message);
  });
