import type { MetadataRoute } from "next";
import type { SitePage } from "@/lib/editor/types";
import { readPublishedArticleCollections } from "@/lib/server/publicArticles";
import { readPublishedDiskState } from "@/lib/server/publishedDisk";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const { state } = await readPublishedDiskState();
  const pages = (state.pages ?? []) as SitePage[];
  const articles = await readPublishedArticleCollections();

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
    out.push({ url: `${baseUrl}/pensamiento-critico/${a.id}`, lastModified: new Date() });
  }
  for (const a of articles.reviews ?? []) {
    out.push({ url: `${baseUrl}/critica/${a.id}`, lastModified: new Date() });
  }

  return out;
}
