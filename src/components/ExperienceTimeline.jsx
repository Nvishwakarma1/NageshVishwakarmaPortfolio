import { Calendar, Briefcase, GraduationCap } from 'lucide-react';

const TIMELINE_DATA = [
  {
    period: '2023 - 2026 (Pursuing)',
    role: 'B.Tech in Information Technology',
    company: 'Priyadarshini College of Engineering, Nagpur (RTMNU)',
    icon: 'education',
    color: '#aa3bff',
    details: [
      'Gaining deep foundation in software architectures, systems engineering, and data networks.',
      'Active participant in coding hackathons and visual design workshops.',
      'Integrating advanced AI frameworks into web development research projects.'
    ]
  },
  {
    period: 'Diploma Tenure',
    role: 'Web Development Intern',
    company: 'Virtual Galaxy Info Tech Pvt. Ltd., Nagpur',
    icon: 'internship',
    color: '#38BDF8',
    details: [
      'Contributed to client website developments and mock layouts.',
      'Assisted in identifying and resolving frontend layout rendering bugs.',
      'Optimized image sizes and scripts to improve load speeds and page responsiveness.'
    ]
  },
  {
    period: '2020 - 2023',
    role: 'Diploma in Computer Engineering — 80%',
    company: 'G.H. Raisoni Institute of Information and Technology, Nagpur (MSBTE)',
    icon: 'education',
    color: '#10B981',
    details: [
      'Acquired core knowledge in basic programming paradigms (C, Java, Python) and databases.',
      'Completed academic projects focusing on clean UI designs and functional frontend modules.',
      'Developed troubleshooting solutions for local hardware and operating system setups.'
    ]
  },
  {
    period: '2021',
    role: '12th (HSC) — 88%',
    company: 'Dharampeth M.P. Deo Memorial Science College, Nagpur',
    icon: 'education',
    color: '#f43f5e',
    details: [
      'Completed coursework with a focus on Physics, Chemistry, and Mathematics (PCM).',
      'Developed strong analytical, problem-solving, and logic reasoning skills.'
    ]
  },
  {
    period: '2019',
    role: '10th (SSC) — 73%',
    company: 'Saraswati Madhyamik Vidhyalaya, Prasad Nagar',
    icon: 'education',
    color: '#EAB308',
    details: [
      'Foundational schooling with strong performance in Mathematics and Science.'
    ]
  }
];

export default function ExperienceTimeline() {
  const getIcon = (type) => {
    switch (type) {
      case 'internship': return <Briefcase size={16} />;
      default: return <GraduationCap size={16} />;
    }
  };

  return (
    <div className="experience-timeline">
      <div className="timeline-line" />
      {TIMELINE_DATA.map((item, idx) => (
        <div 
          key={idx} 
          className="timeline-item"
          style={{
            '--timeline-color': item.color,
            '--timeline-glow': `${item.color}33`
          }}
        >
          {/* Node */}
          <div className="timeline-node">
            {getIcon(item.icon)}
          </div>

          {/* Card */}
          <div className="timeline-card">
            <div className="timeline-meta">
              <span className="timeline-period">
                <Calendar size={14} className="meta-icon" />
                {item.period}
              </span>
              <span className="timeline-company">{item.company}</span>
            </div>
            
            <h3 className="timeline-title">{item.role}</h3>
            
            <ul className="timeline-details">
              {item.details.map((detail, dIdx) => (
                <li key={dIdx}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
