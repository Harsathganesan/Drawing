const express = require('express');
const cors = require('cors');
const path = require('path');
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

// Health Check
app.get('/api/ping', (req, res) => res.json({ status: 'API is alive', time: new Date() }));

// Connect to DB and then handle routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB Connection Failed:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Database Connection Error'
    });
  }
});

// Routes
// Note: Vercel routes /api/index.js to /api
// If the request is /api/orders, and we use app.use('/api/orders', ...)
// Express will match it correctly because Vercel passes the full path.
app.use('/api/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);

// Root path for API
app.get('/api', (req, res) => res.send('Drawing App API is running...'));

// Export for Vercel
module.exports = app;
