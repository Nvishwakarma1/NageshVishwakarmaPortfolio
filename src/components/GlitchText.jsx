import { useState, useEffect, useRef } from 'react';

const SYMBOLS = 'XYZ01_*!';

export default function GlitchText({ text, className = '' }) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);
  const iterationRef = useRef(0);
  const maxIterations = 10; // 10 iterations of 30ms = 300ms total duration

  const triggerScramble = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    iterationRef.current = 0;
    
    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            
            // Proportional lock: lock characters sequentially as iteration approaches max
            const threshold = (iterationRef.current / maxIterations) * text.length;
            if (index < threshold) {
              return char;
            }
            
            return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          })
          .join('');
      });

      iterationRef.current += 1;

      if (iterationRef.current > maxIterations) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, 30); // 30ms cycle speed
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    triggerScramble();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setDisplayText(text);
  };

  useEffect(() => {
    setDisplayText(text);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <span
      className={`inline-block select-none cursor-default font-heading ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </span>
  );
}
