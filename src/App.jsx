import { useState, useEffect } from 'react';
import { Sun, Moon, ArrowUp } from 'lucide-react';
import HeroFrame from './components/frames/HeroFrame';
import ProjectsFrame from './components/frames/ProjectsFrame';
import ExperienceFrame from './components/frames/ExperienceFrame';
import ContactFrame from './components/frames/ContactFrame';
import GlitchText from './components/GlitchText';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Default to light mode for the premium brutalist base background #F9F9FB
    return 'dark';
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [pastHero, setPastHero] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'capabilities', 'projects', 'contact'];
      const scrollPos = window.scrollY + 250;

      // Detect when user has scrolled past the hero section
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
        setPastHero(window.scrollY + 100 > heroBottom);
      }

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const tracker = document.getElementById('vector-tracker');
    if (!tracker) return;
    const handleMouseMove = (e) => {
      tracker.innerText = `COORD_TRACER // X: ${e.clientX.toString().padStart(4, '0')} | Y: ${e.clientY.toString().padStart(4, '0')}`;
      tracker.style.transform = `translate3d(${e.clientX + 15}px, ${e.clientY + 15}px, 0)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <>
      <LoadingScreen onComplete={() => setLoaded(true)} />
      <div
        className="min-h-screen flex flex-col font-sans relative pb-20 selection:bg-canary selection:text-black transition-colors duration-300"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
      
      {/* Background Vector Coordinate Tracer */}
      <div 
        id="vector-tracker" 
        className="fixed top-0 left-0 pointer-events-none select-none font-mono text-[9px] font-bold text-text-base opacity-25 z-50 tracking-widest uppercase bg-card-bg border border-border-base px-2 py-0.5 shadow-[2px_2px_0px_0px_var(--border-color)] transition-opacity duration-300"
        style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
      >
        COORD_TRACER // X: 0000 | Y: 0000
      </div>

      {/* ── TOP Horizontal Nav (visible only on hero section) ── */}
      <header
        className="sticky top-6 z-50 w-full max-w-4xl mx-auto px-4 mt-6 transition-all duration-500"
        style={{
          opacity: pastHero ? 0 : 1,
          pointerEvents: pastHero ? 'none' : 'auto',
          transform: pastHero ? 'translateY(-16px)' : 'translateY(0)',
        }}
      >
        <nav className="bg-card-bg nav-fade-border shadow-brutal flex justify-between items-center p-3 select-none">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <span className="font-heading text-lg font-extrabold uppercase tracking-tight text-text-base">
              Nagesh<span className="text-pink">.</span>Dev
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ul className="hidden md:flex gap-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className={`font-mono text-xs font-bold uppercase tracking-wider px-3 py-1.5 transition-all border-2 ${
                      activeSection === link.id
                        ? 'bg-mint text-black border-border-base shadow-[2px_2px_0px_0px_var(--border-color)]'
                        : 'border-transparent text-text-base hover:bg-canary hover:text-black hover:border-border-base hover:shadow-[2px_2px_0px_0px_var(--border-color)]'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="bg-card-bg border-2 border-border-base p-1.5 text-text-base cursor-pointer hover:bg-mint hover:text-black hover:shadow-[2px_2px_0px_0px_var(--border-color)] transition-all"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── LEFT Vertical Sidebar Nav (slides in past hero) ── */}
      <aside
        className="vertical-nav"
        style={{
          transform: pastHero ? 'translateX(0) translateY(-50%)' : 'translateX(-110%) translateY(-50%)',
          opacity: pastHero ? 1 : 0,
          pointerEvents: pastHero ? 'auto' : 'none',
        }}
        aria-label="Vertical navigation"
      >
        {/* Logo / Brand */}
        <button
          className="vertical-nav__brand"
          onClick={() => scrollToSection('hero')}
          title="Back to top"
        >
          <span className="vertical-nav__brand-letter">N</span>
          <span className="vertical-nav__brand-dot">.</span>
        </button>

        {/* Nav links */}
        <ul className="vertical-nav__links">
          {navLinks.map((link, i) => (
            <li key={link.id} style={{ transitionDelay: pastHero ? `${i * 50 + 100}ms` : '0ms' }}>
              <button
                onClick={() => scrollToSection(link.id)}
                className={`vertical-nav__link ${
                  activeSection === link.id ? 'vertical-nav__link--active' : ''
                }`}
                title={link.label}
              >
                <span className="vertical-nav__link-label">{link.label}</span>
                {activeSection === link.id && (
                  <span className="vertical-nav__link-dot" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="vertical-nav__theme-btn"
          aria-label="Toggle Theme"
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </aside>

      {/* Main Single Page Layout Container */}
      <main className="w-full max-w-5xl mx-auto px-4 mt-12 flex flex-col gap-24">
        
        {/* HERO SECTION */}
        <section id="hero" className="scroll-mt-32">
          <HeroFrame onNavigate={scrollToSection} theme={theme} />
        </section>

        {/* CAPABILITIES & TIMELINE SECTION */}
        <section id="capabilities" className="scroll-mt-32 border-3 border-border-base bg-card-bg p-8 shadow-brutal transition-all duration-300">
          <div className="mb-8 border-b-3 border-border-base pb-4">
            <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-pink block mb-1">
              [ Skills & Timeline ]
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-text-base uppercase">
              <GlitchText text="Capabilities & Experience" />
            </h2>
          </div>
          <ExperienceFrame />
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="scroll-mt-32 border-3 border-border-base bg-card-bg p-8 shadow-brutal transition-all duration-300">
          <div className="mb-8 border-b-3 border-border-base pb-4">
            <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-electric block mb-1">
              [ Selected Projects ]
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-text-base uppercase">
              <GlitchText text="Works Showcase" />
            </h2>
          </div>
          <ProjectsFrame />
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="scroll-mt-32 border-3 border-border-base bg-card-bg p-8 shadow-brutal transition-all duration-300">
          <div className="mb-8 border-b-3 border-border-base pb-4">
            <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-mint block mb-1">
              [ Secure Console ]
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-text-base uppercase">
              <GlitchText text="Get In Touch" />
            </h2>
          </div>
          <ContactFrame />
        </section>

      </main>

      {/* Tidy Bottom Status Bar */}
      <footer className="w-full max-w-4xl mx-auto px-4 mt-20">
        <div className="bg-card-bg border-3 border-border-base p-4 shadow-brutal flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono font-bold uppercase transition-all duration-300">
          <div className="flex items-center gap-2 text-text-base">
            <span>NAGESH.PORTFOLIO // v2.0.0</span>
            <span className="text-mint animate-pulse">● STATUS: ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 text-text-base">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-card-bg border-2 border-border-base px-3 py-1 cursor-pointer hover:bg-canary hover:text-black hover:shadow-[2px_2px_0px_0px_var(--border-color)] transition-all"
            >
              Back To Top <ArrowUp size={12} className="inline ml-1" />
            </button>
            <span>© {new Date().getFullYear()} Nagesh V.</span>
          </div>
        </div>
      </footer>

    </div>
    </>
  );
}
