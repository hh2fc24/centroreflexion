import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getPersistStorage } from "@/lib/editor/persistStorage";
import type { SiteBlock } from "@/lib/editor/types";

const storage = createJSONStorage(() => getPersistStorage());

export type BlockTemplate = {
  id: string;
  name: string;
  block: SiteBlock;
  createdAt: number;
};

type TemplatesState = {
  blocks: BlockTemplate[];
  addBlockTemplate: (name: string, block: SiteBlock) => string;
  deleteBlockTemplate: (id: string) => void;
  renameBlockTemplate: (id: string, name: string) => void;
  reset: () => void;
};

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export const useTemplatesStore = create<TemplatesState>()(
  persist(
    (set) => ({
      blocks: [],
      addBlockTemplate: (name, block) => {
        const id = newId("tpl");
        set((s) => ({
          blocks: [...s.blocks, { id, name: name.trim() || "Plantilla", block: structuredClone(block), createdAt: Date.now() }],
        }));
        return id;
      },
      deleteBlockTemplate: (id) => set((s) => ({ blocks: s.blocks.filter((t) => t.id !== id) })),
      renameBlockTemplate: (id, name) =>
        set((s) => ({ blocks: s.blocks.map((t) => (t.id === id ? { ...t, name: name.trim() || t.name } : t)) })),
      reset: () => set({ blocks: [] }),
    }),
    {
      name: "crc.templates.v1",
      version: 1,
      storage,
      partialize: (s) => ({ blocks: s.blocks }),
      skipHydration: true,
    }
  )
);
