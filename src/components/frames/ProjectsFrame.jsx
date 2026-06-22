import { useState } from "react";
import { ExternalLink, Cpu, Sparkles, Monitor, Code, Earth } from "lucide-react";

const GithubIcon = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const PROJECTS = [
  {
    id: 1,
    title: "Dev Canvas Platform",
    description:
      "Advanced web drawing interface built for visualizing coordinate boundaries, custom vector mathematical calculations, and dynamic interface positioning loops.",
    tags: ["React 19", "Tailwind CSS", "Canvas API", "Lucide Icons"],
    type: "Web Workspace",
    themeBg: "#00FF66", // electric mint
    themeFg: "#111111",
    githubUrl: "https://github.com/Nvishwakarma1/DevCanvas",
    liveUrl: "https://dev-canvas-gray.vercel.app/",
    icon: "creative",
  },
  {
    id: 2,
    title: "NeoCode Technologies",
    description:
      "High-performance production enterprise network portal providing programmatic scaling solutions, AI system orchestrations, and clean system diagnostics automation interfaces.",
    tags: ["React", "CSS Grid", "SaaS Systems", "Optimization"],
    type: "Agency Platform",
    themeBg: "#FFE600", // canary yellow
    themeFg: "#111111",
    githubUrl: "https://github.com/Kaustubh-Deotighare01/neocode",
    liveUrl: "https://www.neocodetechnologies.in/",
    icon: "cpu",
  },
  {
    id: 3,
    title: "Acharya An Chauddri Portal",
    description:
      "Clean, semantic multi-page professional consultant portal engineered with strict masonry layouts and responsive alignment frameworks for an elite academy structure.",
    tags: ["Production UI", "CSS Grid", "SEO Engine", "Responsive Design"],
    type: "Enterprise Portal",
    themeBg: "#FF007A", // pink
    themeFg: "#FFFFFF",
    githubUrl: null, // Production build
    liveUrl: "https://acharyaanchauddri.in/",
    icon: "earth",
  },
  {
    id: 4,
    title: "Chauddri Optimization Hub",
    description:
      "Highly responsive conversion funnel blueprint. Features compressed asset rendering schedules, clean data tracking systems, and rigid interface layouts.",
    tags: ["Landing UX", "Asset Optimization", "Performance Analytics"],
    type: "Marketing System",
    themeBg: "#0029FF", // electric blue
    themeFg: "#FFFFFF",
    githubUrl: null,
    liveUrl: "https://landingpage.acharyaanchauddri.in/",
    icon: "monitor",
  },
  {
    id: 5,
    title: "Interior Design Studio",
    description:
      "High-performance structural display setup built for spatial layout sorting, smooth animation timelines, and custom grid structural updates.",
    tags: ["React", "CSS Grid", "Framer Motion", "SEO Opt."],
    type: "Creative Portfolio",
    themeBg: "#a855f7", // purple accent
    themeFg: "#FFFFFF",
    githubUrl: "https://github.com/Nvishwakarma1/3d-scrollstyle-web",
    liveUrl: "https://3d-scrollstyle-web.vercel.app/",
    icon: "creative",
  },
  {
    id: 6,
    title: "Unstuck Platform",
    description:
      "A community troubleshooting system designed to help users resolve technical issues related to smartphones, laptops, and PCs. Users submit hardware or software faults and receive solutions from verified technicians.",
    tags: ["React", "Node.js", "JSON API", "Responsive UI"],
    type: "Dashboard Utility",
    themeBg: "#FF007A", // pink
    themeFg: "#111111",
    githubUrl: "https://github.com/Nvishwakarma1",
    liveUrl: null,
    icon: "cpu",
  },
];

export default function ProjectsFrame() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "cpu":
        return <Cpu className="w-8 h-8" />;
      case "creative":
        return <Sparkles className="w-8 h-8" />;
      case "earth":
        return <Earth className="w-8 h-8" />;
      default:
        return <Monitor className="w-8 h-8" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Dynamic structural responsive grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="flex flex-col bg-card-bg border-3 border-border-base shadow-brutal brutal-interactive select-none p-5 transition-all duration-300"
          >
            {/* Visual Header / Forced Desktop Viewport Iframe Area */}
            <div
              className="w-full h-44 border-2 border-border-base mb-4 relative overflow-hidden bg-[#111111]"
              style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            >
              {proj.liveUrl && proj.liveUrl !== "#" ? (
                <div className="w-full h-full relative">
                  {/* Outer Wrapper forcing downscaling matrix dimensions */}
                  <div 
                    className="absolute top-0 left-0 origin-top-left pointer-events-none"
                    style={{
                      width: "1280px",
                      height: "704px",
                      transform: "scale(0.265)" // Perfectly down-scales a 1280px screen into standard 44rem height cards
                    }}
                  >
                    <iframe
                      src={proj.liveUrl}
                      title={proj.title}
                      className="w-full h-full border-none bg-white select-none"
                      loading="lazy"
                    />
                  </div>
                  {/* Anti-Scroll Trap Invisible Barrier Overlay */}
                  <div className="absolute inset-0 z-10 bg-transparent pointer-events-auto" />
                </div>
              ) : (
                /* Fallback layout for offline items without live routes */
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <div
                    className="p-3 border-2 border-border-base bg-card-bg shadow-[3px_3px_0px_0px_var(--border-color)] text-text-base mb-2"
                    style={{ color: proj.themeBg }}
                  >
                    {getIcon(proj.icon)}
                  </div>
                </div>
              )}
              
              {/* Context utility identification sticker */}
              <span className="absolute bottom-1 right-1 z-20 font-mono text-[8px] font-bold text-white bg-[#111111] px-1.5 py-0.5 border border-white/20 uppercase tracking-wider opacity-90">
                {proj.liveUrl && proj.liveUrl !== "#" ? "LIVE_VIEWPORT.SYS" : "OFFLINE_UTILITY.RAW"}
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
              <span className="font-mono text-xs text-text-base opacity-60">
                ID: 0{proj.id}
              </span>
            </div>

            <h3 className="font-heading text-xl font-black uppercase text-text-base tracking-tight mb-2">
              {proj.title}
            </h3>

            {/* Description Area */}
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

            {/* Card Action Interactive Buttons */}
            <div className="flex gap-3 border-t border-border-base pt-4 mt-auto">
              {proj.githubUrl ? (
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-card-bg text-text-base text-center py-2 px-3 border-2 border-border-base font-heading font-extrabold text-xs uppercase shadow-[3px_3px_0px_0px_var(--border-color)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border-color)] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <GithubIcon size={14} /> Source
                </a>
              ) : (
                <span className="flex-1 text-center py-2 px-3 border-2 border-border-base font-heading font-extrabold text-xs uppercase text-text-base opacity-40 bg-card-bg/50 cursor-not-allowed flex items-center justify-center gap-1.5 select-none">
                  <Code size={12} /> Closed
                </span>
              )}
              
              {proj.liveUrl && proj.liveUrl !== "#" ? (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-2 px-3 border-2 border-border-base font-heading font-extrabold text-xs uppercase shadow-[3px_3px_0px_0px_var(--border-color)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border-color)] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  style={{ backgroundColor: proj.themeBg, color: proj.themeFg }}
                >
                  Launch <ExternalLink size={12} />
                </a>
              ) : (
                <span className="flex-1 text-center py-2 px-3 border-2 border-border-base font-heading font-extrabold text-xs uppercase text-text-base opacity-40 bg-card-bg cursor-not-allowed flex items-center justify-center gap-1.5 select-none">
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