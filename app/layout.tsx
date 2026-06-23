import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Geist, Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { DesproteccionEventModal } from "@/components/DesproteccionEventModal";
import { SiteAnalyticsTracker } from "@/components/analytics/SiteAnalyticsTracker";
import { EditorProviders } from "@/components/editor/EditorProviders";
import { IntegrationsScripts } from "@/components/editor/IntegrationsScripts";
import { DEFAULT_CONTENT, DEFAULT_THEME } from "@/lib/editor/defaults";
import type { SiteContent, ThemeSettings } from "@/lib/editor/types";
import { readPublishedDiskState } from "@/lib/server/publishedDisk";
import { getSiteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: "Centro de Reflexiones Críticas",
    template: "%s | Centro de Reflexiones Críticas",
  },
  description: "Columnas de opinión, crítica literaria y cultural, y artículos sobre ciencias sociales.",
  keywords: ["crítica cultural", "opinión", "literatura", "cine", "ciencias sociales", "Chile", "política"],
  authors: [{ name: "Centro de Reflexiones Críticas" }],
  creator: "Centro de Reflexiones Críticas",
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: siteUrl,
    title: "Centro de Reflexiones Críticas",
    description: "Columnas de opinión, crítica literaria y cultural, y artículos sobre ciencias sociales.",
    siteName: "CRC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Centro de Reflexiones Críticas",
    description: "Columnas de opinión, crítica literaria y cultural.",
    creator: "@crcritica", // Placeholder
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo-crc-favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

function normalizePublishedTheme(input: unknown): ThemeSettings {
  const incoming = (input ?? {}) as Partial<ThemeSettings>;
  return {
    ...DEFAULT_THEME,
    ...incoming,
    spacingScale: { ...DEFAULT_THEME.spacingScale, ...(incoming.spacingScale ?? {}) },
    radiusScale: { ...DEFAULT_THEME.radiusScale, ...(incoming.radiusScale ?? {}) },
    shadowScale: { ...DEFAULT_THEME.shadowScale, ...(incoming.shadowScale ?? {}) },
    textStyles: { ...DEFAULT_THEME.textStyles, ...(incoming.textStyles ?? {}) },
  };
}

function toThemeVars(theme: ThemeSettings): CSSProperties {
  return {
    ["--background" as string]: theme.background,
    ["--foreground" as string]: theme.foreground,
    ["--primary" as string]: theme.primary,
    ["--secondary" as string]: theme.secondary,
    ["--accent" as string]: theme.accent || theme.secondary || theme.primary,
    ["--surface" as string]: theme.surface,
    ["--muted-foreground" as string]: theme.mutedForeground,
    ["--border" as string]: theme.border,
    ["--radius-base" as string]: `${Math.max(0, theme.radius)}px`,
    ["--shadow-strength" as string]: `${Math.min(1, Math.max(0, theme.shadow))}`,
    ["--space-xs" as string]: `${Math.max(0, theme.spacingScale.xs)}px`,
    ["--space-sm" as string]: `${Math.max(0, theme.spacingScale.sm)}px`,
    ["--space-md" as string]: `${Math.max(0, theme.spacingScale.md)}px`,
    ["--space-lg" as string]: `${Math.max(0, theme.spacingScale.lg)}px`,
    ["--space-xl" as string]: `${Math.max(0, theme.spacingScale.xl)}px`,
    ["--space-2xl" as string]: `${Math.max(0, theme.spacingScale["2xl"])}px`,
    ["--radius-sm" as string]: `${Math.max(0, theme.radiusScale.sm)}px`,
    ["--radius-md" as string]: `${Math.max(0, theme.radiusScale.md)}px`,
    ["--radius-lg" as string]: `${Math.max(0, theme.radiusScale.lg)}px`,
    ["--radius-xl" as string]: `${Math.max(0, theme.radiusScale.xl)}px`,
    ["--radius-pill" as string]: `${Math.max(0, theme.radiusScale.pill)}px`,
    ["--shadow-sm" as string]: `${Math.min(1, Math.max(0, theme.shadowScale.sm))}`,
    ["--shadow-md" as string]: `${Math.min(1, Math.max(0, theme.shadowScale.md))}`,
    ["--shadow-lg" as string]: `${Math.min(1, Math.max(0, theme.shadowScale.lg))}`,
    ["--text-scale" as string]: `${Math.min(1.15, Math.max(0.9, theme.textScale))}`,
    ["--font-sans" as string]:
      theme.font === "geist"
        ? "var(--font-geist)"
        : theme.font === "merriweather"
          ? "var(--font-merriweather)"
          : "var(--font-inter)",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { state } = await readPublishedDiskState();
  const theme = normalizePublishedTheme(state.theme);
  const content = ((state.content ?? DEFAULT_CONTENT) as SiteContent) ?? DEFAULT_CONTENT;

  return (
    <html lang="es" data-mode={theme.mode}>
      <body
        className={`${inter.variable} ${merriweather.variable} ${geist.variable} ${cormorant.variable} antialiased flex flex-col min-h-screen font-sans`}
        style={toThemeVars(theme)}
      >
        <EditorProviders>
          <Navbar initialNavigation={content.navigation} />
          <main className="flex-grow" style={{ containerType: "inline-size" } as unknown as CSSProperties}>
            {children}
          </main>
          <Footer initialFooter={content.footer} />

          <IntegrationsScripts />
          <WhatsAppButton />
          <CookieConsentBanner />
          <DesproteccionEventModal />
          <Suspense fallback={null}>
            <SiteAnalyticsTracker />
          </Suspense>
        </EditorProviders>

        {/* Global JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Centro de Reflexiones Críticas",
              "alternateName": "CRC",
              "url": siteUrl,
              "logo": `${siteUrl}/logo-crc.png`,
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "centrodereflexionescriticas@gmail.com",
                "contactType": "customer service"
              },
              "sameAs": [
                "https://www.instagram.com/centrodereflexionescriticas/",
                "https://www.youtube.com/@CentrodeReflexionesCr%C3%ADticas"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Centro de Reflexiones Críticas",
              "url": siteUrl,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${siteUrl}/pensamiento-critico?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
