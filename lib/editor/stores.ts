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
import { getPersistStorage } from "@/lib/editor/persistStorage";
import { getByPath, setByPath } from "@/lib/editor/path";
import { useUndoStore } from "@/lib/editor/undoStore";

const storage = createJSONStorage(() => getPersistStorage());

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
        set((state) => {
          const nextTheme = { ...state.theme, ...partial };
          const history = useUndoStore.getState();
          if (!history.isApplying) {
            const beforePatch: Record<string, unknown> = {};
            const afterPatch: Record<string, unknown> = {};
            const prevThemeRec = state.theme as unknown as Record<string, unknown>;
            const nextThemeRec = nextTheme as unknown as Record<string, unknown>;
            for (const k of Object.keys(partial ?? {})) {
              beforePatch[k] = structuredClone(prevThemeRec[k]);
              afterPatch[k] = structuredClone(nextThemeRec[k]);
            }
            history.record(
              {
                label: "Editar diseño",
                undo: () => {
                  useThemeStore.setState((s) => ({
                    theme: { ...s.theme, ...(beforePatch as Partial<ThemeSettings>) },
                    lastChangedAt: Date.now(),
                  }));
                },
                redo: () => {
                  useThemeStore.setState((s) => ({
                    theme: { ...s.theme, ...(afterPatch as Partial<ThemeSettings>) },
                    lastChangedAt: Date.now(),
                  }));
                },
              },
              { mergeKey: "theme", mergeMs: 1000 }
            );
          }
          return { theme: nextTheme, lastChangedAt: Date.now() };
        }),
      setTextStyle: (path, partial) =>
        set((state) => {
          const prevStyle = state.theme.textStyles[path] ?? {};
          const nextStyle = { ...prevStyle, ...partial };
          const history = useUndoStore.getState();
          if (!history.isApplying) {
            const before = structuredClone(prevStyle);
            const after = structuredClone(nextStyle);
            history.record(
              {
                label: "Editar tipografía",
                undo: () => {
                  useThemeStore.setState((s) => ({
                    theme: { ...s.theme, textStyles: { ...s.theme.textStyles, [path]: structuredClone(before) } },
                    lastChangedAt: Date.now(),
                  }));
                },
                redo: () => {
                  useThemeStore.setState((s) => ({
                    theme: { ...s.theme, textStyles: { ...s.theme.textStyles, [path]: structuredClone(after) } },
                    lastChangedAt: Date.now(),
                  }));
                },
              },
              { mergeKey: `textStyle:${path}`, mergeMs: 1000 }
            );
          }
          return {
            theme: {
              ...state.theme,
              textStyles: {
                ...state.theme.textStyles,
                [path]: nextStyle,
              },
            },
            lastChangedAt: Date.now(),
          };
        }),
      resetTextStyle: (path) =>
        set((state) => {
          const prevStyle = state.theme.textStyles[path] ?? null;
          const history = useUndoStore.getState();
          if (!history.isApplying) {
            history.record({
              label: "Reset estilo",
              undo: () => {
                if (!prevStyle) return;
                useThemeStore.setState((s) => ({
                  theme: { ...s.theme, textStyles: { ...s.theme.textStyles, [path]: structuredClone(prevStyle) } },
                  lastChangedAt: Date.now(),
                }));
              },
              redo: () => {
                useThemeStore.setState((s) => {
                  const next = { ...s.theme.textStyles };
                  delete next[path];
                  return { theme: { ...s.theme, textStyles: next }, lastChangedAt: Date.now() };
                });
              },
            });
          }
          const next = { ...state.theme.textStyles };
          delete next[path];
          return { theme: { ...state.theme, textStyles: next }, lastChangedAt: Date.now() };
        }),
      resetTheme: () =>
        set((state) => {
          const history = useUndoStore.getState();
          if (!history.isApplying) {
            const before = structuredClone(state.theme);
            const after = structuredClone(DEFAULT_THEME);
            history.record({
              label: "Reset diseño",
              undo: () => useThemeStore.setState({ theme: structuredClone(before), lastChangedAt: Date.now() }),
              redo: () => useThemeStore.setState({ theme: structuredClone(after), lastChangedAt: Date.now() }),
            });
          }
          return { theme: DEFAULT_THEME, lastChangedAt: Date.now() };
        }),
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
          spacingScale: { ...DEFAULT_THEME.spacingScale, ...(incoming.spacingScale ?? {}) },
          radiusScale: { ...DEFAULT_THEME.radiusScale, ...(incoming.radiusScale ?? {}) },
          shadowScale: { ...DEFAULT_THEME.shadowScale, ...(incoming.shadowScale ?? {}) },
          textStyles: { ...(incoming.textStyles ?? {}) },
        };
        if (!next.textStyles || typeof next.textStyles !== "object") next.textStyles = {};
        if (!next.accent) next.accent = DEFAULT_THEME.accent;
        if (!next.designPreset) next.designPreset = "custom";
        return { theme: next };
      },
    }
  )
);

type EditorStore = {
  adminEnabled: boolean;
  selectedPage: PageId;
  selectedSectionId: string | null; // legacy
  selectedBlockId: string | null;
  selectedBlockPageId: string | null;
  selectedTextPath: string | null;
  device: "desktop" | "tablet" | "mobile";
  setAdminEnabled: (enabled: boolean) => void;
  selectPage: (page: PageId) => void;
  selectSection: (sectionId: string | null) => void; // legacy
  selectBlock: (pageId: string | null, blockId: string | null) => void;
  selectText: (path: string | null) => void;
  setDevice: (device: "desktop" | "tablet" | "mobile") => void;
};

export const useEditorStore = create<EditorStore>()((set) => ({
  adminEnabled: false,
  selectedPage: "home",
  selectedSectionId: null,
  selectedBlockId: null,
  selectedBlockPageId: null,
  selectedTextPath: null,
  device: "desktop",
  setAdminEnabled: (enabled) => set({ adminEnabled: enabled }),
  selectPage: (page) => set({ selectedPage: page, selectedSectionId: null, selectedBlockId: null, selectedBlockPageId: null, selectedTextPath: null }),
  selectSection: (sectionId) => set({ selectedSectionId: sectionId }),
  selectBlock: (pageId, blockId) => set({ selectedBlockPageId: pageId, selectedBlockId: blockId }),
  selectText: (path) => set({ selectedTextPath: path }),
  setDevice: (device) => set({ device }),
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
        set((state) => {
          const history = useUndoStore.getState();
          if (!history.isApplying) {
            const before = getByPath(state.content as unknown as Record<string, unknown>, path);
            const after = value;
            history.record(
              {
                label: "Editar contenido",
                undo: () => {
                  useContentStore.setState((s) => ({
                    content: setByPath(s.content as unknown as Record<string, unknown>, path, before) as unknown as SiteContent,
                    lastChangedAt: Date.now(),
                  }));
                },
                redo: () => {
                  useContentStore.setState((s) => ({
                    content: setByPath(s.content as unknown as Record<string, unknown>, path, after) as unknown as SiteContent,
                    lastChangedAt: Date.now(),
                  }));
                },
              },
              { mergeKey: `content:${path}`, mergeMs: 1100 }
            );
          }
          return {
            content: setByPath(state.content as unknown as Record<string, unknown>, path, value) as unknown as SiteContent,
            lastChangedAt: Date.now(),
          };
        }),
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
          homeFounders: { ...DEFAULT_CONTENT.homeFounders, ...(incoming.homeFounders ?? {}) },
          footer: { ...DEFAULT_CONTENT.footer, ...(incoming.footer ?? {}) },
          testimonials: Array.isArray(incoming.testimonials) ? incoming.testimonials : DEFAULT_CONTENT.testimonials,
          navigation: {
            ...DEFAULT_CONTENT.navigation,
            ...(incoming.navigation ?? {}),
            items: Array.isArray(incoming.navigation?.items) ? incoming.navigation!.items : DEFAULT_CONTENT.navigation.items,
          },
          integrations: { ...DEFAULT_CONTENT.integrations, ...(incoming.integrations ?? {}) },
          redirects: Array.isArray(incoming.redirects) ? incoming.redirects : DEFAULT_CONTENT.redirects,
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
