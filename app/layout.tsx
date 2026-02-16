import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VirtualAssistant } from "@/components/VirtualAssistant";

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

export const metadata: Metadata = {
  title: "Centro de Reflexiones Críticas",
  description: "Columnas de opinión, crítica literaria y cultural, y artículos sobre ciencias sociales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased flex flex-col min-h-screen font-sans`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <VirtualAssistant />
      </body>
    </html>
  );
}

