import React, { useEffect, useRef, useState } from 'react';

/**
 * InteractiveLuxuryLightGlow
 * Renders an ambient warm golden specular light glow across the entire website.
 * Follows mouse cursor on desktop and touch/scroll on mobile with smooth physics.
 */
export const InteractiveLuxuryLightGlow: React.FC = () => {
  const [coords, setCoords] = useState<{ x: number; y: number; opacity: number; size: number }>({
    x: -1000,
    y: -1000,
    opacity: 0,
    size: 550,
  });

  const targetCoords = useRef({ x: -1000, y: -1000 });
  const currentCoords = useRef({ x: -1000, y: -1000 });
  const animFrameId = useRef<number | null>(null);
  const isInteracting = useRef(false);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    // Center glow initially on screen
    if (typeof window !== 'undefined') {
      const initialX = window.innerWidth / 2;
      const initialY = window.innerHeight * 0.35;
      targetCoords.current = { x: initialX, y: initialY };
      currentCoords.current = { x: initialX, y: initialY };
      setCoords({ x: initialX, y: initialY, opacity: 0.85, size: 550 });
    }

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      targetCoords.current = { x: clientX, y: clientY };
      isInteracting.current = true;
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      handlePointerMove(e);
      setCoords((prev) => ({ ...prev, opacity: 1, size: 650 }));
    };

    const handlePointerUp = () => {
      setCoords((prev) => ({ ...prev, size: 550 }));
    };

    const handleScroll = () => {
      const now = Date.now();
      lastScrollTime.current = now;
      // Pulse glow subtly on scroll
      setCoords((prev) => ({ ...prev, opacity: Math.min(1, prev.opacity + 0.15) }));
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('mouseup', handlePointerUp, { passive: true });
    window.addEventListener('touchend', handlePointerUp, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Smooth physics loop for fluid gliding glow
    const updateLoop = () => {
      // Lerp smoothing factor
      const factor = 0.12;
      currentCoords.current.x += (targetCoords.current.x - currentCoords.current.x) * factor;
      currentCoords.current.y += (targetCoords.current.y - currentCoords.current.y) * factor;

      setCoords((prev) => ({
        ...prev,
        x: currentCoords.current.x,
        y: currentCoords.current.y,
      }));

      animFrameId.current = requestAnimationFrame(updateLoop);
    };

    animFrameId.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-500 overflow-hidden"
      style={{
        background: `
          radial-gradient(
            ${coords.size}px circle at ${coords.x}px ${coords.y}px,
            rgba(244, 224, 158, 0.22),
            rgba(212, 175, 55, 0.10) 30%,
            rgba(184, 134, 11, 0.04) 55%,
            transparent 75%
          )
        `,
        opacity: coords.opacity,
        mixBlendMode: 'screen',
      }}
    />
  );
};
