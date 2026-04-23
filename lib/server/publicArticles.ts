import { parseDisplayDate } from "@/lib/articles/date";
import type { Article } from "@/lib/data";
import { readPublishedDiskState } from "@/lib/server/publishedDisk";

type PublishedArticlesRecord = {
  columns?: unknown;
  reviews?: unknown;
};

function toArticles(input: unknown): Article[] {
  return Array.isArray(input) ? (input as Article[]) : [];
}

function sortNewestFirst(items: Article[]): Article[] {
  return [...items].sort((a, b) => {
    const tb = parseDisplayDate(b.date);
    const ta = parseDisplayDate(a.date);
    if (Number.isFinite(tb) && Number.isFinite(ta)) return tb - ta;
    return b.date.localeCompare(a.date);
  });
}

export async function readPublishedArticleCollections(): Promise<{ columns: Article[]; reviews: Article[] }> {
  const { state } = await readPublishedDiskState();
  const rec = (state.articles ?? {}) as PublishedArticlesRecord;

  return {
    columns: sortNewestFirst(toArticles(rec.columns)),
    reviews: sortNewestFirst(toArticles(rec.reviews)),
  };
}

export async function findPublishedArticle(kind: "columns" | "reviews", id: string): Promise<Article | null> {
  const collections = await readPublishedArticleCollections();
  const list = kind === "columns" ? collections.columns : collections.reviews;
  return list.find((item) => item.id === id) ?? null;
}
