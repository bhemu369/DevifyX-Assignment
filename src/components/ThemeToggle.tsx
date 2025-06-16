import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

// Simple toggle between light and dark modes
export const SimpleThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    // Simple toggle: if dark, go to light; if light, go to dark
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 theme-text-secondary hover:theme-text-primary rounded-md transition-colors focus-ring"
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};
