import type { DesignPreset, ThemeSettings } from "@/lib/editor/types";

export function getDesignPresetTheme(preset: Exclude<DesignPreset, "custom">): Partial<ThemeSettings> {
  switch (preset) {
    case "minimal":
      return {
        mode: "light",
        primary: "#111827",
        secondary: "#6b7280",
        accent: "#2563eb",
        background: "#ffffff",
        surface: "#ffffff",
        foreground: "#0f172a",
        mutedForeground: "#475569",
        border: "rgba(148,163,184,0.22)",
        font: "inter",
        textScale: 1,
        radius: 14,
        shadow: 0.4,
        spacingScale: { xs: 6, sm: 10, md: 16, lg: 24, xl: 36, "2xl": 56 },
        radiusScale: { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 },
        shadowScale: { sm: 0.25, md: 0.55, lg: 0.85 },
      };
    case "corporate":
      return {
        mode: "light",
        primary: "#2563eb",
        secondary: "#a855f7",
        accent: "#06b6d4",
        background: "#ffffff",
        surface: "#ffffff",
        foreground: "#0f172a",
        mutedForeground: "#475569",
        border: "rgba(148,163,184,0.25)",
        font: "inter",
        textScale: 1,
        radius: 16,
        shadow: 0.6,
        spacingScale: { xs: 8, sm: 12, md: 18, lg: 28, xl: 44, "2xl": 72 },
        radiusScale: { sm: 12, md: 16, lg: 20, xl: 28, pill: 999 },
        shadowScale: { sm: 0.25, md: 0.6, lg: 1 },
      };
    case "premium":
      return {
        mode: "dark",
        primary: "#38bdf8",
        secondary: "#a855f7",
        accent: "#f97316",
        background: "#0b1220",
        surface: "#0f172a",
        foreground: "#e2e8f0",
        mutedForeground: "#94a3b8",
        border: "rgba(148,163,184,0.18)",
        font: "geist",
        textScale: 1.03,
        radius: 18,
        shadow: 0.8,
        spacingScale: { xs: 8, sm: 14, md: 20, lg: 32, xl: 52, "2xl": 84 },
        radiusScale: { sm: 12, md: 18, lg: 22, xl: 30, pill: 999 },
        shadowScale: { sm: 0.35, md: 0.75, lg: 1 },
      };
    default:
      return {};
  }
}
