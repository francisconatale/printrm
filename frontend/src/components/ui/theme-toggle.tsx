import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';

interface ThemeToggleProps {
  className?: string;
  iconSize?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = "size-10 rounded-full transition-all duration-300 active:scale-90 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20", 
  iconSize = 18 
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={className}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
    </button>
  );
};
