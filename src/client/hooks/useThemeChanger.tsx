import { useState, useEffect } from "react";

/**
 * Persists the editor theme ("dark" | "light") in localStorage.
 * Defaults to "light" if no stored value exists.
 *
 * Carbon theme classes applied to the editor wrapper:
 *   dark  → "cds--g100"  (Carbon Gray 100 dark theme)
 *   light → "cds--white" (Carbon White theme)
 */

const STORAGE_KEY = "markdown-editor-theme";
const DARK_CLASS = "cds--g100";
const LIGHT_CLASS = "cds--white";

export const useThemeChanger = () => {
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem(STORAGE_KEY) ?? "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const { body } = document;
    body.classList.remove(DARK_CLASS, LIGHT_CLASS);
    body.classList.add(theme === "dark" ? DARK_CLASS : LIGHT_CLASS);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage may be unavailable (private browsing, etc.)
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  /** Carbon theme class to apply to the root element */

  return { theme, toggleTheme };
};
