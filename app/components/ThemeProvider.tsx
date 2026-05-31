"use client";
/* eslint-disable react-hooks/set-state-in-effect -- this provider hydrates
   client-only state (theme from localStorage) on mount; it can't run during
   SSR render, so the mount effect is the correct place. */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

/* ─── Types ─── */

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

/* ─── Storage helpers ─── */

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("kz-theme");
  if (stored === "dark" || stored === "light") return stored;
  /* Default to dark — user can toggle to light manually */
  return "dark";
}

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
    root.classList.remove("light");
  }
  /* Update meta theme-color */
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "light" ? "#f8f8fa" : "#0d0d0f");
  }
}

/* ─── Provider ─── */

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  /* Hydrate from localStorage after mount */
  useEffect(() => {
    const t = getStoredTheme();
    setThemeState(t);
    applyThemeToDOM(t);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("kz-theme", t);
    applyThemeToDOM(t);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ─── Hook ─── */

export function useTheme() {
  return useContext(ThemeContext);
}
