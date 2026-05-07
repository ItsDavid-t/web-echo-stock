"use client";

import { useEffect, useState } from "react";

const themeOptions = {
  light: {
    label: "Modo claro",
    icon: "☀️",
  },
  dark: {
    label: "Modo oscuro",
    icon: "🌙",
  },
} as const;

type ThemeOption = keyof typeof themeOptions;

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeOption>("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as ThemeOption | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme ?? (prefersDark ? "dark" : "light");

    applyTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  function applyTheme(nextTheme: ThemeOption) {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
  }

  function toggleTheme() {
    const nextTheme: ThemeOption = theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:bg-[var(--surface-strong)]"
      aria-label={`Cambiar a ${theme === "light" ? "modo oscuro" : "modo claro"}`}
    >
      <span>{themeOptions[theme].icon}</span>
      <span>{themeOptions[theme].label}</span>
    </button>
  );
}
