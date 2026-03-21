const mongoose = require('mongoose');

// Cache the connection globally to avoid creating multiple connections in Vercel
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside Vercel Dashboard');
  }
  
  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGODB_URI).then((mongoose) => {
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        return mongoose;
      });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // DO NOT process.exit(1) in Vercel, it crashes the API. Just throw it.
    throw error;
  }
};

module.exports = connectDB;