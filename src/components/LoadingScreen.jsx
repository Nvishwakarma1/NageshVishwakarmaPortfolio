import { useState, useEffect, useRef } from 'react';

const MESSAGES = [
  'INITIALIZING SYSTEM...',
  'LOADING ASSETS...',
  'COMPILING SHADERS...',
  'BUILDING 3D SCENE...',
  'CALIBRATING RENDERER...',
  'INJECTING PORTFOLIO DATA...',
  'RENDERING INTERFACE...',
  'FINALIZING...',
];

// Glitch text effect hook
function useGlitch(text, active) {
  const [display, setDisplay] = useState(text);
  const chars = '!@#$%^&*<>?/|\\{}[]~ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const frameRef = useRef(null);

  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let iter = 0;
    const total = text.length * 3;
    const tick = () => {
      setDisplay(
        text.split('').map((ch, i) =>
          i < iter / 3
            ? ch
            : ch === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
        ).join('')
      );
      iter++;
      if (iter < total) frameRef.current = setTimeout(tick, 30);
      else setDisplay(text);
    };
    frameRef.current = setTimeout(tick, 0);
    return () => clearTimeout(frameRef.current);
  }, [text, active]);

  return display;
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [glitchActive, setGlitchActive] = useState(true);
  const [scanline, setScanline] = useState(true);

  const glitchedTitle = useGlitch('NAGESH.DEV', glitchActive);

  // Simulate loading progress
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Non-linear: fast start, slows near 100
      const increment = current < 70
        ? Math.random() * 4 + 1.5
        : current < 90
        ? Math.random() * 1.5 + 0.5
        : Math.random() * 0.8 + 0.2;

      current = Math.min(100, current + increment);
      setProgress(Math.floor(current));

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 800);
        }, 400);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Cycle messages based on progress
  useEffect(() => {
    const idx = Math.min(
      Math.floor((progress / 100) * MESSAGES.length),
      MESSAGES.length - 1
    );
    if (idx !== msgIndex) {
      setMsgIndex(idx);
      setGlitchActive(false);
      setTimeout(() => setGlitchActive(true), 50);
    }
  }, [progress]);

  // Scanline flicker
  useEffect(() => {
    const t = setInterval(() => setScanline(s => !s), 120);
    return () => clearInterval(t);
  }, []);

  // Bar height: starts at 100%, shrinks to 0% as progress → 100
  const barHeight = `${100 - progress}%`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: done ? 0 : 1,
        transition: 'opacity 0.7s ease',
        pointerEvents: done ? 'none' : 'all',
      }}
    >
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.025) 2px, rgba(255,255,255,0.025) 4px)',
        opacity: scanline ? 1 : 0.6,
        transition: 'opacity 0.08s',
      }} />

      {/* Grid dot background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(0,255,102,0.07) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* ── THE SHRINKING BAR ── */}
      {/* Bar container: full screen height reference */}
      <div style={{
        position: 'absolute',
        left: '50%',
        bottom: 0,
        transform: 'translateX(-50%)',
        width: '3px',
        height: '100%',
        background: 'rgba(0,255,102,0.1)',
      }}>
        {/* The actual shrinking bar — anchored to bottom, shrinks upward */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: barHeight,
          background: 'linear-gradient(to top, #00ff66, #00f0ff 60%, #ffffff)',
          transition: 'height 0.08s linear',
          boxShadow: '0 0 18px #00ff66, 0 0 40px rgba(0,255,102,0.4)',
        }} />
      </div>

      {/* Wide glow halo around bar */}
      <div style={{
        position: 'absolute',
        left: '50%',
        bottom: 0,
        transform: 'translateX(-50%)',
        width: '120px',
        height: barHeight,
        background: 'linear-gradient(to top, rgba(0,255,102,0.08), transparent)',
        transition: 'height 0.08s linear',
        pointerEvents: 'none',
      }} />

      {/* ── CONTENT ── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        textAlign: 'center',
        padding: '0 24px',
        fontFamily: "'Courier New', monospace",
      }}>

        {/* Logo / brand glitch */}
        <div>
          <div style={{
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: 900,
            letterSpacing: '-2px',
            color: '#00ff66',
            textShadow: '0 0 20px rgba(0,255,102,0.8), 4px 0 0 rgba(0,240,255,0.4), -4px 0 0 rgba(255,0,127,0.3)',
            lineHeight: 1,
          }}>
            {glitchedTitle}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '6px',
            marginTop: '8px',
            textTransform: 'uppercase',
          }}>
            PORTFOLIO_v2.0 // BOOT_SEQUENCE
          </div>
        </div>

        {/* Percentage counter */}
        <div style={{
          fontSize: 'clamp(64px, 14vw, 120px)',
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1,
          letterSpacing: '-4px',
          fontVariantNumeric: 'tabular-nums',
          textShadow: progress > 90
            ? '0 0 30px rgba(0,255,102,0.9)'
            : '0 0 10px rgba(255,255,255,0.3)',
          transition: 'text-shadow 0.4s ease',
        }}>
          {String(progress).padStart(3, '0')}
          <span style={{ fontSize: '0.35em', color: 'rgba(255,255,255,0.3)', letterSpacing: 0 }}>%</span>
        </div>

        {/* Log message */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '11px',
          color: '#00ff66',
          letterSpacing: '2px',
          height: '20px',
          minWidth: '280px',
          justifyContent: 'center',
        }}>
          <span style={{
            display: 'inline-block',
            width: '6px', height: '6px',
            borderRadius: '50%',
            background: '#00ff66',
            boxShadow: '0 0 8px #00ff66',
            animation: 'blink 0.8s step-end infinite',
          }} />
          <span style={{ transition: 'opacity 0.2s' }}>{MESSAGES[msgIndex]}</span>
        </div>

        {/* ASCII log stream */}
        <div style={{
          fontSize: '9px',
          color: 'rgba(0,255,102,0.3)',
          letterSpacing: '1px',
          lineHeight: 1.7,
          textAlign: 'left',
          width: '100%',
          maxWidth: '360px',
        }}>
          {MESSAGES.slice(0, msgIndex + 1).map((msg, i) => (
            <div key={i} style={{
              color: i === msgIndex ? 'rgba(0,255,102,0.6)' : 'rgba(0,255,102,0.2)',
            }}>
              {`> [OK] ${msg}`}
            </div>
          ))}
        </div>

        {/* Progress bar track (thin horizontal at bottom) */}
        <div style={{
          width: '100%',
          maxWidth: '360px',
          height: '2px',
          background: 'rgba(255,255,255,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            left: 0, top: 0,
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(to right, #00ff66, #00f0ff)',
            transition: 'width 0.08s linear',
            boxShadow: '0 0 8px #00ff66',
          }} />
        </div>

        {/* Bottom status tags */}
        <div style={{
          display: 'flex',
          gap: '16px',
          fontSize: '9px',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
        }}>
          <span>SYS:READY</span>
          <span>|</span>
          <span>GPU:OK</span>
          <span>|</span>
          <span>3D:ACTIVE</span>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
