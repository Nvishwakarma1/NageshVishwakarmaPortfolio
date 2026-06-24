import { motion } from 'framer-motion';

export default function StyleToggle({ layoutMode, onChange }) {
  const isMinimal = layoutMode === 'minimal';

  return (
    <div
      role="radiogroup"
      aria-label="Website Layout Style Selector"
      className={`fixed top-6 right-6 z-50 flex items-center p-1 transition-all duration-300 rounded-md select-none ${
        isMinimal
          ? 'bg-[#252729] border border-[#3e4045] text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
          : 'bg-card-bg border-3 border-border-base shadow-[3px_3px_0px_0px_var(--border-color)] text-text-base'
      }`}
    >
      <button
        role="radio"
        aria-checked={!isMinimal}
        onClick={() => onChange('stylized')}
        className={`relative px-3.5 py-1.5 font-mono text-[9px] font-black uppercase tracking-widest cursor-pointer transition-colors duration-200 focus:outline-none ${
          !isMinimal ? 'text-white' : 'text-[#888c94] hover:text-white'
        }`}
      >
        {!isMinimal && (
          <motion.div
            layoutId="activeStyleBackground"
            className="absolute inset-0 bg-text-base rounded-sm -z-10"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        STYLIZED
      </button>

      <button
        role="radio"
        aria-checked={isMinimal}
        onClick={() => onChange('minimal')}
        className={`relative px-3.5 py-1.5 font-mono text-[9px] font-black uppercase tracking-widest cursor-pointer transition-colors duration-200 focus:outline-none ${
          isMinimal ? 'text-white' : 'text-text-base hover:text-black'
        }`}
      >
        {isMinimal && (
          <motion.div
            layoutId="activeStyleBackground"
            className="absolute inset-0 bg-[#3a3c41] rounded-sm -z-10"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        MINIMAL_OS
      </button>
    </div>
  );
}
