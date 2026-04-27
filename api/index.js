const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
if (fs.existsSync(path.join(__dirname, '..', 'Backend', '.env'))) {
  dotenv.config({ path: path.join(__dirname, '..', 'Backend', '.env') });
}

const connectDB = require('../Backend/config/db');
const orderRoutes = require('../Backend/routes/orderRoutes');
const feedbackRoutes = require('../Backend/routes/feedbackRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// DB connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB Connection Failed:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Database Connection Error. Check MONGODB_URI on Vercel.',
      error: error.message
    });
  }
});

// Routes
// Mounting at multiple paths to ensure compatibility with Vercel rewrites
app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/feedback', feedbackRoutes);

// Health Checks
app.get('/api/ping', (req, res) => res.json({ status: 'API is alive', time: new Date() }));
app.get('/ping', (req, res) => res.json({ status: 'API is alive', time: new Date() }));

// Root routes
app.get('/api', (req, res) => res.send('Drawing App API is running... Use /api/orders'));
app.get('/', (req, res) => {
  console.log('Root path hit, redirecting or showing status');
  res.send('Drawing App API (Root) is running...');
});

module.exports = app;
