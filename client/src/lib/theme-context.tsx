import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Check if user has a preferred theme or if they've set one previously
  const getInitialTheme = (): Theme => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("vdreamscape-theme") as Theme;
      if (savedTheme) {
        return savedTheme;
      }
      
      // If no saved theme, check user's system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    
    // Default to light if not in browser
    return "light";
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply theme changes to the document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light-theme", "dark-theme");
    root.classList.add(`${theme}-theme`);
    
    // Save the theme preference to localStorage
    localStorage.setItem("vdreamscape-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(current => current === "light" ? "dark" : "light");
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
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}