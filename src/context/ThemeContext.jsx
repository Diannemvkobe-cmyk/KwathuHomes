/*
Purpose
- Manages theme preference (light/dark/system) across the app.
- Applies the correct class to enable Tailwind’s dark mode.

How It Works
- Reads initial preference from localStorage (or system).
- Listens for OS theme changes when preference is “system”.
- Updates documentElement class to toggle dark mode.
- Exposes setTheme to let components switch preference.

Where It Fits
- Wraps the App in main.jsx so children can use useTheme().
*/
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [preference, setPreference] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('theme') || 'system' : 'system'
  );
  const [systemDark, setSystemDark] = useState(
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );

  const effectiveDark = useMemo(() => {
    return preference === 'dark' || (preference === 'system' && systemDark);
  }, [preference, systemDark]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemDark(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const el = document.documentElement;
    if (effectiveDark) el.classList.add('dark');
    else el.classList.remove('dark');
  }, [effectiveDark]);

  const setTheme = (value) => {
    setPreference(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', value);
    }
  };

  return (
    <ThemeContext.Provider value={{ preference, effectiveDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
