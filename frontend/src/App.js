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
import Lenis from 'lenis';
import './App.css';

// Separate component so useLocation works inside Router
function AppContent() {
  const location = useLocation();

  // Smooth scroll (Lenis) — runs once
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Scroll reveals — re-runs on every route change
  useEffect(() => {
    // Step 1: scroll to top
    window.scrollTo(0, 0);

    // Step 2: reset all reveal-active classes
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('reveal-active');
    });

    // Step 3: set up observer after DOM settles
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

      // Store observer to clean up
      window.__revealObserver = revealObserver;
    }, 150);

    return () => {
      clearTimeout(timer);
      if (window.__revealObserver) {
        window.__revealObserver.disconnect();
      }
    };
  }, [location.pathname]);

  return (
    <div className="App">
      <Navbar />
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
      </Routes>
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