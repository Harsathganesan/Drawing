import React, { useState } from 'react';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaImage, FaPalette, FaRuler, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import orderApi from '../services/orderApi';
import './order.css';

const Order = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Price mapping for different sizes
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
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        referenceImage: file,
        imagePreview: previewUrl
      });
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    return priceMap[formData.size] || 999;
  };

  // Validate phone number (Indian format)
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate phone number
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid 10-digit Indian phone number');
      setLoading(false);
      return;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Upload image first if exists
      let imageUrl = '';
      if (formData.referenceImage) {
        try {
          const uploadResponse = await orderApi.uploadImage(formData.referenceImage);
          imageUrl = uploadResponse.data.url;
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Continue with order even if image upload fails
        }
      }

      const totalAmount = calculateTotal();

      // Prepare order data for MongoDB
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone.replace(/\D/g, ''), // Remove non-digits
        drawingType: formData.drawingType,
        size: formData.size,
        price: totalAmount,
        referenceImage: imageUrl || '',
        description: '',
        specialInstructions: '',
        paymentMethod: 'online'
      };

      // Send to backend
      const response = await orderApi.createOrder(orderData);

      console.log('Order placed successfully:', response);
      setSuccess(true);

      // Show success message
      alert(`✅ Order placed successfully!\n\nTotal Amount: ₹${totalAmount}\n\nWe will contact you soon via WhatsApp.`);

      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        drawingType: 'Pencil Sketch',
        size: 'A4',
        referenceImage: null,
        imagePreview: null
      });

      // Navigate to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      console.error('Order submission error:', err);

      let errorMsg = 'Failed to place order. Please try again.';

      if (err.code === 'NETWORK_ERROR') {
        errorMsg = '⚠️ Network error: Backend server-உடன் connect ஆகவில்லை. Backend running-ஆ என்று check செய்யுங்கள்.';
      } else if (err.code === 'TIMEOUT') {
        errorMsg = '⏱️ Request timeout. Please check your internet connection and try again.';
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Calculations for display
  const totalAmount = calculateTotal();

  return (
    <div className="order-page">
      <div className="order-container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate('/')} disabled={loading}>
          <FaArrowLeft /> Back
        </button>

        <h1 className="order-title">Place Your Order</h1>
        <p className="order-subtitle">Fill in the details below to order your custom portrait</p>

        {error && (
          <div className="error-message">
            <span>❌ {error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <span>✅ Order placed successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="order-content">
            {/* Left Column - Personal Info */}
            <div className="left-column">
              <div className="form-section">
                <h2 className="section-title">Personal Information</h2>

                <div className="form-group">
                  <label className="form-label">
                    <FaUser className="form-icon" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaEnvelope className="form-icon" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaPhone className="form-icon" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="9876543210"
                    required
                    disabled={loading}
                  />
                  <small className="field-hint">Enter 10-digit mobile number</small>
                </div>
              </div>
            </div>

            {/* Right Column - Order Details */}
            <div className="right-column">
              <div className="form-section">
                <h2 className="section-title">Order Details</h2>

                <div className="form-group">
                  <label className="form-label">
                    <FaPalette className="form-icon" />
                    Drawing Type *
                  </label>
                  <select
                    name="drawingType"
                    value={formData.drawingType}
                    onChange={handleChange}
                    className="form-select"
                    required
                    disabled={loading}
                  >
                    <option value="Pencil Sketch">Pencil Sketch</option>
                    <option value="Charcoal Sketch">Charcoal Sketch</option>
                    <option value="Watercolor Painting">Watercolor Painting</option>
                    <option value="Oil Painting">Oil Painting</option>
                    <option value="Digital Art">Digital Art</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaRuler className="form-icon" />
                    Size *
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="form-select"
                    required
                    disabled={loading}
                  >
                    <option value="A5">A5 - ₹799</option>
                    <option value="A4">A4 - ₹999</option>
                    <option value="A3">A3 - ₹1499</option>
                    <option value="A2">A2 - ₹2499</option>
                    <option value="A1">A1 - ₹4999</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaImage className="form-icon" />
                    Reference Photo
                  </label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                      disabled={loading}
                    />
                    <div className="file-upload-text">
                      Click to upload photo
                    </div>
                    <small className="file-hint">JPG, PNG (Max 5MB)</small>
                  </div>

                  {formData.imagePreview && (
                    <div className="image-preview">
                      <img src={formData.imagePreview} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => setFormData({ ...formData, referenceImage: null, imagePreview: null })}
                        disabled={loading}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section - Summary & Submit */}
            <div className="bottom-section">
              <div className="price-summary">
                <h3 className="summary-title">Order Summary</h3>
                <div className="summary-item total">
                  <span>Total Amount:</span>
                  <span className="total-price">₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                className="submit-order-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>

              <p className="terms-text">
                By placing this order, you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Order;