import React from "react";
import { Light, Moon } from "@carbon/icons-react";
import { IconButton } from "@carbon/react";
import { useThemeChanger } from "../hooks/useThemeChanger";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeChanger();
  return (
    <div className="theme-toggle-btn">
      {/* Theme toggle */}
      <IconButton
        label={
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        }
        type="button"
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        }
        title={theme === "dark" ? "Light mode" : "Dark mode"}
      >
        {theme === "dark" ? <Light size={16} /> : <Moon size={16} />}
      </IconButton>
    </div>
  );
};
