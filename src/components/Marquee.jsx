export default function Marquee({ items = [], reverse = false, className = '' }) {
  const repeatedItems = [...items, ...items, ...items, ...items]; // repeat to ensure it covers screen width

  return (
    <div className={`relative w-screen left-1/2 -translate-x-1/2 overflow-hidden border-y-3 border-black bg-canary py-3 select-none flex ${className}`}>
      <div className={`flex whitespace-nowrap gap-8 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {repeatedItems.map((item, index) => (
          <span
            key={index}
            className="font-mono text-base font-bold text-black flex items-center uppercase"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
