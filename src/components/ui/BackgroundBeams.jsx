import React from 'react';

const BackgroundBeams = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute h-[500px] w-[1px] bg-gradient-to-b from-transparent via-emerald-500 to-transparent animate-beam"
        style={{ left: `${20 * i}%`, animationDelay: `${i * 1.5}s` }}
      />
    ))}
  </div>
);

export default BackgroundBeams;
