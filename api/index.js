const express = require('express');
const cors = require('cors');
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

// DB connection middleware
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
// We mount them at both /api/... and /... to be safe with Vercel rewrites
app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

app.use('/api/feedback', feedbackRoutes);
app.use('/feedback', feedbackRoutes);

// Health Checks
app.get('/api/ping', (req, res) => res.json({ status: 'API is alive', time: new Date() }));
app.get('/ping', (req, res) => res.json({ status: 'API is alive', time: new Date() }));

app.get('/api', (req, res) => res.send('Drawing App API is running...'));
app.get('/', (req, res) => res.send('Drawing App API is running...'));

module.exports = app;
