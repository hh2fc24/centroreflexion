import type { Metadata } from "next";
import { DEFAULT_SITE_URL } from "@/lib/site";

export const SITE_NAME = "Centro de Reflexiones Críticas";
export const SITE_SHORT_NAME = "CRC";
export const DEFAULT_OG_IMAGE = "/opengraph-image";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  ogTitle?: string;
  ogDescription?: string;
};

/**
 * Metadata uniforme para las páginas públicas. Cada URL publica su propio
 * canonical y una imagen social válida, evitando que Google o redes sociales
 * infieran la URL de la home para páginas de servicios o contenido editorial.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  ogTitle,
  ogDescription,
}: PageMetadataOptions): Metadata {
  const canonical = path || "/";
  const socialTitle = ogTitle ?? title;
  const socialDescription = ogDescription ?? description;

  return {
    title,
    description,
    keywords,
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "es_CL",
      url: canonical,
      siteName: SITE_NAME,
      title: socialTitle,
      description: socialDescription,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export function absoluteSiteUrl(path = "/") {
  return new URL(path, DEFAULT_SITE_URL).toString();
}
