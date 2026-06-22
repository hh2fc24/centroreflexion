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

  out.push({ url: `${baseUrl}/`, lastModified: new Date() });

  for (const route of staticRoutes) {
    out.push({ url: `${baseUrl}${route}`, lastModified: new Date() });
  }

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
          lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
        });
      }
    }
  } catch {
    // Supabase no disponible en build/preview: se omiten cursos del sitemap.
  }

  return out;
}
