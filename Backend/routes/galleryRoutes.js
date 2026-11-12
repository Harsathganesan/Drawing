const express = require('express');
const router = express.Router();
const Artwork = require('../models/Artwork');

// @route   GET /api/gallery
// @desc    Get all gallery artworks
router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: artworks
    });
  } catch (error) {
    console.error('Fetch Gallery Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery items',
      error: error.message
    });
  }
});

// @route   POST /api/gallery
// @desc    Add new artwork
router.post('/', async (req, res) => {
  try {
    const { title, category, image, description, price } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    const newArtwork = new Artwork({
      title: title || 'Custom Artwork',
      category: category || 'Pencil Sketch',
      image,
      description: description || '',
      price: Number(price) || 0
    });

    const savedArtwork = await newArtwork.save();

    res.status(201).json({
      success: true,
      data: savedArtwork,
      message: 'Artwork added successfully'
    });
  } catch (error) {
    console.error('Add Artwork Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add artwork',
      error: error.message
    });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete artwork by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Artwork.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Artwork deleted successfully'
    });
  } catch (error) {
    console.error('Delete Artwork Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete artwork',
      error: error.message
    });
  }
});

module.exports = router;

