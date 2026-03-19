import React from 'react';
import aboutImage from '../assets/images/aa.jpeg';
import { FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2 className="about-title">
          About Me
        </h2>
        <div className="about-content">
          <div className="about-image-wrapper">
            <div className="about-image-container">
              <img
                src={aboutImage}
                alt="Harsath Artist"
                className="about-image"
              />
              <div className="image-border"></div>
            </div>
          </div>
          <div className="about-text-wrapper">
            <p className="about-text">
              I am <strong>Harsath</strong>, a passionate pencil artist dedicated to creating beautiful and meaningful artworks. With years of experience in pencil sketching, I specialize in creating customized portraits that capture the essence of your loved ones.
            </p>
            <p className="about-text">
              Each artwork is carefully crafted with attention to detail, ensuring that every piece tells a unique story. My goal is to bring smiles to people's faces through my art.
            </p>

            <div className="about-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Artworks</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">8+</div>
                <div className="stat-label">Years Exp</div>
              </div>
            </div>

            <div className="social-links">
              <a
                href="https://instagram.com/harsatharts9"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link instagram"
                aria-label="Instagram"
              >
                <FaInstagram size={22} />
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link whatsapp"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={22} />
              </a>
              <a
                href="https://youtube.com/@harsatharts9"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link youtube"
                aria-label="YouTube"
              >
                <FaYoutube size={22} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;