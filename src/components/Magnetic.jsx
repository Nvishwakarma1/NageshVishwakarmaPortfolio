import { useRef, useState, useEffect } from 'react';

export default function Magnetic({ children, strength = 0.25, range = 35 }) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      const distanceX = e.clientX - elementCenterX;
      const distanceY = e.clientY - elementCenterY;
      const distance = Math.hypot(distanceX, distanceY);

      // Check proximity. We want it triggered when cursor is within 30px of the button boundary.
      // Math.max(rect.width, rect.height) / 2 is the approximate radius of the element.
      const triggerThreshold = range + Math.max(rect.width, rect.height) / 2;

      if (distance < triggerThreshold) {
        // Accelerate/shift towards cursor position, capped exactly at 8px to 12px
        const rawPullX = distanceX * strength;
        const rawPullY = distanceY * strength;
        
        // Cap the coordinates between -10px and +10px
        const pullX = Math.max(-10, Math.min(10, rawPullX));
        const pullY = Math.max(-10, Math.min(10, rawPullY));
        
        setPosition({ x: pullX, y: pullY });
      } else {
        // Return back to center
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [strength, range]);

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 && position.y === 0 
          ? 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
          : 'transform 0.15s ease-out',
        display: 'inline-block'
      }}
    >
      {children}
    </div>
  );
}
