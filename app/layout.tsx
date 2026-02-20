import type { Metadata } from "next";
import { Geist, Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VirtualAssistant } from "@/components/VirtualAssistant";
import Script from "next/script";
import { EditorProviders } from "@/components/editor/EditorProviders";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${merriweather.variable} ${geist.variable} antialiased flex flex-col min-h-screen font-sans`}
      >
        <EditorProviders>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <VirtualAssistant />
        </EditorProviders>

        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

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
                "telephone": "+56912345678", // Placeholder
                "contactType": "customer service"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
