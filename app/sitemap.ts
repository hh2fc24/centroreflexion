import type { MetadataRoute } from "next";
import type { SitePage } from "@/lib/editor/types";
import { readPublishedArticleCollections } from "@/lib/server/publicArticles";
import { readPublishedDiskState } from "@/lib/server/publishedDisk";
import { getSiteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const { state } = await readPublishedDiskState();
  const pages = (state.pages ?? []) as SitePage[];
  const articles = await readPublishedArticleCollections();

  const out: MetadataRoute.Sitemap = [];
  const staticRoutes = [
    "/servicios",
    "/servicios/clinica",
    "/servicios/consultoria",
    "/servicios/bienestar-escolar",
    "/servicios/formacion",
    "/servicios/compliance-escolar",
    "/contacto",
    "/conocenos",
    "/publicaciones",
    "/critica",
    "/pensamiento-critico",
    "/envia-tu-texto",
    "/academia",
    "/declaracion-publica/ninez-migrante-haitiana",
  ];

  out.push({ url: `${baseUrl}/` });

  for (const route of staticRoutes) {
    out.push({ url: `${baseUrl}${route}` });
  }

  for (const p of pages) {
    if (!p.slug) continue;
    if ((p.kind ?? "page") !== "page") continue;
    if (p.visible === false) continue;
    if (p.seo?.noIndex) continue;
    const updatedAt = typeof p.updatedAt === "number" && p.updatedAt > 0 ? new Date(p.updatedAt) : undefined;
    out.push({ url: `${baseUrl}/${p.slug}`, ...(updatedAt ? { lastModified: updatedAt } : {}) });
  }

  for (const a of articles.columns ?? []) {
    const publishedAt = a.date ? new Date(a.date) : undefined;
    out.push({
      url: `${baseUrl}/pensamiento-critico/${a.id}`,
      ...(publishedAt && !Number.isNaN(publishedAt.getTime()) ? { lastModified: publishedAt } : {}),
    });
  }
  for (const a of articles.reviews ?? []) {
    const publishedAt = a.date ? new Date(a.date) : undefined;
    out.push({
      url: `${baseUrl}/critica/${a.id}`,
      ...(publishedAt && !Number.isNaN(publishedAt.getTime()) ? { lastModified: publishedAt } : {}),
    });
  }

  try {
    const supabase = await createClient();
    if (supabase) {
      const { data: cursos } = await supabase
        .from("cursos")
        .select("slug, updated_at")
        .eq("estado", "publicado") as { data: { slug: string; updated_at: string }[] | null };
      for (const c of cursos ?? []) {
        if (!c.slug) continue;
        out.push({
          url: `${baseUrl}/academia/cursos/${c.slug}`,
          ...(c.updated_at ? { lastModified: new Date(c.updated_at) } : {}),
        });
      }
    }
  } catch {
    // Supabase no disponible en build/preview: se omiten cursos del sitemap.
  }

  return out;
}
