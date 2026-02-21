import { useContentStore, useEditorStore, useThemeStore } from "@/lib/editor/stores";
import type { PageId, Section, SectionType, Testimonial, TextStyleOverride, ThemeSettings } from "@/lib/editor/types";
import { useArticlesStore, type ArticleKind } from "@/lib/editor/articlesStore";
import type { Article } from "@/lib/data";

export function useEditor() {
  const adminEnabled = useEditorStore((s) => s.adminEnabled);
  const selectedPage = useEditorStore((s) => s.selectedPage);
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId);
  const selectedTextPath = useEditorStore((s) => s.selectedTextPath);
  const setAdminEnabled = useEditorStore((s) => s.setAdminEnabled);
  const selectPage = useEditorStore((s) => s.selectPage);
  const selectSection = useEditorStore((s) => s.selectSection);
  const selectText = useEditorStore((s) => s.selectText);
  return {
    adminEnabled,
    selectedPage,
    selectedSectionId,
    selectedTextPath,
    setAdminEnabled,
    selectPage,
    selectSection,
    selectText,
  };
}

export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const lastChangedAt = useThemeStore((s) => s.lastChangedAt);
  const setTheme = useThemeStore((s) => s.setTheme);
  const setTextStyle = useThemeStore((s) => s.setTextStyle);
  const resetTextStyle = useThemeStore((s) => s.resetTextStyle);
  const resetTheme = useThemeStore((s) => s.resetTheme);
  return { theme, lastChangedAt, setTheme, setTextStyle, resetTextStyle, resetTheme } as const satisfies {
    theme: ThemeSettings;
    lastChangedAt: number;
    setTheme: (partial: Partial<ThemeSettings>) => void;
    setTextStyle: (path: string, partial: Partial<TextStyleOverride>) => void;
    resetTextStyle: (path: string) => void;
    resetTheme: () => void;
  };
}

export function useContent() {
  const content = useContentStore((s) => s.content);
  const lastChangedAt = useContentStore((s) => s.lastChangedAt);

  const get = useContentStore((s) => s.get);
  const set = useContentStore((s) => s.set);
  const reset = useContentStore((s) => s.reset);

  const getHomeSections = useContentStore((s) => s.getHomeSections);
  const setHomeSections = useContentStore((s) => s.setHomeSections);
  const toggleHomeSection = useContentStore((s) => s.toggleHomeSection);
  const deleteHomeSection = useContentStore((s) => s.deleteHomeSection);
  const duplicateHomeSection = useContentStore((s) => s.duplicateHomeSection);
  const addHomeSection = useContentStore((s) => s.addHomeSection);

  const addTestimonial = useContentStore((s) => s.addTestimonial);
  const updateTestimonial = useContentStore((s) => s.updateTestimonial);
  const deleteTestimonial = useContentStore((s) => s.deleteTestimonial);

  return {
    content,
    lastChangedAt,
    get,
    set,
    reset,
    getHomeSections,
    setHomeSections,
    toggleHomeSection,
    deleteHomeSection,
    duplicateHomeSection,
    addHomeSection,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } as const satisfies {
    content: typeof content;
    lastChangedAt: number;
    get: <T = unknown>(path: string) => T | undefined;
    set: (path: string, value: unknown) => void;
    reset: () => void;
    getHomeSections: () => Section[];
    setHomeSections: (sections: Section[]) => void;
    toggleHomeSection: (sectionId: string) => void;
    deleteHomeSection: (sectionId: string) => void;
    duplicateHomeSection: (sectionId: string) => void;
    addHomeSection: (type: SectionType) => void;
    addTestimonial: () => void;
    updateTestimonial: (id: string, partial: Partial<Omit<Testimonial, "id">>) => void;
    deleteTestimonial: (id: string) => void;
  };
}

export type { PageId };

export function useArticles() {
  const columns = useArticlesStore((s) => s.columns);
  const reviews = useArticlesStore((s) => s.reviews);
  const lastChangedAt = useArticlesStore((s) => s.lastChangedAt);
  const add = useArticlesStore((s) => s.add);
  const rename = useArticlesStore((s) => s.rename);
  const update = useArticlesStore((s) => s.update);
  const replace = useArticlesStore((s) => s.replace);
  const remove = useArticlesStore((s) => s.remove);
  const reset = useArticlesStore((s) => s.reset);

  return {
    columns,
    reviews,
    lastChangedAt,
    add,
    rename,
    update,
    replace,
    remove,
    reset,
  } as const satisfies {
    columns: Article[];
    reviews: Article[];
    lastChangedAt: number;
    add: (kind: ArticleKind) => string;
    rename: (kind: ArticleKind, id: string, nextId: string) => void;
    update: (kind: ArticleKind, id: string, partial: Partial<Omit<Article, "id">>) => void;
    replace: (kind: ArticleKind, next: Article[]) => void;
    remove: (kind: ArticleKind, id: string) => void;
    reset: () => void;
  };
}
