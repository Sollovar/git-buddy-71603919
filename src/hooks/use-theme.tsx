import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "warm";

const STORAGE_KEY = "app-theme";

/**
 * Shared module-level store so every `useTheme()` consumer (including the Privy
 * provider) reacts to a theme change immediately, without a page refresh.
 */
let current: Theme = "warm";
const listeners = new Set<(theme: Theme) => void>();

function apply(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("theme-light", theme === "light");
}

function set(theme: Theme, persist: boolean) {
  current = theme;
  apply(theme);
  if (persist) localStorage.setItem(STORAGE_KEY, theme);
  listeners.forEach((l) => l(theme));
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(current);

  useEffect(() => {
    listeners.add(setThemeState);
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme = stored === "light" ? "light" : "warm";
    if (initial !== current) set(initial, false);
    else setThemeState(current);
    return () => {
      listeners.delete(setThemeState);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => set(next, true), []);

  return { theme, setTheme };
}
