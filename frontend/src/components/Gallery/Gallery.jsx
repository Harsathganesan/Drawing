import React, { useState, useEffect } from 'react';
import { FaEye, FaTimes, FaPalette, FaPaintBrush, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import galleryService from '../../services/galleryService';
import './Gallery.css';

const Gallery = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const fetchArtworks = async () => {
    const list = await galleryService.getArtworks();
    setArtworks(list);
  };

  useEffect(() => {
    fetchArtworks();

    // Listen to admin gallery updates across tabs/pages
    const handleUpdate = () => {
      fetchArtworks();
    };

    window.addEventListener('harsath_gallery_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('harsath_gallery_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Unique categories
  const categories = ['All', 'Pencil Sketch', 'Color Pencil', 'Charcoal', 'Portraits'];

  const filteredArtworks = artworks.filter((item) => {
    if (activeCategory === 'All') return true;
    return (item.category || '').toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-container">
        {/* Section Header */}
        <div className="gallery-header reveal reveal-up">
          <span className="section-tag">
            <FaPaintBrush className="tag-icon" /> MASTERPIECE COLLECTION
          </span>
          <h2 className="gallery-title">Art Gallery</h2>
          <div className="title-underline"></div>
          <p className="gallery-subtitle">
            Every artwork is 100% handcrafted with precision, passion, and soulful depth.
          </p>

          {/* Category Filter Pills */}
          <div className="gallery-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`gallery-filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredArtworks.map((artwork, idx) => (
            <div
              key={artwork.id || idx}
              className="gallery-item reveal reveal-scale"
              onClick={() => setSelectedArtwork(artwork)}
            >
              <div className="gallery-image-wrapper">
                <img
                  src={artwork.image}
                  alt={artwork.title || `Artwork ${idx + 1}`}
                  className="gallery-image"
                  loading="lazy"
                />
                <div className="gallery-card-overlay">
                  <div className="overlay-content">
                    <span className="overlay-category">{artwork.category || 'Pencil Sketch'}</span>
                    <h3 className="overlay-title">{artwork.title || 'Handmade Artwork'}</h3>
                    {artwork.price > 0 && <span className="overlay-price">Starts from ₹{artwork.price}</span>}
                    <span className="overlay-view-hint">
                      <FaEye /> Click to View Details
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="gallery-empty-state">
            <FaPalette className="empty-gallery-icon" />
            <p>No artworks found in this category.</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="gallery-bottom-cta reveal reveal-up">
          <div className="cta-content-box">
            <h3>Love this style? Order your custom portrait today</h3>
            <p>Turn your favorite photo into an everlasting piece of hand-drawn art.</p>
            <button onClick={() => navigate('/order')} className="gallery-order-btn">
              Order Custom Portrait <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox / Artwork Details Modal */}
      {selectedArtwork && (
        <div className="gallery-lightbox-overlay" onClick={() => setSelectedArtwork(null)}>
          <div className="gallery-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setSelectedArtwork(null)}>
              <FaTimes />
            </button>

            <div className="lightbox-image-side">
              <img src={selectedArtwork.image} alt={selectedArtwork.title} />
            </div>

            <div className="lightbox-info-side">
              <span className="modal-category-badge">{selectedArtwork.category || 'Handmade Art'}</span>
              <h2 className="modal-art-title">{selectedArtwork.title || 'Custom Drawing'}</h2>
              {selectedArtwork.description && (
                <p className="modal-art-desc">{selectedArtwork.description}</p>
              )}

              <div className="modal-details-list">
                <div className="modal-detail-row">
                  <span className="detail-name">Medium:</span>
                  <span className="detail-value">{selectedArtwork.category || 'Pencil Sketch'}</span>
                </div>
                <div className="modal-detail-row">
                  <span className="detail-name">Authenticity:</span>
                  <span className="detail-value">100% Hand-Drawn Original</span>
                </div>
                {selectedArtwork.price > 0 && (
                  <div className="modal-detail-row">
                    <span className="detail-name">Starting Price:</span>
                    <span className="detail-value price-highlight">₹{selectedArtwork.price}</span>
                  </div>
                )}
              </div>

              <div className="lightbox-action-row">
                <button
                  onClick={() => {
                    setSelectedArtwork(null);
                    navigate('/order');
                  }}
                  className="modal-order-now-btn"
                >
                  Order Artwork Like This <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
