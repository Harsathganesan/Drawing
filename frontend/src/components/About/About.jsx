import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaPalette,
  FaAward,
  FaHeart,
  FaShieldAlt,
  FaArrowRight,
  FaQuoteLeft,
  FaShippingFast
} from 'react-icons/fa';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Section Header */}
        <div className="about-header reveal reveal-up">
          <span className="section-tag">✨ ARTIST PROFILE</span>
          <h2 className="about-title">The Soul Behind the Strokes</h2>
          <div className="title-underline"></div>
          <p className="about-subtitle">
            Meet Harsath — Dedicated Pencil & Portrait Artist breathing timeless life into paper.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="about-content">
          {/* Left Column: Visual Profile & Stat Cards */}
          <div className="about-visual reveal reveal-left">
            <div className="profile-frame-wrapper">
              <div className="profile-frame">
                <img
                  src="/my1.jpeg"
                  alt="Harsath Artist"
                  className="profile-image"
                />
                <div className="profile-overlay-glow"></div>
              </div>

              {/* Floating Artist Badges */}
              <div className="artist-badge-experience">
                <span className="badge-num">8+</span>
                <div className="badge-meta">
                  <strong>Years Mastery</strong>
                  <small>Fine Art & Sketching</small>
                </div>
              </div>

              <div className="artist-badge-specialty">
                <FaPalette className="spec-icon" />
                <span>Hyper-Realism Specialist</span>
              </div>
            </div>

            {/* Quick Achievements Row */}
            <div className="about-stats-row">
              <div className="stat-box">
                <span className="stat-number">500+</span>
                <span className="stat-label">Handmade Sketches</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">100%</span>
                <span className="stat-label">Client Happiness</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">All India</span>
                <span className="stat-label">Safe Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Story, Highlights & Action */}
          <div className="about-details reveal reveal-right">
            <div className="greeting-wrapper">
              <h3 className="details-greeting">
                Hello, I'm <span className="highlight-name">Harsath</span>
              </h3>
              <p className="artist-bio-tagline">
                Turning your cherished memories into museum-grade hand-drawn artwork.
              </p>
            </div>

            <p className="details-description">
              Art has been my deepest passion and devotion for more than eight years. I specialize in
              hyper-realistic graphite, charcoal, and colored pencil portraits that capture far more than
              just facial features — they encapsulate the emotions, soul, and light of every individual.
            </p>

            <p className="details-description">
              Every portrait is rendered meticulously by hand on archival-grade drawing paper. From the
              subtlest glint in the eye to intricate hair strands, I pour hours of focused devotion into
              each piece so you receive an heirloom to treasure forever.
            </p>

            {/* Quote Card */}
            <div className="about-quote-card">
              <FaQuoteLeft className="quote-icon" />
              <p>
                "A photograph captures a single instant in time; a hand-drawn portrait captures the very
                soul of that memory."
              </p>
            </div>

            {/* Core Pillars Grid */}
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon icon-rose"><FaHeart /></div>
                <div className="feature-text">
                  <h4>Soulful Portraits</h4>
                  <p>True-to-life expressions and emotions captured stroke by stroke.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon icon-purple"><FaAward /></div>
                <div className="feature-text">
                  <h4>Archival Materials</h4>
                  <p>Crafted on 300GSM acid-free sheets that never fade or yellow.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon icon-teal"><FaShieldAlt /></div>
                <div className="feature-text">
                  <h4>Custom Framing</h4>
                  <p>Optional museum-style wooden & acrylic frames ready to hang.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon icon-amber"><FaShippingFast /></div>
                <div className="feature-text">
                  <h4>Safe Transit</h4>
                  <p>Multi-layer shockproof tube/box courier across Tamil Nadu & India.</p>
                </div>
              </div>
            </div>

            {/* Actions & Social Links */}
            <div className="about-actions-bar">
              <button onClick={() => navigate('/order')} className="about-commission-btn">
                <span>Commission Your Sketch</span>
                <FaArrowRight />
              </button>

              <div className="about-socials-group">
                <span className="socials-lead">Follow Me:</span>
                <a
                  href="https://instagram.com/harsatharts9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-social-link instagram"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://wa.me/919047023266"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-social-link whatsapp"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href="https://youtube.com/@harsatharts928"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-social-link youtube"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
