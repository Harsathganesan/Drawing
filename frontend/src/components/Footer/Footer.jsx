import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container-custom">
        <div className="text-center">
          <p className="mb-4">© 2026 harsatharts9. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="https://instagram.com/harsatharts9" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">Instagram</a>
            <a href="https://wa.me/919047023266" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">WhatsApp</a>
            <a href="https://youtube.com/@harsatharts928" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;