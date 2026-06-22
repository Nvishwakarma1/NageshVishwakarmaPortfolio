import { useEffect, useState, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?';

export default function DecryptedText({
  text = '',
  speed = 50,
  maxIterations = 10,
  animateOn = 'hover', // 'hover' | 'view'
  className = '',
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);
  const iterationRef = useRef(0);

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    iterationRef.current = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const length = text.length;
      let scrambled = '';
      
      const revealedCount = Math.floor((iterationRef.current / maxIterations) * length);

      for (let i = 0; i < length; i++) {
        if (i < revealedCount || text[i] === ' ') {
          scrambled += text[i];
        } else {
          const randChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          scrambled += randChar;
        }
      }

      setDisplayText(scrambled);
      iterationRef.current += 1;

      if (iterationRef.current > maxIterations) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsAnimating(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'view') {
      startAnimation();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      startAnimation();
    }
  };

  return (
    <span
      className={`decrypted-text ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ display: 'inline-block' }}
      {...props}
    >
      {displayText}
    </span>
  );
}
