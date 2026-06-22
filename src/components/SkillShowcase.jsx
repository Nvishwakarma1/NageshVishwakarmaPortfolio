import { useState } from 'react';

const SKILLS_DATA = {
  frontend: [
    { name: 'React (Vite)', level: 90, color: '#61DAFB', desc: 'Developing clean SPA layouts, state management, reactive components, and rendering optimizations.' },
    { name: 'JavaScript (ES6+)', level: 88, color: '#F7DF1E', desc: 'DOM manipulation, asynchronous functions, promises, and logical algorithms.' },
    { name: 'HTML5 & CSS3', level: 92, color: '#E34F26', desc: 'Responsive layouts, CSS variables, flexbox, CSS grids, and semantic page structures.' },
    { name: 'PHP & Python', level: 75, color: '#8892BF', desc: 'Backend development basics, scripting, data handling, and building basic API endpoints.' },
  ],
  aiTools: [
    { name: 'Antigravity & Gemini', level: 95, color: '#aa3bff', desc: 'Using Google DeepMind agentic tools for rapid prototyping, debugging, and code refactoring.' },
    { name: 'Claude & GPT-4o', level: 92, color: '#D97706', desc: 'Leveraging large language models for design feedback, logic planning, and code documentation.' },
    { name: 'GitHub Copilot', level: 90, color: '#24292F', desc: 'Real-time autocomplete, unit tests generation, and accelerating coding speed.' },
    { name: 'Firebase Studio', level: 80, color: '#FFCA28', desc: 'Configuring auth, datastores, and cloud deployments for simple applications.' },
  ],
  technical: [
    { name: 'Device Troubleshooting', level: 85, color: '#f43f5e', desc: 'Diagnosing and repairing smartphone, laptop, and desktop computer hardware or software issues.' },
    { name: 'OS & Software Install', level: 90, color: '#0EA5E9', desc: 'Configuring operating systems (Windows, Linux), driver updates, and toolchain configurations.' },
    { name: 'Computer Hardware', level: 80, color: '#10B981', desc: 'Understanding of processors, memory, motherboard configurations, and hardware testing.' },
    { name: 'Soft Skills', level: 88, color: '#8B5CF6', desc: 'Clear communication, agile teamwork, and collaborative problem-solving.' }
  ]
};

export default function SkillShowcase() {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const [selectedSkill, setSelectedSkill] = useState(SKILLS_DATA.frontend[0]);

  const categories = [
    { id: 'frontend', label: 'Development' },
    { id: 'aiTools', label: 'AI & Workflow' },
    { id: 'technical', label: 'Technical & Hardware' },
  ];

  return (
    <div className="skills-showcase">
      {/* Category Tabs */}
      <div className="skills-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setSelectedSkill(SKILLS_DATA[cat.id][0]);
            }}
            className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="skills-content-grid">
        {/* Skills List */}
        <div className="skills-list">
          {SKILLS_DATA[activeCategory].map(skill => (
            <div
              key={skill.name}
              className={`skill-item ${selectedSkill.name === skill.name ? 'selected' : ''}`}
              onClick={() => setSelectedSkill(skill)}
              style={{
                '--skill-color': skill.color,
                '--skill-glow': `${skill.color}22`
              }}
            >
              <div className="skill-info">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percentage">{skill.level}%</span>
              </div>
              <div className="skill-bar-outer">
                <div 
                  className="skill-bar-inner" 
                  style={{ width: `${skill.level}%`, backgroundColor: skill.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Selected Skill Detail Panel */}
        <div className="skill-detail-panel">
          <div className="detail-header" style={{ color: selectedSkill.color }}>
            <div 
              className="detail-color-badge" 
              style={{ backgroundColor: selectedSkill.color, boxShadow: `0 0 15px ${selectedSkill.color}` }}
            />
            <h3>{selectedSkill.name}</h3>
          </div>
          <p className="detail-desc">{selectedSkill.desc}</p>
          <div className="tech-badge-container">
            <span className="tech-badge" style={{ borderColor: selectedSkill.color, color: selectedSkill.color }}>
              Level: {selectedSkill.level >= 90 ? 'Advanced / Expert' : 'Proficient'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
