import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminSecretTrigger.css';

const AdminSecretTrigger = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPage = location.pathname === '/admin' || location.search.includes('admin');

  useEffect(() => {
    // Keyboard shortcut: Pressing '?' anywhere outside of input fields opens admin
    const handleKeyDown = (e) => {
      // Check if user is typing inside an input or textarea
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Also check if the URL query string has ?admin or ?
  useEffect(() => {
    if (location.search.toLowerCase().includes('admin') || location.search === '?') {
      navigate('/admin', { replace: true });
    }
  }, [location.search, navigate]);

  if (isAdminPage) return null;

  return (
    <button
      className="admin-secret-trigger"
      onClick={() => navigate('/admin')}
      title="Admin Portal (or press '?' on keyboard)"
      aria-label="Open Admin Page"
    >
      <span className="trigger-question-mark">?</span>
      <span className="trigger-tooltip">Admin</span>
    </button>
  );
};

export default AdminSecretTrigger;

