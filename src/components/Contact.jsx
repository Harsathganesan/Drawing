import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaComment, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaSpinner, FaArrowRight } from 'react-icons/fa';
import orderApi from '../services/orderApi';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
      setStatus({ type: 'success', message: '✅ Message sent successfully! I will reply within 24 hours.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);

      let errorMsg = 'Failed to send message. Please try again.';

      if (err.code === 'NETWORK_ERROR') {
        errorMsg = '⚠️ Network error: Backend server-உடன் connect ஆகவில்லை. Please try again later.';
      } else if (err.code === 'TIMEOUT') {
        errorMsg = '⏱️ Request timeout. Please check your connection and try again.';
      } else if (err.message) {
        errorMsg = err.message;
      }

      setStatus({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h2 className="contact-title">Contact Us</h2>
        <div className="contact-wrapper">
          <div className="contact-info">
            <h3 className="info-title">Get in Touch</h3>
            <p className="info-text">
              Have a portrait idea? Let's bring it to life! 
              Fill out the form and I'll get back to you within 24 hours.
            </p>
            
            <div className="info-details">
              <div className="info-item">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4>Location</h4>
                  <p>Pudukottai, Tamil Nadu</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>harsatharts2005@gmail.com</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaWhatsapp />
                </div>
                <div>
                  <h4>WhatsApp</h4>
                  <p>+91 6382245266</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaInstagram />
                </div>
                <div>
                  <h4>Instagram</h4>
                  <p>@harsatharts9</p>
                </div>
              </div>
            </div>

          </div>

          <div className="contact-form-wrapper">
            {status.message && (
              <div className={`status-message ${status.type}`}>
                {status.type === 'success' ? '✅' : '❌'} {status.message}
              </div>
            )}
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <FaUser className="form-icon" />
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your Name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope className="form-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FaComment className="form-icon" />
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="form-textarea"
                  placeholder="Tell me about your portrait idea... Size, style, reference photos etc."
                  required
                  disabled={loading}
                ></textarea>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner" /> Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;