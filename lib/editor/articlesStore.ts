import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { memoryStorage } from "@/lib/editor/storage";
import type { Article } from "@/lib/data";
import seed from "@/lib/articles.json";

const storage = createJSONStorage(() => (typeof window !== "undefined" ? localStorage : memoryStorage));

export type ArticleKind = "columns" | "reviews";

type ArticlesState = {
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

type SeedJson = { columns: Article[]; reviews: Article[] };
const seedArticles = seed as unknown as SeedJson;

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export const useArticlesStore = create<ArticlesState>()(
  persist(
    (set) => ({
      columns: seedArticles.columns,
      reviews: seedArticles.reviews,
      lastChangedAt: 0,

      add: (kind) => {
        const id = newId("draft");
        const blank: Article = {
          id,
          title: "Nueva publicación",
          excerpt: "Resumen breve…",
          author: "Centro de Reflexiones Críticas",
          date: "01 Jan 2026",
          category: kind === "columns" ? "Sociedad" : "Reseña",
          image: "/images/hero_critical.png",
          content: ["Escribe aquí…"],
        };
        set((state) => ({
          ...state,
          ...(kind === "columns"
            ? { columns: [...state.columns, blank] }
            : { reviews: [...state.reviews, blank] }),
          lastChangedAt: Date.now(),
        }));
        return id;
      },

      rename: (kind, id, nextId) =>
        set((state) => {
          const cleaned = slugify(nextId);
          if (!cleaned) return { ...state, lastChangedAt: Date.now() };
          const taken =
            kind === "columns"
              ? state.columns.some((a) => a.id === cleaned)
              : state.reviews.some((a) => a.id === cleaned);
          if (taken) return { ...state, lastChangedAt: Date.now() };

          const renameIn = (list: Article[]) => list.map((a) => (a.id === id ? { ...a, id: cleaned } : a));
          return {
            ...state,
            ...(kind === "columns" ? { columns: renameIn(state.columns) } : { reviews: renameIn(state.reviews) }),
            lastChangedAt: Date.now(),
          };
        }),

      update: (kind, id, partial) =>
        set((state) => ({
          ...state,
          ...(kind === "columns"
            ? { columns: state.columns.map((a) => (a.id === id ? { ...a, ...partial } : a)) }
            : { reviews: state.reviews.map((a) => (a.id === id ? { ...a, ...partial } : a)) }),
          lastChangedAt: Date.now(),
        })),

      replace: (kind, next) =>
        set((state) => ({
          ...state,
          ...(kind === "columns" ? { columns: next } : { reviews: next }),
          lastChangedAt: Date.now(),
        })),

      remove: (kind, id) =>
        set((state) => ({
          ...state,
          ...(kind === "columns"
            ? { columns: state.columns.filter((a) => a.id !== id) }
            : { reviews: state.reviews.filter((a) => a.id !== id) }),
          lastChangedAt: Date.now(),
        })),

      reset: () =>
        set({
          columns: seedArticles.columns,
          reviews: seedArticles.reviews,
          lastChangedAt: Date.now(),
        }),
    }),
    {
      name: "crc.articles.v1",
      version: 1,
      storage,
      skipHydration: true,
      partialize: (s) => ({ columns: s.columns, reviews: s.reviews }),
    }
  )
);
