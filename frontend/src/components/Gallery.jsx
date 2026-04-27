import React from 'react';
import './Gallery.css';

// Import gallery images (10 images)
import artwork1 from '../assets/images/1.jpeg';
import artwork2 from '../assets/images/2.jpeg';
import artwork3 from '../assets/images/3.jpeg';
import artwork4 from '../assets/images/4.jpeg';
import artwork5 from '../assets/images/5.jpeg';
import artwork6 from '../assets/images/c1.jpeg';
import artwork7 from '../assets/images/c4.jpeg';
import artwork8 from '../assets/images/c3.jpeg';
import artwork9 from '../assets/images/c2.jpeg';
import artwork10 from '../assets/images/c5.jpeg';

const Gallery = () => {
  const artworks = [
    {
      id: 1,
      image: artwork1,

    },
    {
      id: 2,
      image: artwork2,

    },
    {
      id: 3,
      image: artwork3,

    },
    {
      id: 4,
      image: artwork4,

    },
    {
      id: 5,
      image: artwork5,

    },
    {
      id: 6,
      image: artwork6,

    },
    {
      id: 7,
      image: artwork7,

    },
    {
      id: 8,
      image: artwork8,

    },
    {
      id: 9,
      image: artwork9,

    },
    {
      id: 10,
      image: artwork10,

    }
  ];

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-container">
        <h2 className="gallery-title">Gallery</h2>
        <div className="gallery-grid">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="gallery-item">
              <div className="gallery-image-wrapper">
                <img
                  src={artwork.image}
                  alt={`Artwork ${artwork.id}`}
                  className="gallery-image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;