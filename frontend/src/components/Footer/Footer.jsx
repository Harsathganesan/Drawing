import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaYoutube, FaPaintBrush, FaHeart, FaShieldAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-glow" />

      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <span className="footer-logo-name">harsatharts9</span>
          <p className="footer-tagline">Bringing Imagination to Life</p>
          <p className="footer-desc">
            Hand-crafted portraits &amp; artworks made with love — every stroke tells a story.
          </p>
        </div>

        {/* Social links */}
        <div className="footer-socials">
          <span className="footer-socials-label">Follow &amp; Connect</span>
          <div className="footer-social-grid">
            <a
              href="https://instagram.com/harsatharts9"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn instagram"
              aria-label="Instagram"
            >
              <FaInstagram />
              <span>Instagram</span>
            </a>
            <a
              href="https://wa.me/919047023266"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn whatsapp"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://youtube.com/@harsatharts928"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-btn youtube"
              aria-label="YouTube"
            >
              <FaYoutube />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <p className="footer-copy">
          © {year} <strong>harsatharts9</strong>. All rights reserved.
        </p>
        <p className="footer-made-with">
          Made with <FaHeart className="footer-heart" /> &amp; <FaPaintBrush className="footer-brush" />
        </p>
        <Link to="/admin" className="footer-admin-link" title="Owner Admin Access (Press ?)">
          <FaShieldAlt className="footer-admin-icon" /> Admin Portal (?)
        </Link>
      </div>
    </footer>
  );
};

export default Footer;