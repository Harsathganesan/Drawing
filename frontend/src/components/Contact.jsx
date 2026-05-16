import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaInstagram, FaWhatsapp, FaYoutube, FaSpinner } from 'react-icons/fa';
import orderApi from '../services/orderApi';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await orderApi.submitFeedback(formData);
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus({ type: 'error', message: 'Failed to send message.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-layout">
          {/* Left Side: Contact Info */}
          <div className="contact-info-panel reveal reveal-up">
            <span className="section-tag">GET IN TOUCH</span>
            <h2 className="contact-title">Contact Me</h2>
            <div className="title-underline"></div>

            <div className="contact-methods">
              <div className="method-item">
                <div className="method-icon"><FaPhone /></div>
                <div className="method-text">+91 63822 45266</div>
              </div>
              <div className="method-item">
                <div className="method-icon"><FaEnvelope /></div>
                <div className="method-text">harsatharts2005@gmail.com</div>
              </div>
              <div className="method-item">
                <div className="method-icon"><FaMapMarkerAlt /></div>
                <div className="method-text">Pudukottai, Tamil Nadu, India</div>
              </div>
            </div>

            <div className="social-follow">
              <h4>Follow Me</h4>
              <div className="social-grid">
                <a href="https://instagram.com/harsatharts9" target="_blank" rel="noopener noreferrer" className="social-btn instagram"><FaInstagram /></a>
                <a href="https://wa.me/919047023266" target="_blank" rel="noopener noreferrer" className="social-btn whatsapp"><FaWhatsapp /></a>
                <a href="https://youtube.com/@harsatharts928" target="_blank" rel="noopener noreferrer" className="social-btn youtube"><FaYoutube /></a>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="contact-form-panel reveal reveal-up">
            <div className="dots-decoration"></div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              
              <button type="submit" className="send-btn" disabled={loading}>
                {loading ? <FaSpinner className="spinner" /> : <><FaPaperPlane /> Send Message</>}
              </button>

              {status.message && (
                <div className={`status-msg ${status.type}`}>
                  {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;