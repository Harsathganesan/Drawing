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
const allowedOrigins = [
  'http://localhost:3000',
  /\.vercel\.app$/ // Allows all Vercel subdomains
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      return callback(null, true);
    }
    return callback(new Error('CORS Policy Error'), false);
  },
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
app.use('/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/feedback', feedbackRoutes);

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
  
  // Keep-alive mechanism to prevent Render from sleeping
  const RENDER_URL = process.env.RENDER_URL || 'https://drawing-8587.onrender.com/api/ping';
  setInterval(() => {
    const https = require('https');
    https.get(RENDER_URL, (res) => {
      console.log(`Keep-alive ping sent to ${RENDER_URL}. Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`Keep-alive ping failed: ${err.message}`);
    });
  }, 5 * 60 * 1000); // 5 minutes
});

module.exports = app;
