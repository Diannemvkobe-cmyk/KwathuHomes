/*
Purpose
- Renders a large, soft spotlight glow behind content.
- Adds depth without overpowering typography or controls.

How It Works
- Pure presentational; one animated, blurred, circular element.
- No props or state required.

Where It Fits
- Used in hero/landing areas to subtly highlight the center.
*/
import React from 'react';

const Spotlight = () => (
  <div className="absolute -top-[30%] -left-[10%] w-[1000px] h-[1000px] bg-emerald-500/10 blur-[150px] animate-spotlight opacity-0 rounded-full pointer-events-none" />
);

export default Spotlight;
