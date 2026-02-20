"use client";

import { useEffect } from "react";
import { useTheme } from "@/lib/editor/hooks";

export function ThemeApplier() {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--foreground", theme.foreground);

    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--surface", theme.surface);
    root.style.setProperty("--muted-foreground", theme.mutedForeground);
    root.style.setProperty("--border", theme.border);

    root.style.setProperty("--radius-base", `${Math.max(0, theme.radius)}px`);
    root.style.setProperty("--shadow-strength", `${Math.min(1, Math.max(0, theme.shadow))}`);

    root.style.setProperty(
      "--font-sans",
      theme.font === "geist"
        ? "var(--font-geist)"
        : theme.font === "merriweather"
          ? "var(--font-merriweather)"
          : "var(--font-inter)"
    );

    const scale = Math.min(1.15, Math.max(0.9, theme.textScale));
    root.style.setProperty("--text-scale", `${scale}`);

    root.dataset.mode = theme.mode;
  }, [theme]);

  return null;
}

