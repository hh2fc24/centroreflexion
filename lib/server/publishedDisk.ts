import { readFile } from "fs/promises";
import path from "path";
import { hashJson } from "@/lib/server/hash";
import { writeJsonAtomic } from "@/lib/server/atomicWrite";

export type PublishedDiskState = {
  theme: unknown;
  content: unknown;
  pages: unknown;
  articles: unknown;
};

async function readJson(filePath: string, fallback: unknown) {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as unknown;
  } catch {
    return fallback;
  }
}

export function publishedPaths(cwd = process.cwd()) {
  const themePath = path.join(cwd, "lib", "editor", "published-theme.json");
  const contentPath = path.join(cwd, "lib", "editor", "published-content.json");
  const pagesPath = path.join(cwd, "lib", "editor", "published-pages.json");
  const articlesPath = path.join(cwd, "lib", "articles.json");
  const versionsIndexPath = path.join(cwd, "lib", "editor", "published-versions.json");
  const versionsDir = path.join(cwd, "lib", "editor", "versions");
  return { themePath, contentPath, pagesPath, articlesPath, versionsIndexPath, versionsDir };
}

export async function readPublishedDiskState(): Promise<{ state: PublishedDiskState; hash: string }> {
  const { themePath, contentPath, pagesPath, articlesPath } = publishedPaths();
  const theme = await readJson(themePath, {});
  const content = await readJson(contentPath, {});
  const pagesObj = await readJson(pagesPath, { pages: [] });
  let pages: unknown = [];
  if (pagesObj && typeof pagesObj === "object") {
    const rec = pagesObj as Record<string, unknown>;
    if (Array.isArray(rec.pages)) pages = rec.pages;
  }
  const articles = await readJson(articlesPath, {});
  const state: PublishedDiskState = { theme, content, pages, articles };
  const hash = hashJson(state);
  return { state, hash };
}

export async function writePublishedDiskState(next: PublishedDiskState) {
  const { themePath, contentPath, pagesPath, articlesPath } = publishedPaths();
  await writeJsonAtomic(themePath, next.theme ?? {});
  await writeJsonAtomic(contentPath, next.content ?? {});
  await writeJsonAtomic(pagesPath, { pages: next.pages ?? [] });
  await writeJsonAtomic(articlesPath, next.articles ?? {});
}
