import React, { useState } from 'react';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaSpinner,
  FaClock,
  FaCheckCircle,
  FaUser,
  FaTag
} from 'react-icons/fa';
import orderApi from '../../services/orderApi';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Portrait Commission',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const inquiryChips = [
    'Portrait Commission',
    'Wedding Sketch',
    'Pricing & Size Query',
    'Urgent Delivery',
    'General Question'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleChipSelect = (chip) => {
    setFormData((prev) => ({ ...prev, subject: chip }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await orderApi.submitFeedback(formData);
      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent. Harsath will reply shortly.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Portrait Commission',
        message: ''
      });
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus({ type: 'error', message: 'Failed to send message. Please try WhatsApp directly.' });
    } finally {
      setLoading(false);
    }
  };

  const directWhatsappLink = `https://wa.me/919047023266?text=${encodeURIComponent(
    "Hello Harsath! I'm reaching out from your website regarding a custom sketch artwork."
  )}`;

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Section Header */}
        <div className="contact-header reveal reveal-up">
          <span className="section-tag">📬 GET IN TOUCH</span>
          <h2 className="contact-title">Let's Create Art Together</h2>
          <div className="title-underline"></div>
          <p className="contact-subtitle">
            Have a custom portrait idea or question? Reach out directly — I would love to bring your vision to life.
          </p>
        </div>

        <div className="contact-layout">
          {/* Left Column: Direct Contact Info Cards */}
          <div className="contact-info-panel reveal reveal-left">
            <div className="contact-cards-stack">
              {/* WhatsApp & Call */}
              <div className="contact-card card-whatsapp">
                <div className="card-icon-box icon-wa">
                  <FaWhatsapp />
                </div>
                <div className="card-text-box">
                  <span className="card-label">WhatsApp & Call</span>
                  <a href="tel:+919047023266" className="card-primary-value">+91 90470 23266</a>
                  <p className="card-hint">Fastest response for quick queries & quotes</p>
                  <a
                    href={directWhatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-action-link link-wa"
                  >
                    <FaWhatsapp /> Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Direct Phone */}
              <div className="contact-card card-phone">
                <div className="card-icon-box icon-phone">
                  <FaPhone />
                </div>
                <div className="card-text-box">
                  <span className="card-label">Direct Phone Line</span>
                  <a href="tel:+916382245266" className="card-primary-value">+91 63822 45266</a>
                  <p className="card-hint">Mon - Sat (9:00 AM - 9:00 PM IST)</p>
                </div>
              </div>

              {/* Email */}
              <div className="contact-card card-email">
                <div className="card-icon-box icon-mail">
                  <FaEnvelope />
                </div>
                <div className="card-text-box">
                  <span className="card-label">Email Address</span>
                  <a href="mailto:harsatharts2005@gmail.com" className="card-primary-value">
                    harsatharts2005@gmail.com
                  </a>
                  <p className="card-hint">Send reference photos or custom inquiries</p>
                </div>
              </div>

              {/* Studio Location */}
              <div className="contact-card card-location">
                <div className="card-icon-box icon-loc">
                  <FaMapMarkerAlt />
                </div>
                <div className="card-text-box">
                  <span className="card-label">Art Studio</span>
                  <strong className="card-primary-value loc-text">Pudukkottai, Tamil Nadu</strong>
                  <p className="card-hint">Safe courier delivery available all over India</p>
                </div>
              </div>
            </div>

            {/* Quick Guarantees Box */}
            <div className="contact-guarantees-box">
              <div className="guarantee-item">
                <FaClock className="guarantee-icon" />
                <span>Quick reply usually within 1 hour</span>
              </div>
              <div className="guarantee-item">
                <FaCheckCircle className="guarantee-icon" />
                <span>Free portrait sizing consultation</span>
              </div>
            </div>

            {/* Social Follow */}
            <div className="contact-social-bar">
              <span className="social-bar-label">Follow Artist:</span>
              <div className="social-pills-row">
                <a
                  href="https://instagram.com/harsatharts9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn instagram"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://wa.me/919047023266"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn whatsapp"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href="https://youtube.com/@harsatharts928"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn youtube"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="contact-form-panel reveal reveal-right">
            <div className="form-card-inner">
              <div className="form-card-header">
                <h3>Send a Message</h3>
                <p>Fill out the form below and I'll get back to you with custom sketches info.</p>
              </div>

              {/* Quick Topic Chips */}
              <div className="inquiry-chips-wrapper">
                <span className="chips-label"><FaTag /> Topic:</span>
                <div className="inquiry-chips-list">
                  {inquiryChips.map((chip) => (
                    <button
                      type="button"
                      key={chip}
                      className={`inquiry-chip ${formData.subject === chip ? 'active' : ''}`}
                      onClick={() => handleChipSelect(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row-2">
                  <div className="form-field-group">
                    <label><FaUser className="field-icon" /> Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label><FaEnvelope className="field-icon" /> Your Email *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field-group">
                    <label><FaPhone className="field-icon" /> Phone / WhatsApp (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field-group">
                    <label><FaTag className="field-icon" /> Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label>Your Message / Custom Details *</label>
                  <textarea
                    name="message"
                    placeholder="Tell me about the artwork you have in mind (number of faces, size, special requests, date needed)..."
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <FaSpinner className="spinner" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Send Message to Harsath</span>
                    </>
                  )}
                </button>

                {status.message && (
                  <div className={`status-banner-alert ${status.type}`}>
                    {status.type === 'success' && <FaCheckCircle />}
                    <span>{status.message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
