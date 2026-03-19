const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: [true, 'Please provide your message'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'fb' // Set collection name to 'fb' as requested
});

module.exports = mongoose.model('Feedback', feedbackSchema);
