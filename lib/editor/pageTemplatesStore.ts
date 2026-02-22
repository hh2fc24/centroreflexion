import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getPersistStorage } from "@/lib/editor/persistStorage";
import type { SitePage } from "@/lib/editor/types";

const storage = createJSONStorage(() => getPersistStorage());

export type PageTemplate = {
  id: string;
  name: string;
  page: Omit<SitePage, "id" | "slug" | "updatedAt"> & { slug?: string };
  createdAt: number;
};

type PageTemplatesState = {
  templates: PageTemplate[];
  addPageTemplate: (name: string, page: SitePage) => string;
  deletePageTemplate: (id: string) => void;
  renamePageTemplate: (id: string, name: string) => void;
  reset: () => void;
};

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export const usePageTemplatesStore = create<PageTemplatesState>()(
  persist(
    (set) => ({
      templates: [],
      addPageTemplate: (name, page) => {
        const id = newId("ptpl");
        const tpl: PageTemplate = {
          id,
          name: name.trim() || "Plantilla de página",
          page: {
            ...structuredClone(page),
            id: "template",
            slug: page.slug,
            updatedAt: 0,
          } as unknown as PageTemplate["page"],
          createdAt: Date.now(),
        };
        set((s) => ({ templates: [...s.templates, tpl] }));
        return id;
      },
      deletePageTemplate: (id) => set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),
      renamePageTemplate: (id, name) =>
        set((s) => ({ templates: s.templates.map((t) => (t.id === id ? { ...t, name: name.trim() || t.name } : t)) })),
      reset: () => set({ templates: [] }),
    }),
    {
      name: "crc.page-templates.v1",
      version: 1,
      storage,
      partialize: (s) => ({ templates: s.templates }),
      skipHydration: true,
    }
  )
);
