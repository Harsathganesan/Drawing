const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // For development. Change to your Vercel URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB Connection Failed:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Database Connection Error. Please verify MONGODB_URI.'
    });
  }
});

// Serve static files
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health checks
app.get('/api/ping', (req, res) => res.json({ status: 'API is alive', time: new Date() }));
app.get('/', (req, res) => res.send('Drawing App Backend is running...'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
