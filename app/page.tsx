import type { Metadata } from "next";
import { HomeCanvas } from "@/components/site/HomeCanvas";
import { readPublishedDiskState } from "@/lib/server/publishedDisk";
import { normalizePagesForStore } from "@/lib/editor/pagesStore";
import type { SitePage } from "@/lib/editor/types";
import { pageMetadata } from "@/lib/seo";

const DEFAULT_TITLE = "Centro de Reflexiones Críticas | Salud Mental, Infancia y Consultoría Institucional";
const DEFAULT_DESCRIPTION =
  "Centro de Reflexiones Críticas (CRC): atención clínica en salud mental e infancia, consultoría institucional, formación y compliance escolar en Chile. Columnas de opinión y crítica social.";

async function findHomePage() {
  const { state } = await readPublishedDiskState();
  const pages = Array.isArray(state.pages)
    ? normalizePagesForStore(state.pages as SitePage[])
    : [];
  return pages.find((p) => p.id === "home" || p.slug === "") ?? null;
}

export async function generateMetadata(): Promise<Metadata> {
  const home = await findHomePage();
  const title = home?.seo?.title || DEFAULT_TITLE;
  const description = home?.seo?.description || DEFAULT_DESCRIPTION;
  const robots = home?.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true };
  const ogTitle = home?.seo?.ogTitle || title;
  const ogDescription = home?.seo?.ogDescription || description;
  const canonical = home?.seo?.canonical || "/";

  return pageMetadata({
    title,
    description,
    path: canonical,
    noIndex: !robots.index,
    ogTitle,
    ogDescription,
  });
}

export default async function Home() {
  const home = await findHomePage();
  return <HomeCanvas initialPage={home} />;
}
