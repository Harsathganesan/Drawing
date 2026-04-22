const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Load env vars
// Load env vars (Safe check for Vercel where .env is not present)
if (fs.existsSync(path.join(__dirname, '.env'))) {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

const app = express();

// Middleware (Must be before any routes or DB connection)
app.use(cors({
  origin: '*', // Allows all domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to database lazily through a middleware
app.use(async (req, res, next) => {
  // Skip DB connection for health checks if needed, but here we want to ensure it works
  if (req.path === '/api/ping') return next();
  
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB Connection Failed:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Database Connection Error. Please verify MONGODB_URI on Vercel Dashboard.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Serve static files from uploads folder (Handle /tmp for Vercel)
const uploadDir = process.env.VERCEL 
  ? path.join('/tmp', 'uploads') 
  : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check routes
app.get('/api/ping', (req, res) => res.json({ status: 'API is alive', time: new Date() }));
app.get('/', (req, res) => res.send('API is running... Use /api/orders or /api/feedback'));

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
module.exports = app;
