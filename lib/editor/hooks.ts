import { useContentStore, useEditorStore, useThemeStore } from "@/lib/editor/stores";
import type { PageId, Section, SectionType, Testimonial, ThemeSettings } from "@/lib/editor/types";

export function useEditor() {
  const adminEnabled = useEditorStore((s) => s.adminEnabled);
  const selectedPage = useEditorStore((s) => s.selectedPage);
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId);
  const setAdminEnabled = useEditorStore((s) => s.setAdminEnabled);
  const selectPage = useEditorStore((s) => s.selectPage);
  const selectSection = useEditorStore((s) => s.selectSection);
  return { adminEnabled, selectedPage, selectedSectionId, setAdminEnabled, selectPage, selectSection };
}

export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const lastChangedAt = useThemeStore((s) => s.lastChangedAt);
  const setTheme = useThemeStore((s) => s.setTheme);
  const resetTheme = useThemeStore((s) => s.resetTheme);
  return { theme, lastChangedAt, setTheme, resetTheme } as const satisfies {
    theme: ThemeSettings;
    lastChangedAt: number;
    setTheme: (partial: Partial<ThemeSettings>) => void;
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
