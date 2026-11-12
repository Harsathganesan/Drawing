import React, { useEffect, useRef } from 'react';
import './FlyingColorPaper.css';

// Vibrant artistic paper palette matching art & drawing theme
const PAPER_PALETTES = [
  { front: '#f43f5e', back: '#be123c' }, // Rose / Crimson
  { front: '#fb7185', back: '#e11d48' }, // Pastel Rose
  { front: '#fbbf24', back: '#d97706' }, // Golden Yellow
  { front: '#f59e0b', back: '#b45309' }, // Amber
  { front: '#fb923c', back: '#c2410c' }, // Vibrant Tangerine
  { front: '#a855f7', back: '#7e22ce' }, // Bright Violet
  { front: '#c084fc', back: '#9333ea' }, // Lavender
  { front: '#38bdf8', back: '#0284c7' }, // Sky Cyan
  { front: '#6366f1', back: '#4338ca' }, // Indigo
  { front: '#2dd4bf', back: '#0f766e' }, // Teal
  { front: '#34d399', back: '#059669' }, // Mint Green
  { front: '#ec4899', back: '#be185d' }, // Hot Pink
  { front: '#f472b6', back: '#db2777' }, // Soft Fuchsia
];

const SHAPES = ['strip', 'rect', 'square', 'rhombus'];

class PaperParticle {
  constructor(canvasWidth, canvasHeight, isInitial = false) {
    this.reset(canvasWidth, canvasHeight, isInitial);
  }

  reset(canvasWidth, canvasHeight, isInitial = false) {
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];

    // Dimensions based on shape
    if (this.shape === 'strip') {
      this.width = Math.random() * 5 + 7;   // 7-12px
      this.height = Math.random() * 12 + 20; // 20-32px
    } else if (this.shape === 'square') {
      const s = Math.random() * 6 + 11;     // 11-17px
      this.width = s;
      this.height = s;
    } else if (this.shape === 'rhombus') {
      this.width = Math.random() * 6 + 12;  // 12-18px
      this.height = Math.random() * 6 + 12;
    } else {
      // standard rect
      this.width = Math.random() * 6 + 11;  // 11-17px
      this.height = Math.random() * 8 + 14; // 14-22px
    }

    // Depth tier: 0 (background, small/slow), 1 (midground), 2 (foreground, large/crisp)
    const tierRand = Math.random();
    if (tierRand < 0.3) {
      this.scale = Math.random() * 0.2 + 0.55; // 0.55 - 0.75
      this.opacity = Math.random() * 0.2 + 0.55;
      this.baseVy = Math.random() * 0.12 + 0.22; // Slow, gentle float
    } else if (tierRand < 0.75) {
      this.scale = Math.random() * 0.25 + 0.8; // 0.8 - 1.05
      this.opacity = Math.random() * 0.2 + 0.75;
      this.baseVy = Math.random() * 0.16 + 0.34; // Calm, graceful drift
    } else {
      this.scale = Math.random() * 0.3 + 1.1; // 1.1 - 1.4
      this.opacity = Math.random() * 0.15 + 0.85;
      this.baseVy = Math.random() * 0.22 + 0.46; // Gentle foreground fall
    }

    // Position: scatter evenly on first load; otherwise spawn above or windward edge
    this.x = Math.random() * canvasWidth;
    this.y = isInitial ? Math.random() * canvasHeight : -this.height * 2 - Math.random() * 40;

    // Speeds & Sway (Slowed down for relaxed, peaceful fluttering)
    this.vx = (Math.random() - 0.45) * 0.25; // light natural wind drift
    this.swayAngle = Math.random() * Math.PI * 2;
    this.swaySpeed = Math.random() * 0.012 + 0.008; // slow rhythmic sway
    this.swayRadius = (Math.random() * 1.2 + 0.8) * this.scale;

    // 3D rotation angles & speeds (Slow realistic tumbling)
    this.angleX = Math.random() * Math.PI * 2;
    this.angleY = Math.random() * Math.PI * 2;
    this.angleZ = Math.random() * Math.PI * 2;

    this.speedRotX = (Math.random() - 0.5) * 0.022 + 0.012; // slow end-over-end flip
    this.speedRotY = (Math.random() - 0.5) * 0.018;        // slow spin
    this.speedRotZ = (Math.random() - 0.5) * 0.012;        // gentle roll

    // Color palette
    this.palette = PAPER_PALETTES[Math.floor(Math.random() * PAPER_PALETTES.length)];
  }

  update(canvasWidth, canvasHeight, windX, mouse) {
    this.swayAngle += this.swaySpeed;

    // 3D rotation update
    this.angleX += this.speedRotX;
    this.angleY += this.speedRotY;
    this.angleZ += this.speedRotZ;

    // Aerodynamic simulation:
    // When paper face is flat against air, drag slows it down; when on-edge, it slices faster
    const cosX = Math.cos(this.angleX);
    const cosY = Math.cos(this.angleY);
    const faceFacingAir = Math.abs(cosX * cosY);
    const aeroDrag = 0.75 + (1 - faceFacingAir) * 0.55;

    // Sway motion (gliding left and right like falling paper)
    const sway = Math.sin(this.swayAngle) * this.swayRadius;

    this.x += this.vx + sway + windX;
    this.y += this.baseVy * aeroDrag;

    // Interactive mouse wind: pushes paper away dynamically
    if (mouse && mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influenceRadius = 130;

      if (dist < influenceRadius && dist > 0) {
        const force = (1 - dist / influenceRadius) * 4.0;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force - 0.7; // slight upward draft
        this.speedRotX += (Math.random() - 0.5) * 0.05;
        this.speedRotY += (Math.random() - 0.5) * 0.05;
      }
    }

    // Wrap around bottom / edges
    if (this.y > canvasHeight + 40) {
      this.reset(canvasWidth, canvasHeight, false);
      this.y = -25;
    }
    if (this.x > canvasWidth + 50) {
      this.x = -30;
    } else if (this.x < -50) {
      this.x = canvasWidth + 30;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angleZ);

    // 3D projection scaling
    const cosX = Math.cos(this.angleX);
    const cosY = Math.cos(this.angleY);
    ctx.scale(cosY, cosX);

    // Front vs back face of paper
    const isBack = cosX * cosY < 0;
    const baseColor = isBack ? this.palette.back : this.palette.front;

    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = baseColor;

    const hw = (this.width * this.scale) / 2;
    const hh = (this.height * this.scale) / 2;

    ctx.beginPath();
    if (this.shape === 'rhombus') {
      ctx.moveTo(0, -hh);
      ctx.lineTo(hw, 0);
      ctx.lineTo(0, hh);
      ctx.lineTo(-hw, 0);
    } else {
      ctx.rect(-hw, -hh, hw * 2, hh * 2);
    }
    ctx.closePath();
    ctx.fill();

    // Subtle paper crease & reflection highlight
    ctx.fillStyle = isBack ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.28)';
    ctx.beginPath();
    ctx.moveTo(-hw, -hh);
    ctx.lineTo(hw, hh);
    ctx.lineTo(hw, -hh);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

const FlyingColorPaper = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Gentle oscillating wind
    let windTime = 0;

    const resize = () => {
      const container = containerRef.current || canvas.parentElement;
      const rect = container ? container.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Determine particle count based on screen size
      const count = width < 640 ? 28 : width < 1024 ? 42 : 55;

      if (particles.length === 0) {
        particles = Array.from({ length: count }, () => new PaperParticle(width, height, true));
      } else if (particles.length < count) {
        while (particles.length < count) {
          particles.push(new PaperParticle(width, height, true));
        }
      } else if (particles.length > count) {
        particles.length = count;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Track mouse / touch position relative to the container
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current = { x: null, y: null };
    };

    const parent = canvas.parentElement || window;
    parent.addEventListener('mousemove', handleMouseMove, { passive: true });
    parent.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    parent.addEventListener('touchmove', handleTouchMove, { passive: true });
    parent.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Pause when tab is hidden or section is out of view to save battery & CPU
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState !== 'hidden';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.05 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Animation loop
    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      if (!isVisibleRef.current) return;

      windTime += 0.006;
      const windX = Math.sin(windTime) * 0.16 + 0.10; // calm gentle breeze

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update(width, height, windX, mouse);
        p.draw(ctx);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
      parent.removeEventListener('touchmove', handleTouchMove);
      parent.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="flying-color-paper-container" aria-hidden="true">
      <canvas ref={canvasRef} className="flying-color-paper-canvas" />
    </div>
  );
};

export default FlyingColorPaper;

