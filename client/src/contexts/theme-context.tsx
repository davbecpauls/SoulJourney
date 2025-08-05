import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'child' | 'adult';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('adult');

  useEffect(() => {
    const savedTheme = localStorage.getItem('academy-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('academy-theme', theme);
    
    // Update body class for theme
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .trim();
    document.body.classList.add(`theme-${theme}`);
    
    // Update background gradient
    if (theme === 'child') {
      document.body.style.background = 'linear-gradient(135deg, #831843 0%, #7c2d92 25%, #5b21b6 50%, #1e3a8a 75%, #831843 100%)';
    } else {
      document.body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #581c87 50%, #312e81 75%, #0f172a 100%)';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'child' ? 'adult' : 'child');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
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
