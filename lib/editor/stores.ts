import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_CONTENT, DEFAULT_THEME } from "@/lib/editor/defaults";
import type {
  PageId,
  Section,
  SectionType,
  SiteContent,
  TextStyleOverride,
  ThemeSettings,
  Testimonial,
} from "@/lib/editor/types";
import { memoryStorage } from "@/lib/editor/storage";
import { getByPath, setByPath } from "@/lib/editor/path";

const storage = createJSONStorage(() => (typeof window !== "undefined" ? localStorage : memoryStorage));

type ThemeStore = {
  theme: ThemeSettings;
  lastChangedAt: number;
  setTheme: (partial: Partial<ThemeSettings>) => void;
  setTextStyle: (path: string, partial: Partial<TextStyleOverride>) => void;
  resetTextStyle: (path: string) => void;
  resetTheme: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      lastChangedAt: 0,
      setTheme: (partial) =>
        set((state) => ({
          theme: { ...state.theme, ...partial },
          lastChangedAt: Date.now(),
        })),
      setTextStyle: (path, partial) =>
        set((state) => ({
          theme: {
            ...state.theme,
            textStyles: {
              ...state.theme.textStyles,
              [path]: { ...(state.theme.textStyles[path] ?? {}), ...partial },
            },
          },
          lastChangedAt: Date.now(),
        })),
      resetTextStyle: (path) =>
        set((state) => {
          const next = { ...state.theme.textStyles };
          delete next[path];
          return { theme: { ...state.theme, textStyles: next }, lastChangedAt: Date.now() };
        }),
      resetTheme: () => set({ theme: DEFAULT_THEME, lastChangedAt: Date.now() }),
    }),
    {
      name: "crc.theme.v1",
      version: 2,
      storage,
      partialize: (state) => ({ theme: state.theme }),
      skipHydration: true,
      migrate: (persisted) => {
        const p = persisted as unknown as { theme?: Partial<ThemeSettings> };
        const incoming = (p.theme ?? {}) as Partial<ThemeSettings>;
        const next: ThemeSettings = {
          ...DEFAULT_THEME,
          ...incoming,
          textStyles: { ...(incoming.textStyles ?? {}) },
        };
        if (!next.textStyles || typeof next.textStyles !== "object") next.textStyles = {};
        return { theme: next };
      },
    }
  )
);

type EditorStore = {
  adminEnabled: boolean;
  selectedPage: PageId;
  selectedSectionId: string | null;
  selectedTextPath: string | null;
  setAdminEnabled: (enabled: boolean) => void;
  selectPage: (page: PageId) => void;
  selectSection: (sectionId: string | null) => void;
  selectText: (path: string | null) => void;
};

export const useEditorStore = create<EditorStore>()((set) => ({
  adminEnabled: false,
  selectedPage: "home",
  selectedSectionId: null,
  selectedTextPath: null,
  setAdminEnabled: (enabled) => set({ adminEnabled: enabled }),
  selectPage: (page) => set({ selectedPage: page, selectedSectionId: null, selectedTextPath: null }),
  selectSection: (sectionId) => set({ selectedSectionId: sectionId }),
  selectText: (path) => set({ selectedTextPath: path }),
}));

type ContentStore = {
  content: SiteContent;
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

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      content: DEFAULT_CONTENT,
      lastChangedAt: 0,

      get: (path) => getByPath(get().content, path),
      set: (path, value) =>
        set((state) => ({
          content: setByPath(state.content as unknown as Record<string, unknown>, path, value) as unknown as SiteContent,
          lastChangedAt: Date.now(),
        })),
      reset: () => set({ content: DEFAULT_CONTENT, lastChangedAt: Date.now() }),

      getHomeSections: () => get().content.pages.home.sections,
      setHomeSections: (sections) =>
        set((state) => ({
          content: {
            ...state.content,
            pages: {
              ...state.content.pages,
              home: { ...state.content.pages.home, sections },
            },
          },
          lastChangedAt: Date.now(),
        })),
      toggleHomeSection: (sectionId) =>
        set((state) => ({
          content: {
            ...state.content,
            pages: {
              ...state.content.pages,
              home: {
                ...state.content.pages.home,
                sections: state.content.pages.home.sections.map((s) =>
                  s.id === sectionId ? { ...s, visible: !s.visible } : s
                ),
              },
            },
          },
          lastChangedAt: Date.now(),
        })),
      deleteHomeSection: (sectionId) =>
        set((state) => ({
          content: {
            ...state.content,
            pages: {
              ...state.content.pages,
              home: {
                ...state.content.pages.home,
                sections: state.content.pages.home.sections.filter((s) => s.id !== sectionId),
              },
            },
          },
          lastChangedAt: Date.now(),
        })),
      duplicateHomeSection: (sectionId) =>
        set((state) => {
          const sections = state.content.pages.home.sections;
          const idx = sections.findIndex((s) => s.id === sectionId);
          if (idx < 0) return { lastChangedAt: Date.now() };
          const original = sections[idx]!;
          const copy: Section = { ...original, id: newId("sec"), visible: true, data: structuredClone(original.data) };
          const next = [...sections.slice(0, idx + 1), copy, ...sections.slice(idx + 1)];
          return {
            content: {
              ...state.content,
              pages: { ...state.content.pages, home: { ...state.content.pages.home, sections: next } },
            },
            lastChangedAt: Date.now(),
          };
        }),
      addHomeSection: (type) =>
        set((state) => ({
          content: {
            ...state.content,
            pages: {
              ...state.content.pages,
              home: {
                ...state.content.pages.home,
                sections: [...state.content.pages.home.sections, { id: newId("sec"), type, visible: true, data: {} }],
              },
            },
          },
          lastChangedAt: Date.now(),
        })),

      addTestimonial: () =>
        set((state) => ({
          content: {
            ...state.content,
            testimonials: [
              ...state.content.testimonials,
              { id: newId("t"), name: "Nuevo", category: "General", text: "Escribe aquí…" },
            ],
          },
          lastChangedAt: Date.now(),
        })),
      updateTestimonial: (id, partial) =>
        set((state) => ({
          content: {
            ...state.content,
            testimonials: state.content.testimonials.map((t) => (t.id === id ? { ...t, ...partial } : t)),
          },
          lastChangedAt: Date.now(),
        })),
      deleteTestimonial: (id) =>
        set((state) => ({
          content: { ...state.content, testimonials: state.content.testimonials.filter((t) => t.id !== id) },
          lastChangedAt: Date.now(),
        })),
    }),
    {
      name: "crc.content.v1",
      version: 2,
      storage,
      partialize: (state) => ({ content: state.content }),
      skipHydration: true,
      migrate: (persisted) => {
        const p = persisted as unknown as { content?: Partial<SiteContent> };
        const incoming = (p.content ?? {}) as Partial<SiteContent>;

        const merged: SiteContent = {
          ...DEFAULT_CONTENT,
          ...incoming,
          pages: {
            ...DEFAULT_CONTENT.pages,
            ...(incoming.pages ?? {}),
            home: {
              ...DEFAULT_CONTENT.pages.home,
              ...(incoming.pages?.home ?? {}),
              sections: [],
            },
          },
          hero: { ...DEFAULT_CONTENT.hero, ...(incoming.hero ?? {}) },
          homeServices: { ...DEFAULT_CONTENT.homeServices, ...(incoming.homeServices ?? {}) },
          homeLatest: { ...DEFAULT_CONTENT.homeLatest, ...(incoming.homeLatest ?? {}) },
          homePublications: { ...DEFAULT_CONTENT.homePublications, ...(incoming.homePublications ?? {}) },
          homeInterviews: { ...DEFAULT_CONTENT.homeInterviews, ...(incoming.homeInterviews ?? {}) },
          homeTestimonials: { ...DEFAULT_CONTENT.homeTestimonials, ...(incoming.homeTestimonials ?? {}) },
          footer: { ...DEFAULT_CONTENT.footer, ...(incoming.footer ?? {}) },
          testimonials: Array.isArray(incoming.testimonials) ? incoming.testimonials : DEFAULT_CONTENT.testimonials,
        };

        const incomingSections = Array.isArray(incoming.pages?.home?.sections)
          ? (incoming.pages?.home?.sections as Section[])
          : DEFAULT_CONTENT.pages.home.sections;

        const types = new Set(incomingSections.map((s) => s.type));
        const ensured = [...incomingSections];
        for (const s of DEFAULT_CONTENT.pages.home.sections) {
          if (!types.has(s.type)) ensured.push(s);
        }
        const hero = ensured.find((s) => s.type === "hero");
        const rest = ensured.filter((s) => s.type !== "hero");
        merged.pages.home.sections = hero ? [hero, ...rest] : ensured;

        return { content: merged };
      },
    }
  )
);
