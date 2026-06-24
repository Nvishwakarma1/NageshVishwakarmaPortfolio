import React from 'react';

export default function MinimalNav({ activeSection, scrollToSection }) {
  const links = [
    { id: 'hero', num: '01', label: 'HOME' },
    { id: 'capabilities', num: '02', label: 'CAPABILITIES' },
    { id: 'projects', num: '03', label: 'PROJECTS' },
    { id: 'contact', num: '04', label: 'CONTACT' },
  ];

  return (
    <nav className="minimal-nav fixed right-8 sm:right-12 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-5 select-none font-mono text-[9px] sm:text-[10px] tracking-widest text-right">
      {links.map((link) => {
        const isActive = activeSection === link.id;
        return (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            className="group flex items-center justify-end gap-3 focus:outline-none cursor-pointer"
            aria-label={`Scroll to ${link.label}`}
          >
            <span
              className={`transition-all duration-300 ${
                isActive
                  ? 'text-white font-extrabold translate-x-[-4px]'
                  : 'text-[#888c94] group-hover:text-white group-hover:translate-x-[-2px]'
              }`}
            >
              {isActive ? '// ' : '   '}
              {link.num} . {link.label}
            </span>
            <span
              className={`w-1.5 h-1.5 transition-all duration-300 ${
                isActive
                  ? 'bg-white rotate-45 scale-125'
                  : 'bg-[#3e4045] group-hover:bg-[#888c94] rounded-full'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
