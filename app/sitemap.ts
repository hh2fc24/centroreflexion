import type { MetadataRoute } from "next";
import pagesJson from "@/lib/editor/published-pages.json";
import articlesJson from "@/lib/articles.json";
import type { SitePage } from "@/lib/editor/types";
import type { Article } from "@/lib/data";

type PublishedPages = { pages: SitePage[] };
type ArticlesJson = { columns: Article[]; reviews: Article[] };

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://centroreflexionescriticas.cl";
  const pages = (pagesJson as unknown as PublishedPages).pages ?? [];
  const articles = articlesJson as unknown as ArticlesJson;

  const out: MetadataRoute.Sitemap = [];

  out.push({ url: `${baseUrl}/`, lastModified: new Date() });

  for (const p of pages) {
    if (!p.slug) continue;
    if ((p.kind ?? "page") !== "page") continue;
    if (p.visible === false) continue;
    if (p.seo?.noIndex) continue;
    out.push({ url: `${baseUrl}/${p.slug}`, lastModified: new Date(p.updatedAt || Date.now()) });
  }

  for (const a of articles.columns ?? []) {
    out.push({ url: `${baseUrl}/columnas/${a.id}`, lastModified: new Date() });
  }
  for (const a of articles.reviews ?? []) {
    out.push({ url: `${baseUrl}/critica/${a.id}`, lastModified: new Date() });
  }

  return out;
}
