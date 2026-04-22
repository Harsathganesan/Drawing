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

  const uri = process.env.MONGODB_URI || "mongodb+srv://harsath137_db_user:Harsath%402005@cluster0.oxcog9w.mongodb.net/Drawing?appName=Cluster0";
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in Vercel/Environment');
    throw new Error('MONGODB_URI missing. Please add it to your Vercel Project Settings > Environment Variables.');
  }

  
  try {
    if (!cached.promise) {
      const opts = {
        bufferCommands: false, // For serverless
        maxPoolSize: 10,       // Keep pool small for serverless
      };

      cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
        return mongoose;
      });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    cached.promise = null; // Reset promise so it retries on next request
    throw error;
  }
};

module.exports = connectDB;