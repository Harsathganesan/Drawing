const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// @route   POST api/feedback
// @desc    Submit feedback/contact form
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const newFeedback = new Feedback({
      name,
      email,
      message
    });

    const savedFeedback = await newFeedback.save();

    res.status(201).json({
      success: true,
      data: savedFeedback,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Feedback Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   GET api/feedback
// @desc    Get all feedback (optional, for admin)
// @access  Private/Admin (for now keeping it simple)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Fetch Feedback Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;
