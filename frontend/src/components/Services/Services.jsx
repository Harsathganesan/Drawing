import React, { useState } from 'react';
import { FaUserEdit, FaUsers, FaHeart, FaTimes } from 'react-icons/fa';
import './Service.css';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      title: 'Custom Portraits',
      description: 'Handmade pencil portraits tailored just for you.',
      icon: <FaUserEdit />,
      color: '#f3e8ff', // light purple
      iconColor: '#a855f7',
      details: {
        price: 'Starting from ₹600',
        sizes: ['A4 (₹600)', 'A3 (₹900)', 'A2 (₹1400)', 'Custom Size'],
        note: '*Prices may vary according to the number of members in the portrait.'
      }
    },
    {
      id: 2,
      title: 'Family Portraits',
      description: 'Original family sketches to capture your beautiful memories and group bonds in a single frame.',
      icon: <FaUsers />,
      color: '#ffe4e6', // light pink
      iconColor: '#fb7185',
      details: {
        price: 'Starting from ₹1500',
        sizes: ['A3 (₹1500)', 'A2 (₹2000)'],
        note: '*Prices may vary according to the number of members in the portrait.'
      }
    },
    {
      id: 3,
      title: 'Wedding Portraits',
      description: 'Beautiful wedding art to celebrate your special day.',
      icon: <FaHeart />,
      color: '#e0f2fe', // light blue
      iconColor: '#38bdf8',
      details: {
        price: 'Starting from ₹1000',
        sizes: ['A3 (₹1000)', 'A2 (₹1800)']
      }
    }
  ];

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <div className="services-header reveal reveal-up">
          <span className="section-tag">WHAT I DO</span>
          <h2 className="services-title">My Services</h2>
          <div className="title-underline"></div>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className="service-card reveal reveal-up"
              onClick={() => setSelectedService(service)}
            >
              <div className="service-icon-wrapper" style={{ backgroundColor: service.color, color: service.iconColor }}>
                {service.icon}
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Details Modal */}
        {selectedService && (
          <div className="modal-overlay" onClick={() => setSelectedService(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setSelectedService(null)}
                className="modal-close"
              >
                <FaTimes />
              </button>

              <div className="modal-header">
                <div className="modal-icon-small" style={{ backgroundColor: selectedService.color, color: selectedService.iconColor }}>
                  {selectedService.icon}
                </div>
                <h3 className="modal-title">{selectedService.title}</h3>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h4 className="detail-label">Price Range</h4>
                  <p className="detail-price">{selectedService.details.price}</p>
                </div>

                <div className="detail-section">
                  <h4 className="detail-label">Available Sizes</h4>
                  <div className="size-chips">
                    {selectedService.details.sizes.map((size, index) => (
                      <span key={index} className="size-chip">{size}</span>
                    ))}
                  </div>
                </div>

                {selectedService.details.note && (
                  <div className="detail-section detail-note">
                    <p>{selectedService.details.note}</p>
                  </div>
                )}
              </div>

              <button className="book-now-btn" onClick={() => window.location.href = '#contact'}>
                Inquire Now
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;