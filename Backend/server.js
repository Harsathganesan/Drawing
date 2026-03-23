const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware (Must be before any routes or DB connection so CORS headers are added)
app.use(cors({
  origin: true, // Allow all origins for easier deployment troubleshooting
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database lazily through a middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB Connection Failed:', error.message);
    res.status(500).json({ success: false, message: 'Database Connection Error. Please verify MONGODB_URI on Vercel.' });
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

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
module.exports = app;
