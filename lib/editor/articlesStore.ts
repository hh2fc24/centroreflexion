import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getPersistStorage } from "@/lib/editor/persistStorage";
import type { Article } from "@/lib/data";
import seed from "@/lib/articles.json";
import { useUndoStore } from "@/lib/editor/undoStore";

const storage = createJSONStorage(() => getPersistStorage());

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
        set((state) => {
          const insertAt = kind === "columns" ? state.columns.length : state.reviews.length;
          const history = useUndoStore.getState();
          if (!history.isApplying) {
            const snapshot = structuredClone(blank);
            history.record({
              label: "Agregar artículo",
              undo: () => {
                useArticlesStore.setState((s) => ({
                  ...s,
                  ...(kind === "columns"
                    ? { columns: s.columns.filter((a) => a.id !== id) }
                    : { reviews: s.reviews.filter((a) => a.id !== id) }),
                  lastChangedAt: Date.now(),
                }));
              },
              redo: () => {
                useArticlesStore.setState((s) => {
                  const list = kind === "columns" ? s.columns : s.reviews;
                  if (list.some((a) => a.id === id)) return { ...s, lastChangedAt: Date.now() };
                  const next = [...list];
                  next.splice(Math.min(insertAt, next.length), 0, structuredClone(snapshot));
                  return {
                    ...s,
                    ...(kind === "columns" ? { columns: next } : { reviews: next }),
                    lastChangedAt: Date.now(),
                  };
                });
              },
            });
          }
          return {
            ...state,
            ...(kind === "columns" ? { columns: [...state.columns, blank] } : { reviews: [...state.reviews, blank] }),
            lastChangedAt: Date.now(),
          };
        });
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

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            history.record({
              label: "Renombrar artículo",
              undo: () => {
                useArticlesStore.setState((s) => {
                  const renameIn = (list: Article[]) => list.map((a) => (a.id === cleaned ? { ...a, id } : a));
                  return {
                    ...s,
                    ...(kind === "columns" ? { columns: renameIn(s.columns) } : { reviews: renameIn(s.reviews) }),
                    lastChangedAt: Date.now(),
                  };
                });
              },
              redo: () => {
                useArticlesStore.setState((s) => {
                  const renameIn = (list: Article[]) => list.map((a) => (a.id === id ? { ...a, id: cleaned } : a));
                  return {
                    ...s,
                    ...(kind === "columns" ? { columns: renameIn(s.columns) } : { reviews: renameIn(s.reviews) }),
                    lastChangedAt: Date.now(),
                  };
                });
              },
            });
          }

          const renameIn = (list: Article[]) => list.map((a) => (a.id === id ? { ...a, id: cleaned } : a));
          return {
            ...state,
            ...(kind === "columns" ? { columns: renameIn(state.columns) } : { reviews: renameIn(state.reviews) }),
            lastChangedAt: Date.now(),
          };
        }),

      update: (kind, id, partial) =>
        set((state) => {
          const list = kind === "columns" ? state.columns : state.reviews;
          const prev = list.find((a) => a.id === id) ?? null;
          if (!prev) return { ...state, lastChangedAt: Date.now() };
          const next = { ...prev, ...partial } as Article;
          const history = useUndoStore.getState();
          if (!history.isApplying) {
            type UpdatableKey = Exclude<keyof Article, "id">;
            const keys = Object.keys(partial ?? {}) as UpdatableKey[];
            const beforePatch: Partial<Record<UpdatableKey, Article[UpdatableKey]>> = {};
            const afterPatch: Partial<Record<UpdatableKey, Article[UpdatableKey]>> = {};
            for (const k of keys) {
              beforePatch[k] = structuredClone(prev[k]);
              afterPatch[k] = structuredClone(next[k]);
            }
            history.record(
              {
                label: "Editar artículo",
                undo: () => {
                  useArticlesStore.setState((s) => {
                    const apply = (items: Article[]) =>
                      items.map((a) => (a.id === id ? { ...a, ...(beforePatch as Partial<Article>) } : a));
                    return {
                      ...s,
                      ...(kind === "columns" ? { columns: apply(s.columns) } : { reviews: apply(s.reviews) }),
                      lastChangedAt: Date.now(),
                    };
                  });
                },
                redo: () => {
                  useArticlesStore.setState((s) => {
                    const apply = (items: Article[]) =>
                      items.map((a) => (a.id === id ? { ...a, ...(afterPatch as Partial<Article>) } : a));
                    return {
                      ...s,
                      ...(kind === "columns" ? { columns: apply(s.columns) } : { reviews: apply(s.reviews) }),
                      lastChangedAt: Date.now(),
                    };
                  });
                },
              },
              { mergeKey: `article:${kind}:${id}`, mergeMs: 1000 }
            );
          }
          const apply = (items: Article[]) => items.map((a) => (a.id === id ? next : a));
          return {
            ...state,
            ...(kind === "columns" ? { columns: apply(state.columns) } : { reviews: apply(state.reviews) }),
            lastChangedAt: Date.now(),
          };
        }),

      replace: (kind, next) =>
        set((state) => {
          const before = kind === "columns" ? structuredClone(state.columns) : structuredClone(state.reviews);
          const after = structuredClone(next);
          const history = useUndoStore.getState();
          if (!history.isApplying) {
            history.record({
              label: "Reordenar artículos",
              undo: () => {
                useArticlesStore.setState((s) => ({
                  ...s,
                  ...(kind === "columns" ? { columns: structuredClone(before) } : { reviews: structuredClone(before) }),
                  lastChangedAt: Date.now(),
                }));
              },
              redo: () => {
                useArticlesStore.setState((s) => ({
                  ...s,
                  ...(kind === "columns" ? { columns: structuredClone(after) } : { reviews: structuredClone(after) }),
                  lastChangedAt: Date.now(),
                }));
              },
            });
          }
          return {
            ...state,
            ...(kind === "columns" ? { columns: next } : { reviews: next }),
            lastChangedAt: Date.now(),
          };
        }),

      remove: (kind, id) =>
        set((state) => {
          const list = kind === "columns" ? state.columns : state.reviews;
          const idx = list.findIndex((a) => a.id === id);
          if (idx < 0) return { ...state, lastChangedAt: Date.now() };
          const removed = list[idx]!;
          const history = useUndoStore.getState();
          if (!history.isApplying) {
            const snapshot = structuredClone(removed);
            history.record({
              label: "Eliminar artículo",
              undo: () => {
                useArticlesStore.setState((s) => {
                  const cur = kind === "columns" ? s.columns : s.reviews;
                  if (cur.some((a) => a.id === id)) return { ...s, lastChangedAt: Date.now() };
                  const next = [...cur];
                  next.splice(Math.min(idx, next.length), 0, structuredClone(snapshot));
                  return {
                    ...s,
                    ...(kind === "columns" ? { columns: next } : { reviews: next }),
                    lastChangedAt: Date.now(),
                  };
                });
              },
              redo: () => {
                useArticlesStore.setState((s) => ({
                  ...s,
                  ...(kind === "columns" ? { columns: s.columns.filter((a) => a.id !== id) } : { reviews: s.reviews.filter((a) => a.id !== id) }),
                  lastChangedAt: Date.now(),
                }));
              },
            });
          }
          return {
            ...state,
            ...(kind === "columns" ? { columns: state.columns.filter((a) => a.id !== id) } : { reviews: state.reviews.filter((a) => a.id !== id) }),
            lastChangedAt: Date.now(),
          };
        }),

      reset: () =>
        set((state) => {
          const history = useUndoStore.getState();
          if (!history.isApplying) {
            const before = structuredClone({ columns: state.columns, reviews: state.reviews });
            const after = structuredClone({ columns: seedArticles.columns, reviews: seedArticles.reviews });
            history.record({
              label: "Reset artículos",
              undo: () =>
                useArticlesStore.setState({
                  columns: structuredClone(before.columns),
                  reviews: structuredClone(before.reviews),
                  lastChangedAt: Date.now(),
                }),
              redo: () =>
                useArticlesStore.setState({
                  columns: structuredClone(after.columns),
                  reviews: structuredClone(after.reviews),
                  lastChangedAt: Date.now(),
                }),
            });
          }
          return {
            columns: seedArticles.columns,
            reviews: seedArticles.reviews,
            lastChangedAt: Date.now(),
          };
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
