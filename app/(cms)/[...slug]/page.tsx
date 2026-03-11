import { notFound } from "next/navigation";
import published from "@/lib/editor/published-pages.json";
import type { SitePage } from "@/lib/editor/types";
import { PageCanvas } from "@/components/site/PageCanvas";
import type { Metadata } from "next";

type PublishedPages = { pages: SitePage[] };

type CmsPageParams = { slug: string[] };

export default async function CmsPage({ params }: { params: Promise<CmsPageParams> }) {
  const { slug: slugParam = [] } = await params;
  const slug = slugParam.join("/");
  const pages = (published as unknown as PublishedPages).pages ?? [];
  const page = pages.find((p) => (p.kind ?? "page") === "page" && p.slug === slug && p.visible !== false) ?? null;
  if (!page) return notFound();
  return <PageCanvas pageId={page.id} />;
}

export async function generateMetadata({ params }: { params: Promise<CmsPageParams> }): Promise<Metadata> {
  const { slug: slugParam = [] } = await params;
  const slug = slugParam.join("/");
  const pages = (published as unknown as PublishedPages).pages ?? [];
  const page = pages.find((p) => (p.kind ?? "page") === "page" && p.slug === slug) ?? null;
  if (!page) return {};
  const title = page.seo?.title || page.title;
  const description = page.seo?.description || "";
  const robots = page.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true };
  const ogImage = page.seo?.ogImage || "";
  const ogTitle = page.seo?.ogTitle || title;
  const ogDescription = page.seo?.ogDescription || description;
  const canonical = page.seo?.canonical || "";
  return {
    title,
    description,
    robots,
    alternates: canonical ? { canonical } : undefined,
    openGraph: ogImage ? { title: ogTitle, description: ogDescription, images: [{ url: ogImage }] } : { title: ogTitle, description: ogDescription },
  };
}

export function generateStaticParams() {
  const pages = (published as unknown as PublishedPages).pages ?? [];
  return pages
    .filter((p) => (p.kind ?? "page") === "page" && p.slug && p.visible !== false)
    .map((p) => ({ slug: p.slug.split("/").filter(Boolean) }));
}
