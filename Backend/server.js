const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
connectDB();

const app = express();

// Serve static files from uploads folder (Handle /tmp for Vercel)
const uploadDir = process.env.VERCEL 
  ? path.join('/tmp', 'uploads') 
  : path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// Middleware
app.use(cors({
  origin: true, // Allow all origins for easier deployment troubleshooting
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
