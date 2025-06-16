import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateResolvedTheme = () => {
      let resolved: 'light' | 'dark';
      
      if (theme === 'system') {
        resolved = mediaQuery.matches ? 'dark' : 'light';
      } else {
        resolved = theme;
      }
      
      setResolvedTheme(resolved);
      
      // Update the HTML class
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      
      // Set CSS custom properties for themes
      if (resolved === 'dark') {
        root.style.setProperty('--color-bg-primary', '#0f172a'); // slate-900
        root.style.setProperty('--color-bg-secondary', '#1e293b'); // slate-800
        root.style.setProperty('--color-bg-tertiary', '#334155'); // slate-700
        root.style.setProperty('--color-text-primary', '#f8fafc'); // slate-50
        root.style.setProperty('--color-text-secondary', '#cbd5e1'); // slate-300
        root.style.setProperty('--color-text-tertiary', '#94a3b8'); // slate-400
        root.style.setProperty('--color-border', '#475569'); // slate-600
        root.style.setProperty('--color-accent', '#3b82f6'); // blue-500
        root.style.setProperty('--color-accent-hover', '#2563eb'); // blue-600
      } else {
        root.style.setProperty('--color-bg-primary', '#ffffff'); // white
        root.style.setProperty('--color-bg-secondary', '#f8fafc'); // slate-50
        root.style.setProperty('--color-bg-tertiary', '#f1f5f9'); // slate-100
        root.style.setProperty('--color-text-primary', '#1e293b'); // slate-800
        root.style.setProperty('--color-text-secondary', '#475569'); // slate-600
        root.style.setProperty('--color-text-tertiary', '#64748b'); // slate-500
        root.style.setProperty('--color-border', '#e2e8f0'); // slate-200
        root.style.setProperty('--color-accent', '#3b82f6'); // blue-500
        root.style.setProperty('--color-accent-hover', '#2563eb'); // blue-600
      }
    };

    updateResolvedTheme();
    
    // Listen for system theme changes
    const handleChange = () => {
      if (theme === 'system') {
        updateResolvedTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    setTheme: updateTheme,
  };
}; 