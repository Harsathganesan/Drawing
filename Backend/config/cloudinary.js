const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');

// Explicitly load .env from the Backend directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Safety check for environment variables
const isCloudinaryConfigured = process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET;

if (!isCloudinaryConfigured) {
  console.warn('⚠️ Cloudinary environment variables are missing. Image upload will fail but server will not crash.');
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'placeholder',
  api_key: process.env.API_KEY || 'placeholder',
  api_secret: process.env.API_SECRET || 'placeholder',
});

const storage = isCloudinaryConfigured 
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'drawing-orders',
        allowed_formats: ['jpg', 'png', 'jpeg'],
      },
    })
  : multer.memoryStorage(); // Fallback to memory if not configured

module.exports = { cloudinary, storage, isCloudinaryConfigured };
