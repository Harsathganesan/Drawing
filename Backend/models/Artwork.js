const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Custom Artwork'
  },
  category: {
    type: String,
    default: 'Pencil Sketch'
  },
  image: {
    type: String,
    required: [true, 'Artwork image is required']
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'artworks'
});

module.exports = mongoose.models.Artwork || mongoose.model('Artwork', artworkSchema);

