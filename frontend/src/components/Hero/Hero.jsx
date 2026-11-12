import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaYoutube, FaPaintBrush, FaArrowRight, FaStar, FaAward, FaHeart } from 'react-icons/fa';
import FlyingColorPaper from './FlyingColorPaper';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="hero-section">
      {/* 3D Flying & Fluttering Color Paper Background (Slow-motion) */}
      <FlyingColorPaper />

      <div className="hero-container">
        <div className="hero-content reveal reveal-left">
          {/* Artist Tag */}
          <div className="hero-badge-pill">
            <FaPaintBrush className="badge-brush-icon" />
            <span>Master Pencil & Portrait Artist</span>
          </div>

          <h1 className="main-title">
            HARSATH<span className="title-gradient">ARTS9</span>
          </h1>

          <p className="hero-tagline">Breathing Life &amp; Soul into Paper</p>

          <p className="hero-description-lead">
            Every stroke of the pencil carries emotion. Turn your treasured photos into handcrafted,
            hyper-realistic sketches and custom portraits that last a lifetime.
          </p>

          {/* Action CTAs */}
          <div className="hero-cta-group">
            <button onClick={() => navigate('/order')} className="hero-primary-btn">
              <span>Order Custom Sketch</span>
              <FaArrowRight className="btn-arrow" />
            </button>
            <a href="#gallery" className="hero-secondary-btn">
              <span>Explore Gallery</span>
            </a>
          </div>

          {/* Horizontal Meta Row: Trust Highlights + Social Connect */}
          <div className="hero-bottom-meta">
            <div className="hero-trust-bar">
              <div className="trust-pill">
                <FaStar className="star-icon" />
                <span>4.9/5 Rated</span>
              </div>
              <div className="trust-pill">
                <FaAward className="award-icon" />
                <span>500+ Portraits</span>
              </div>
              <div className="trust-pill">
                <FaHeart className="heart-icon" />
                <span>100% Hand-Drawn</span>
              </div>
            </div>

            <div className="hero-socials">
              <a
                href="https://instagram.com/harsatharts9"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon instagram"
                aria-label="Instagram"
                title="Instagram @harsatharts9"
              >
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/919047023266"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon whatsapp"
                aria-label="WhatsApp"
                title="WhatsApp Us"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://youtube.com/@harsatharts928"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon youtube"
                aria-label="YouTube"
                title="YouTube Channel"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Visual Illustration & Floating Badges */}
        <div className="hero-visual reveal reveal-right">
          <div className="illustration-wrapper">
            <img
              src="/hero_artist_illustration.png"
              alt="Harsath Arts Masterpiece"
              className="main-illustration"
            />
            {/* Floating Achievement Badges */}
            <div className="floating-stat-badge badge-top-right">
              <span className="badge-emoji">🎨</span>
              <div>
                <strong>Original Art</strong>
                <small>Pure Graphite &amp; Color</small>
              </div>
            </div>

            <div className="floating-stat-badge badge-bottom-left">
              <span className="badge-emoji">✨</span>
              <div>
                <strong>Custom Orders</strong>
                <small>Delivered Across India</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
