import { useRef } from 'react';
import { ExternalLink, Monitor, Cpu, Sparkles } from 'lucide-react';
import Magnet from './Magnet';

const GithubIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ProjectCard({ project }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position inside element
    const y = e.clientY - rect.top;  // y position inside element
    
    // Calculate rotation angles based on mouse position relative to card center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 12; // max 12 deg
    const rotateY = ((x - centerX) / centerX) * 12; // max 12 deg

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const getIcon = (type) => {
    switch (type) {
      case '3d': return <Cpu size={16} />;
      case 'creative': return <Sparkles size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  return (
    <div
      ref={cardRef}
      className="project-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--border-color': project.themeColor,
        '--glow-color': `${project.themeColor}33`,
      }}
    >
      {/* Background radial glow following cursor */}
      <div className="card-glow" />

      <div className="project-header">
        <div className="project-type-icon" style={{ backgroundColor: `${project.themeColor}15`, color: project.themeColor }}>
          {getIcon(project.type)}
        </div>
        <div className="project-links">
          {project.githubUrl && (
            <Magnet padding={30} magnetStrength={4}>
              <a href={project.githubUrl} target="_blank" rel="noreferrer" title="View Source Code" className="proj-link-btn">
                <GithubIcon size={18} />
              </a>
            </Magnet>
          )}
          {project.liveUrl && (
            <Magnet padding={30} magnetStrength={4}>
              <a href={project.liveUrl} target="_blank" rel="noreferrer" title="View Live Demo" className="proj-link-btn primary" style={{ backgroundColor: project.themeColor }}>
                <ExternalLink size={18} />
              </a>
            </Magnet>
          )}
        </div>
      </div>

      <div className="project-body">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
      </div>

      <div className="project-footer">
        <div className="project-tags">
          {project.tags.map(tag => (
            <span key={tag} className="tag-badge">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
