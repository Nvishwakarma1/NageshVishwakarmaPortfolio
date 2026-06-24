import { useState } from 'react';
import { Calendar, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';

const SKILLS_DATA = {
  frontend: [
    { name: 'React (Vite)', level: 90, color: '#0029FF', desc: 'Developing clean SPA layouts, state management, reactive components, and rendering optimizations.' },
    { name: 'JavaScript (ES6+)', level: 88, color: '#FFE600', desc: 'DOM manipulation, asynchronous functions, promises, and logical algorithms.' },
    { name: 'HTML5 & CSS3', level: 92, color: '#FF007A', desc: 'Responsive layouts, CSS variables, flexbox, CSS grids, and semantic page structures.' },
    { name: 'PHP & Python', level: 75, color: '#00FF66', desc: 'Backend development basics, scripting, data handling, and building basic API endpoints.' },
  ],
  aiTools: [
    { name: 'Antigravity & Gemini', level: 95, color: '#00FF66', desc: 'Using Google DeepMind agentic tools for rapid prototyping, debugging, and code refactoring.' },
    { name: 'Claude & GPT-4o', level: 92, color: '#FF007A', desc: 'Leveraging large language models for design feedback, logic planning, and code documentation.' },
    { name: 'GitHub Copilot', level: 90, color: '#0029FF', desc: 'Real-time autocomplete, unit tests generation, and accelerating coding speed.' },
    { name: 'Firebase Studio', level: 80, color: '#FFE600', desc: 'Configuring auth, datastores, and cloud deployments for simple applications.' },
  ],
  technical: [
    { name: 'Device Troubleshooting', level: 85, color: '#FF007A', desc: 'Diagnosing and repairing smartphone, laptop, and desktop computer hardware or software issues.' },
    { name: 'OS & Software Install', level: 90, color: '#0029FF', desc: 'Configuring operating systems (Windows, Linux), driver updates, and toolchain configurations.' },
    { name: 'Computer Hardware', level: 80, color: '#FFE600', desc: 'Understanding of processors, memory, motherboard configurations, and hardware testing.' },
    { name: 'Soft Skills', level: 88, color: '#00FF66', desc: 'Clear communication, agile teamwork, and collaborative problem-solving.' }
  ]
};

const TIMELINE_DATA = [
  {
    period: '2023 - 2026',
    role: 'B.Tech in Information Technology',
    company: 'Priyadarshini College of Engineering, Nagpur (RTMNU)',
    icon: 'education',
    color: '#0029FF',
    details: [
      'Gaining deep foundation in software architectures, systems engineering, and data networks.',
      'Active participant in coding hackathons and visual design workshops.',
      'Integrating advanced AI frameworks into web development research projects.'
    ]
  },
  {
    period: '2023',
    role: 'Web Development Intern',
    company: 'Virtual Galaxy Info Tech Pvt. Ltd., Nagpur',
    icon: 'internship',
    color: '#00FF66',
    details: [
      'Contributed to client website developments and mock layouts.',
      'Assisted in identifying and resolving frontend layout rendering bugs.',
      'Optimized image sizes and scripts to improve load speeds and page responsiveness.'
    ]
  },
  {
    period: '2020 - 2023',
    role: 'Diploma in Computer Engineering',
    company: 'G.H. Raisoni Institute of Information and Technology (MSBTE) — 80%',
    icon: 'education',
    color: '#FF007A',
    details: [
      'Acquired core knowledge in basic programming paradigms (C, Java, Python) and databases.',
      'Completed academic projects focusing on clean UI designs and functional frontend modules.',
      'Developed troubleshooting solutions for local hardware and operating system setups.'
    ]
  }
];

export default function ExperienceFrame({ layoutMode }) {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const [selectedSkill, setSelectedSkill] = useState(SKILLS_DATA.frontend[0]);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState(0); // expand first item by default

  const categories = [
    { id: 'frontend', label: 'Dev / Coding' },
    { id: 'aiTools', label: 'AI Workflow' },
    { id: 'technical', label: 'Systems & Hardware' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'internship': return <Briefcase className="w-4 h-4" />;
      default: return <GraduationCap className="w-4 h-4" />;
    }
  };

  if (layoutMode === 'minimal') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-mono text-xs text-white">
        {/* Left Column: Simple Skills List */}
        <div className="flex flex-col gap-6">
          <span className="text-[#888c94] text-[9px] tracking-widest font-bold">// CAPABILITIES</span>
          <div className="flex flex-col gap-5">
            {Object.entries(SKILLS_DATA).map(([category, skills]) => (
              <div key={category} className="flex flex-col gap-2">
                <span className="text-[#888c94] text-[9px] uppercase tracking-wider font-extrabold">
                  {category === 'frontend' ? 'Coding & Frontend' : category === 'aiTools' ? 'AI Systems' : 'Technical & Hardware'}
                </span>
                <ul className="flex flex-col gap-1.5 pl-2">
                  {skills.map((skill) => (
                    <li key={skill.name} className="flex justify-between border-b border-[#3e4045] border-dashed pb-1">
                      <span className="text-white">{skill.name}</span>
                      <span className="text-[#888c94]">{skill.level}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Simple Timeline List */}
        <div className="flex flex-col gap-6">
          <span className="text-[#888c94] text-[9px] tracking-widest font-bold">// JOURNEY LOGS</span>
          <div className="flex flex-col gap-6">
            {TIMELINE_DATA.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 border-l border-[#3e4045] pl-4 relative">
                <span className="text-[#888c94] text-[9px] font-bold">{item.period}</span>
                <h4 className="text-white font-extrabold uppercase text-xs">{item.role}</h4>
                <span className="text-[#a1a1aa] font-bold text-[10px]">{item.company}</span>
                <ul className="flex flex-col gap-1 mt-1">
                  {item.details.map((detail, dIdx) => (
                    <li key={dIdx} className="text-[#888c94] text-[10px] leading-relaxed relative pl-3 before:content-['-'] before:absolute before:left-0">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      
      {/* Left Column: Capabilities/Skills (6 cols) */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <div>
          <span className="font-mono text-[10px] font-extrabold uppercase text-text-base opacity-60 block mb-2">
            [ CAPABILITIES SELECTOR ]
          </span>
          
          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedSkill(SKILLS_DATA[cat.id][0]);
                }}
                className={`font-heading font-extrabold text-xs uppercase px-4 py-2 border-2 border-border-base transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-mint text-black shadow-[2px_2px_0px_0px_var(--border-color)]'
                    : 'bg-card-bg text-text-base hover:bg-canary hover:text-black hover:shadow-[2px_2px_0px_0px_var(--border-color)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Skill List */}
          <div className="flex flex-col gap-4">
            {SKILLS_DATA[activeCategory].map((skill) => (
              <div
                key={skill.name}
                onClick={() => setSelectedSkill(skill)}
                className={`border-2 p-3.5 bg-card-bg cursor-pointer select-none transition-all ${
                  selectedSkill.name === skill.name
                    ? 'border-pink shadow-[4px_4px_0px_0px_var(--accent-pink)]'
                    : 'border-border-base shadow-[3px_3px_0px_0px_var(--border-color)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_var(--border-color)]'
                }`}
              >
                <div className="flex justify-between font-mono text-xs font-black text-text-base mb-2">
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="h-5 bg-bg-base border-2 border-border-base p-0.5 overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 ease-out" 
                    style={{ 
                      width: `${skill.level}%`, 
                      backgroundColor: skill.color 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skill Details Panel */}
          {selectedSkill && (
            <div className="mt-6 border-2 border-border-base bg-card-bg p-4 shadow-[3px_3px_0px_0px_var(--border-color)] transition-all">
              <h4 
                className="font-heading font-black text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5"
                style={{ color: selectedSkill.color }}
              >
                <ArrowRight size={14} /> {selectedSkill.name}
              </h4>
              <p className="font-mono text-xs text-text-base leading-relaxed">
                {selectedSkill.desc}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Timeline logs (6 cols) */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <div>
          <span className="font-mono text-[10px] font-extrabold uppercase text-text-base opacity-60 block mb-3">
            [ JOURNEY LOGS ]
          </span>

          <div className="railway-timeline">
            <div className="railway-line" />
            {TIMELINE_DATA.map((item, idx) => (
              <div key={idx} className="railway-item">
                <div 
                  className="railway-node" 
                  style={{ backgroundColor: item.color }} 
                />
                <div 
                  className={`railway-card ${selectedTimelineItem === idx ? 'border-pink shadow-brutal-pink' : ''}`}
                  onClick={() => setSelectedTimelineItem(selectedTimelineItem === idx ? -1 : idx)}
                >
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] font-bold text-text-base flex items-center gap-1 opacity-70">
                      {getIcon(item.icon)}
                      {item.period}
                    </span>
                  </div>
                  
                  <h4 className="font-heading font-black text-md text-text-base uppercase tracking-tight">
                    {item.role}
                  </h4>
                  <span className="font-mono text-xs text-text-base opacity-85 block mb-2 font-bold">
                    {item.company}
                  </span>

                  {selectedTimelineItem === idx && (
                    <div className="mt-3 pt-3 border-t-2 border-dashed border-border-base">
                      <ul className="flex flex-col gap-2">
                        {item.details.map((detail, dIdx) => (
                          <li 
                            key={dIdx} 
                            className="font-mono text-xs text-text-base leading-relaxed relative pl-4 before:content-['↳'] before:absolute before:left-0 before:text-pink"
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
