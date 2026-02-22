import type { SiteContent, SitePage, ThemeSettings } from "@/lib/editor/types";
import publishedTheme from "@/lib/editor/published-theme.json";
import publishedContent from "@/lib/editor/published-content.json";
import publishedPages from "@/lib/editor/published-pages.json";

export const DEFAULT_THEME: ThemeSettings = publishedTheme as unknown as ThemeSettings;
export const DEFAULT_CONTENT: SiteContent = publishedContent as unknown as SiteContent;
export const DEFAULT_PAGES: SitePage[] = (publishedPages as unknown as { pages: SitePage[] }).pages;
