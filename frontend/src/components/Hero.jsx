import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import heroImage from '../assets/images/logo.png';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            I am <span className="hero-highlight">Harsath</span>
          </h1>
          <h2 className="hero-subtitle">
            I am a Pencil Artist..!!
          </h2>
          <p className="hero-description">
            Welcome to harsatharts9, I am a Pencil Artist and I create customized portraits to surprise loved ones with my artworks.
          </p>
          
          {/* Social Media Icons */}
          <div className="hero-social">
            <a 
              href="https://instagram.com/harsatharts9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon instagram"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a 
              href="https://wa.me/919876543210" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon whatsapp"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <a 
              href="https://youtube.com/@harsatharts9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon youtube"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>

          <button 
            className="hero-button"
            onClick={() => navigate('/order')}
          >
            Order Now
          </button>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-image-container">
            <img 
              src={heroImage} 
              alt="Harsath - Pencil Artist"
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;