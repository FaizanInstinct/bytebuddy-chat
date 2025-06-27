'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children, attribute = 'class', defaultTheme = 'system', enableSystem = true }) {
  const [theme, setTheme] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);
  
  // Initialize theme based on system preference and stored preference
  useEffect(() => {
    setMounted(true);
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      setTheme(storedTheme);
      updateDocumentClass(storedTheme);
    } else if (enableSystem) {
      // Check system preference
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemPreference);
      updateDocumentClass(systemPreference);
    } else {
      updateDocumentClass(defaultTheme);
    }
  }, [enableSystem, defaultTheme]);
  
  // Listen for system preference changes
  useEffect(() => {
    if (!enableSystem) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        updateDocumentClass(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableSystem]);
  
  // Update theme when it changes
  useEffect(() => {
    if (mounted) {
      updateDocumentClass(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);
  
  const updateDocumentClass = (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  

  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}