/*
Purpose
- Renders subtle animated vertical beams in the background.
- Adds calm motion without distracting from primary content.

How It Works
- Pure presentational component; no props or state.
- Uses a simple CSS animation on repeated beam elements.

Where It Fits
- Used behind hero and other sections for gentle atmosphere.
*/
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
