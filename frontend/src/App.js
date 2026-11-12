import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Services from './components/Services/Services';
import Gallery from './components/Gallery/Gallery';
import Contact from './components/Contact/Contact';
import Order from './components/Order/order';
import Footer from './components/Footer/Footer';
import Admin from './components/Admin/Admin';
import AdminSecretTrigger from './components/Admin/AdminSecretTrigger';
import Lenis from 'lenis';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  // Smooth scroll (Lenis) — runs once for main website
  useEffect(() => {
    if (isAdminPage) return; // Disable smooth scroll on admin for fast dashboard responsiveness

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [isAdminPage]);

  // Scroll reveals — re-runs on every route change
  useEffect(() => {
    window.scrollTo(0, 0);

    if (isAdminPage) return;

    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('reveal-active');
    });

    const timer = setTimeout(() => {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          } else {
            entry.target.classList.remove('reveal-active');
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

      document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
      window.__revealObserver = revealObserver;
    }, 150);

    return () => {
      clearTimeout(timer);
      if (window.__revealObserver) {
        window.__revealObserver.disconnect();
      }
    };
  }, [location.pathname, isAdminPage]);

  return (
    <div className="App">
      {!isAdminPage && <Navbar />}
      
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <About />
            <Services />
            <Gallery />
            <Contact />
            <Footer />
          </>
        } />
        <Route path="/order" element={<Order />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* Secret '?' trigger for Admin access */}
      <AdminSecretTrigger />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;
