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
    root.style.setProperty("--accent", theme.accent || theme.secondary || theme.primary);
    root.style.setProperty("--surface", theme.surface);
    root.style.setProperty("--muted-foreground", theme.mutedForeground);
    root.style.setProperty("--border", theme.border);

    root.style.setProperty("--radius-base", `${Math.max(0, theme.radius)}px`);
    root.style.setProperty("--shadow-strength", `${Math.min(1, Math.max(0, theme.shadow))}`);

    const spacing = theme.spacingScale;
    if (spacing) {
      root.style.setProperty("--space-xs", `${Math.max(0, spacing.xs)}px`);
      root.style.setProperty("--space-sm", `${Math.max(0, spacing.sm)}px`);
      root.style.setProperty("--space-md", `${Math.max(0, spacing.md)}px`);
      root.style.setProperty("--space-lg", `${Math.max(0, spacing.lg)}px`);
      root.style.setProperty("--space-xl", `${Math.max(0, spacing.xl)}px`);
      root.style.setProperty("--space-2xl", `${Math.max(0, spacing["2xl"])}px`);
    }

    const radiusScale = theme.radiusScale;
    if (radiusScale) {
      root.style.setProperty("--radius-sm", `${Math.max(0, radiusScale.sm)}px`);
      root.style.setProperty("--radius-md", `${Math.max(0, radiusScale.md)}px`);
      root.style.setProperty("--radius-lg", `${Math.max(0, radiusScale.lg)}px`);
      root.style.setProperty("--radius-xl", `${Math.max(0, radiusScale.xl)}px`);
      root.style.setProperty("--radius-pill", `${Math.max(0, radiusScale.pill)}px`);
    }

    const shadowScale = theme.shadowScale;
    if (shadowScale) {
      root.style.setProperty("--shadow-sm", `${Math.min(1, Math.max(0, shadowScale.sm))}`);
      root.style.setProperty("--shadow-md", `${Math.min(1, Math.max(0, shadowScale.md))}`);
      root.style.setProperty("--shadow-lg", `${Math.min(1, Math.max(0, shadowScale.lg))}`);
    }

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
