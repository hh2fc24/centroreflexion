import type { SiteContent, ThemeSettings } from "@/lib/editor/types";
import publishedTheme from "@/lib/editor/published-theme.json";
import publishedContent from "@/lib/editor/published-content.json";

export const DEFAULT_THEME: ThemeSettings = publishedTheme as unknown as ThemeSettings;
export const DEFAULT_CONTENT: SiteContent = publishedContent as unknown as SiteContent;
