// MouseTrail.js
import React, { useEffect, useRef } from 'react';
import './mousetrail.css';

const COOLDOWN_MS = 30;  
const MAX_ICONS   = 30;    

const MouseTrail = () => {
  const trailRef = useRef(null);

  useEffect(() => {
    const container = trailRef.current;
    let lastTime = 0;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < COOLDOWN_MS) return;
      lastTime = now;

      // Limit how many are alive
      if (container.childElementCount >= MAX_ICONS) return;

      const { left, top } = container.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const span = document.createElement('span');
      const size = 20 + Math.random() * 40; 

      span.style.width = `${size}px`;
      span.style.height = `${size}px`;
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      span.style.pointerEvents = 'none';
      span.className = 'floating-icon';

      container.appendChild(span);

      // Auto‑cleanup
      setTimeout(() => span.remove(), 2500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <div ref={trailRef} className="absolute inset-0 overflow-hidden z-0" />;
};

export default MouseTrail;
