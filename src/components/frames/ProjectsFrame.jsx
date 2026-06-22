import { useState } from 'react';
import { ExternalLink, Cpu, Sparkles, Monitor, Code } from 'lucide-react';

const GithubIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const PROJECTS = [
  {
    id: 1,
    title: 'Unstuck Platform',
    description: 'A community troubleshooting system designed to help users resolve technical issues related to smartphones, laptops, and PCs. Users submit hardware or software faults and receive solutions from verified technicians.',
    tags: ['React', 'Node.js', 'JSON API', 'Responsive UI'],
    type: 'Dashboard Utility',
    themeBg: '#FF007A', // pink
    themeFg: '#111111',
    githubUrl: 'https://github.com/Nvishwakarma1',
    liveUrl: null,
    icon: 'cpu'
  },
  {
    id: 2,
    title: 'Interior Design Studio',
    description: 'Developed a high-performance modern portfolio for an interior design studio. Focused on rendering optimizations, layout flexibility, dynamic sorting, responsive showcases, and masonry image alignments.',
    tags: ['React', 'CSS Grid', 'Framer Motion', 'SEO Opt.'],
    type: 'Creative Portfolio',
    themeBg: '#FFE600', // canary yellow
    themeFg: '#111111',
    githubUrl: 'https://github.com/Nvishwakarma1/rishi-interior',
    liveUrl: 'https://Nvishwakarma1.github.io/rishi-interior/',
    icon: 'creative'
  },
  {
    id: 3,
    title: 'Tactile 3D Workspace',
    description: 'This active workspace portfolio! Features custom scroll timelines, pointer interactive backgrounds, vector coordinate tracer layers, and stark Neo-Brutalist structural components.',
    tags: ['React 19', 'Three.js', 'Vite', 'Accessibility'],
    type: 'Interactive Experiment',
    themeBg: '#0029FF', // electric blue
    themeFg: '#FFFFFF',
    githubUrl: 'https://github.com/Nvishwakarma1',
    liveUrl: '#',
    icon: 'monitor'
  }
];

export default function ProjectsFrame() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'cpu': return <Cpu className="w-8 h-8" />;
      case 'creative': return <Sparkles className="w-8 h-8" />;
      default: return <Monitor className="w-8 h-8" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Stark Grid layout of Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="flex flex-col bg-card-bg border-3 border-border-base shadow-brutal brutal-interactive select-none p-5 transition-all duration-300"
          >
            {/* Visual Header / Image Container */}
            <div 
              className="w-full h-40 border-2 border-border-base mb-4 flex flex-col justify-center items-center relative overflow-hidden"
              style={{
                backgroundColor: `${proj.themeBg}15`,
                backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            >
              {/* Graphic Icon */}
              <div 
                className="p-3 border-2 border-border-base bg-card-bg shadow-[3px_3px_0px_0px_var(--border-color)] text-text-base mb-2"
                style={{ color: proj.themeBg }}
              >
                {getIcon(proj.icon)}
              </div>
              <span className="font-mono text-[9px] font-bold text-text-base bg-card-bg px-2 py-0.5 border border-border-base uppercase tracking-wider">
                SCREEN_CAPTURE_00{proj.id}.PNG
              </span>
            </div>

            {/* Title & Type Badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span 
                className="font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 border-2 border-border-base shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"
                style={{ backgroundColor: proj.themeBg, color: proj.themeFg }}
              >
                {proj.type}
              </span>
              <span className="font-mono text-xs text-text-base opacity-60">ID: 0{proj.id}</span>
            </div>

            <h3 className="font-heading text-xl font-black uppercase text-text-base tracking-tight mb-2">
              {proj.title}
            </h3>

            {/* Description */}
            <p className="font-mono text-xs text-text-base leading-relaxed mb-4 flex-grow border-t border-dashed border-border-base pt-3">
              {proj.description}
            </p>

            {/* Tech Stack Outline */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {proj.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] font-bold border border-border-base bg-card-bg px-2 py-0.5 text-text-base shadow-[1px_1px_0px_0px_var(--border-color)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Card Action Links */}
            <div className="flex gap-3 border-t border-border-base pt-4 mt-auto">
              {proj.githubUrl && (
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-card-bg text-text-base text-center py-2 px-3 border-2 border-border-base font-heading font-extrabold text-xs uppercase shadow-[3px_3px_0px_0px_var(--border-color)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border-color)] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-1.5 transition-all"
                >
                  <GithubIcon size={14} /> Source
                </a>
              )}
              {proj.liveUrl ? (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center py-2 px-3 border-2 border-border-base font-heading font-extrabold text-xs uppercase shadow-[3px_3px_0px_0px_var(--border-color)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border-color)] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-1.5 transition-all"
                  style={{ backgroundColor: proj.themeBg, color: proj.themeFg }}
                >
                  Live <ExternalLink size={12} />
                </a>
              ) : (
                <span className="flex-1 text-center py-2 px-3 border-2 border-border-base font-heading font-extrabold text-xs uppercase text-text-base opacity-40 bg-card-bg cursor-not-allowed flex items-center justify-center gap-1.5">
                  Offline
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
