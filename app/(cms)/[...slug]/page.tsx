import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { SitePage } from "@/lib/editor/types";
import { PageCanvas } from "@/components/site/PageCanvas";
import { readPublishedDiskState } from "@/lib/server/publishedDisk";

type CmsPageParams = { slug: string[] };

export const dynamic = "force-dynamic";

async function findPublishedPage(slug: string) {
  const { state } = await readPublishedDiskState();
  const pages = (state.pages ?? []) as SitePage[];
  return pages.find((p) => (p.kind ?? "page") === "page" && p.slug === slug) ?? null;
}

export default async function CmsPage({ params }: { params: Promise<CmsPageParams> }) {
  const { slug: slugParam = [] } = await params;
  const slug = slugParam.join("/");
  const page = await findPublishedPage(slug);

  if (!page || page.visible === false) return notFound();
  return <PageCanvas pageId={page.id} />;
}

export async function generateMetadata({ params }: { params: Promise<CmsPageParams> }): Promise<Metadata> {
  const { slug: slugParam = [] } = await params;
  const slug = slugParam.join("/");
  const page = await findPublishedPage(slug);

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
