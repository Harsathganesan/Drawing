import React from 'react';
import { FaInstagram, FaWhatsapp, FaYoutube, FaPalette, FaUserEdit, FaAward } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-header reveal reveal-up">
          <span className="section-tag">Meet the Artist</span>
          <h2 className="about-title">About Harsath Arts</h2>
          <div className="title-underline"></div>
        </div>

        <div className="about-content">
          <div className="about-visual reveal reveal-left">
            <div className="profile-frame">
              <img
                src="/my1.jpeg"
                alt="Harsath Artist"
                className="profile-image"
              />
              <div className="frame-decoration"></div>
            </div>
            <div className="experience-badge">
              <span className="exp-num">8+</span>
              <span className="exp-text">Years of Mastery</span>
            </div>
          </div>

          <div className="about-details reveal reveal-right">
            <h3 className="details-greeting">Hello, I'm <span className="highlight-name">Harsath</span></h3>
            <p className="details-description">
              A passionate pencil artist dedicated to breathing life into paper. With over 8 years of professional experience, I specialize in hyper-realistic pencil sketches and customized portraits that capture not just faces, but souls.
            </p>
            <p className="details-description">
              Every stroke of my pencil tells a unique story. My goal is to transform your precious memories into timeless masterpieces that you can cherish forever.
            </p>

            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon"><FaUserEdit /></div>
                <div className="feature-text">
                  <h4>Custom Portraits</h4>
                  <p>Hand-drawn with precision</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><FaPalette /></div>
                <div className="feature-text">
                  <h4>Artistic Vision</h4>
                  <p>Capturing every detail</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><FaAward /></div>
                <div className="feature-text">
                  <h4>Quality Guarantee</h4>
                  <p>Premium materials used</p>
                </div>
              </div>
            </div>

            <div className="about-actions">
              <div className="about-socials">
                <a href="https://instagram.com/harsatharts9" target="_blank" rel="noopener noreferrer" className="about-social-link instagram">
                  <FaInstagram />
                </a>
                <a href="https://wa.me/919047023266" target="_blank" rel="noopener noreferrer" className="about-social-link whatsapp">
                  <FaWhatsapp />
                </a>
                <a href="https://youtube.com/@harsatharts928" target="_blank" rel="noopener noreferrer" className="about-social-link youtube">
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