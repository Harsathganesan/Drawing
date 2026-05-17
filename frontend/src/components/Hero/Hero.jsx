import React from 'react';
// Link import removed as it's unused
import { FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import './Hero.css';

// Floating paper pieces
const paperColors = [
  'rgba(255,255,255,0.85)',
  'rgba(255,253,240,0.8)',
  'rgba(240,240,230,0.75)',
  'rgba(255,250,220,0.8)',
  'rgba(230,230,220,0.7)',
];

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 95}%`,
  width:  `${Math.random() * 20 + 10}px`,
  height: `${Math.random() * 14 + 8}px`,
  delay: `${Math.random() * 12}s`,
  duration: `${Math.random() * 8 + 10}s`,
  opacity: Math.random() * 0.6 + 0.3,
  color: paperColors[Math.floor(Math.random() * paperColors.length)],
  startRotate: Math.random() * 360,
}));

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      {/* Floating paper pieces */}
      <div className="dust-container">
        {particles.map(p => (
          <span
            key={p.id}
            className="dust-particle paper-piece"
            style={{
              left: p.left,
              width: p.width,
              height: p.height,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: p.opacity,
              background: p.color,
              transform: `rotate(${p.startRotate}deg)`,
            }}
          />
        ))}
      </div>

      <div className="hero-container">
        <div className="hero-content reveal reveal-left">
          <span className="welcome-text">Welcome to</span>
          <h1 className="main-title">HARSATHARTS9</h1>
          <p className="hero-tagline">Bringing Imagination to Life</p>

          <div className="hero-description">
            <p>Every stroke has a story.</p>
            <p>Every artwork has a soul.</p>
            <p>Let's create something beautiful together.</p>
          </div>

          <div className="hero-socials">
            <a href="https://instagram.com/harsatharts9" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
              <FaInstagram />
            </a>
            <a href="https://wa.me/919047023266" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
              <FaWhatsapp />
            </a>
            <a href="https://youtube.com/@harsatharts928" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="hero-visual reveal reveal-right">
          <img
            src="/hero_artist_illustration.png"
            alt="Artist Illustration"
            className="main-illustration"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;