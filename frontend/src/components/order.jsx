import React, { useState } from 'react';
import { FaShoppingCart, FaSpinner, FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaPalette, FaRuler, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import orderApi from '../services/orderApi';
import './order.css';

const Order = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const priceMap = {
    'A5': 799,
    'A4': 999,
    'A3': 1499,
    'A2': 2499,
    'A1': 4999,
    'Custom': 1999
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    drawingType: 'Pencil Sketch',
    size: 'A4',
    referenceImage: null,
    imagePreview: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        referenceImage: file,
        imagePreview: previewUrl
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrl = '';
      if (formData.referenceImage) {
        try {
          const uploadResponse = await orderApi.uploadImage(formData.referenceImage);
          imageUrl = uploadResponse.data.url;
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
        }
      }

      const totalAmount = priceMap[formData.size] || 999;
      const orderData = {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        drawingType: formData.drawingType,
        size: formData.size,
        quantity: 1,
        totalAmount: totalAmount,
        referenceImage: imageUrl || '',
        paymentMethod: 'online'
      };

      await orderApi.createOrder(orderData);
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="artistry-order-wrapper">
      <div className="artistry-order-container">

        <div className="artistry-order-content">
          {/* Left Column: Info & Navigation */}
          <div className="artistry-left-panel reveal reveal-up">
            <span className="artistry-tag">LET'S CREATE TOGETHER</span>
            <h1 className="artistry-title">Place Your Order</h1>
            <div className="artistry-underline"></div>

            <div className="artistry-description">
              <p>Have a custom idea in mind?</p>
              <p>Let's bring your vision to life.</p>
              <p>Fill the form and tell me about your requirements.</p>
            </div>

            <button className="artistry-order-btn desktop-only" onClick={() => document.getElementById('main-order-form').scrollIntoView({ behavior: 'smooth' })}>
              Order Now <FaShoppingCart className="cart-icon" />
            </button>

            <button className="artistry-back-btn desktop-only" onClick={() => navigate('/')}>
              <FaArrowLeft className="back-icon" /> Back to Home
            </button>
          </div>

          {/* Right Column: High-End Form */}
          <div className="artistry-form-panel reveal reveal-up">
            <form id="main-order-form" onSubmit={handleSubmit}>
              <div className="form-sections-grid">

                {/* Personal Info Section */}
                <div className="form-column">
                  <div className="form-field-group">
                    <label className="field-label">
                      <FaUser className="label-icon" /> Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">
                      <FaEnvelope className="label-icon" /> Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">
                      <FaPhone className="label-icon" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    <span className="field-hint">Enter your mobile number</span>
                  </div>
                </div>

                {/* Order Detail Section */}
                <div className="form-column">
                  <div className="form-field-group">
                    <label className="field-label">
                      <FaPalette className="label-icon" /> Drawing Type *
                    </label>
                    <select name="drawingType" value={formData.drawingType} onChange={handleChange} required>
                      <option value="Pencil Sketch">Pencil Sketch</option>
                      <option value="Charcoal Sketch">Charcoal Sketch</option>
                      <option value="Watercolor Painting">Watercolor Painting</option>
                      <option value="Oil Painting">Oil Painting</option>
                      <option value="Digital Art">Digital Art</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">
                      <FaRuler className="label-icon" /> Size *
                    </label>
                    <select name="size" value={formData.size} onChange={handleChange} required>
                      <option value="A5">A5 - ₹799</option>
                      <option value="A4">A4 - ₹999</option>
                      <option value="A3">A3 - ₹1499</option>
                      <option value="A2">A2 - ₹2499</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">
                      <FaImage className="label-icon" /> Reference Photo
                    </label>
                    <div className="upload-box-wrapper">
                      <label htmlFor="ref-upload" className="upload-box">
                        <FaImage className="upload-main-icon" />
                        <span className="upload-text">Upload Reference Photo</span>
                        <span className="upload-hint">JPG, PNG (Max 5MB)</span>
                        <input type="file" id="ref-upload" onChange={handleImageChange} />
                      </label>
                      {formData.referenceImage && (
                        <div className="file-selected-indicator">
                          ✅ {formData.referenceImage.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="artistry-form-actions">
                <button type="button" className="artistry-cancel-btn mobile-only" onClick={() => navigate('/')}>
                  Cancel
                </button>
                <button type="submit" className="artistry-submit-btn" disabled={loading}>
                  {loading ? <FaSpinner className="spinner" /> : 'Confirm Order'}
                </button>
              </div>

              {error && <p className="artistry-msg error">{error}</p>}
              {success && <p className="artistry-msg success">Success! Your order is being processed.</p>}
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Order;