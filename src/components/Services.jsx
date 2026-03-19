import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import './Service.css';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      title: 'Custom Portraits',
      description: 'Personalized pencil portraits from photos',
      icon: '✏️',
      details: {
        price: 'Starting from ₹500',
        sizes: ['A4 (₹500)', 'A3 (₹700)', 'A2 (₹1200)', 'Custom Size']
      }
    },
    {
      id: 2,
      title: 'Family Portraits',
      description: 'Beautiful family portraits to cherish memories',
      icon: '👨‍👩‍👧‍👦',
      details: {
        price: 'Starting from ₹1500',
        sizes: ['A3 (₹1500)', 'A2 (₹2000)']
      }
    },
    {
      id: 3,
      title: 'Wedding Portraits',
      description: 'Special wedding day portraits',
      icon: '💑',
      details: {
        price: 'Starting from ₹1000',
        sizes: ['A3 (₹1000)', 'A2 (₹1800)']
      }
    }
  ];

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <h2 className="services-title">
          My Services
        </h2>

        {/* Services Grid - 3 cards */}
        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className="service-card"
              onClick={() => setSelectedService(service)}
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              
              <button className="view-details-btn">
                View Details <FaArrowRight className="arrow-icon" />
              </button>
            </div>
          ))}
        </div>

        {/* Details Modal */}
        {selectedService && (
          <div className="modal-overlay" onClick={() => setSelectedService(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="modal-close"
              >
                ✕
              </button>

              {/* Service Details */}
              <div className="modal-header">
                <div className="modal-icon">{selectedService.icon}</div>
                <h3 className="modal-title">{selectedService.title}</h3>
              </div>

              <div className="modal-body">
                {/* Price Section */}
                <div className="detail-section price-section">
                  <h4 className="detail-label">Price</h4>
                  <p className="detail-price">{selectedService.details.price}</p>
                </div>

                {/* Sizes Section */}
                <div className="detail-section">
                  <h4 className="detail-label">Available Sizes</h4>
                  <div className="size-chips">
                    {selectedService.details.sizes.map((size, index) => (
                      <span key={index} className="size-chip">{size}</span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;