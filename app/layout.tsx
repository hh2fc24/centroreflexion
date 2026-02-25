import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Geist, Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VirtualAssistant } from "@/components/VirtualAssistant";
import { EditorProviders } from "@/components/editor/EditorProviders";
import { IntegrationsScripts } from "@/components/editor/IntegrationsScripts";

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

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

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
    url: "https://centroreflexionescriticas.cl", // Placeholder, ideally from env
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
    icon: [{ url: "/log.png", type: "image/png" }],
    shortcut: ["/log.png"],
    apple: [{ url: "/log.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${merriweather.variable} ${geist.variable} antialiased flex flex-col min-h-screen font-sans`}
      >
        <EditorProviders>
          <Navbar />
          <main className="flex-grow" style={{ containerType: "inline-size" } as unknown as CSSProperties}>
            {children}
          </main>
          <Footer />
          <VirtualAssistant />
          <IntegrationsScripts />
        </EditorProviders>

        {/* Global JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Centro de Reflexiones Críticas",
              "url": "https://centroreflexionescriticas.cl",
              "logo": "https://centroreflexionescriticas.cl/logo.png", // Ensure this exists or use text
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "centrodereflexionescriticas@gmail.com",
                "contactType": "customer service"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
