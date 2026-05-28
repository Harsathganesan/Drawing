import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaPlus } from 'react-icons/fa';
import './Navbar.css';
import logoImg from '../../assets/images/image.png';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('Home');
  const location = useLocation();
  const isOrderPage = location.pathname === '/order';

  useEffect(() => {
    if (isOrderPage) {
      setActiveLink('Order');
    }
  }, [isOrderPage]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (name) => {
    setActiveLink(name);
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '#home', icon: <FaHome className="home-icon" />, className: 'nav-home' },
    { name: 'About', path: '#about', className: 'nav-about' },
    { name: 'Services', path: '#services', className: 'nav-services' },
    { name: 'Gallery', path: '#gallery', className: 'nav-gallery' },
    { name: 'Contact Us', path: '#contact', className: 'nav-contact' }
  ];

  const themeColors = {
    'Home': '#ef4444',
    'About': '#3b82f6',
    'Services': '#10b981',
    'Gallery': '#8b5cf6',
    'Contact Us': '#0d9488',
    'Order': '#f43f5e'
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link
          to="/order"
          className="mobile-plus-btn"
          onClick={() => setIsOpen(false)}
          title="Place Your Order"
        >
          <div className="plus-icon-container">
            <FaPlus />
          </div>
        </Link>

        <Link to="/" className="logo-group" onClick={() => handleNavClick('Home')}>
          <img src={logoImg} alt="logo" className="logo-icon" />
          <div className="logo-text-wrapper">
            <h1 className="logo-name">harsatharts9</h1>
            <span className="logo-tagline">Bringing Imagination to Life</span>
          </div>
        </Link>

        <div className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${isOpen ? 'animate' : ''}`}></div>
          <div className={`bar ${isOpen ? 'animate' : ''}`}></div>
          <div className={`bar ${isOpen ? 'animate' : ''}`}></div>
        </div>

        <div className={`nav-links ${isOpen ? 'mobile-active' : ''}`}>
          {navItems.map((item) => (
            item.path.startsWith('#') ? (
              <a
                key={item.name}
                href={item.path}
                className={`nav-link ${item.className} ${activeLink === item.name ? 'active' : ''}`}
                style={{ color: activeLink === item.name ? themeColors[item.name] : '' }}
                onClick={() => handleNavClick(item.name)}
              >
                {item.icon && item.icon} {item.name}
                {activeLink === item.name && (
                  <div
                    className="active-indicator"
                    style={{ background: themeColors[item.name] }}
                  ></div>
                )}
              </a>
            ) : (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${item.className} ${activeLink === item.name ? 'active' : ''}`}
                style={{ color: activeLink === item.name ? themeColors[item.name] : '' }}
                onClick={() => handleNavClick(item.name)}
              >
                {item.icon && item.icon} {item.name}
                {activeLink === item.name && (
                  <div
                    className="active-indicator"
                    style={{ background: themeColors[item.name] }}
                  ></div>
                )}
              </Link>
            )
          ))}

          <Link
            to="/order"
            className="mobile-only mobile-order-btn"
            onClick={() => setIsOpen(false)}
          >
            Place Your Order
          </Link>
        </div>

        <Link
          to="/order"
          className="place-order-btn desktop-only"
          style={{ background: themeColors[activeLink] || '#f43f5e' }}
        >
          Place Your Order
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
