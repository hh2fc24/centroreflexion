import type { NextConfig } from "next";

// ─────────────────────────────────────────────
// Links cortos con UTM (bio de Instagram, perfiles de LinkedIn)
// ─────────────────────────────────────────────
// Cada link corto redirige con 307 (temporal) a su destino con los UTM ya
// puestos. Temporal a propósito: el navegador no lo cachea para siempre, así
// que se puede cambiar el destino (p. ej. a la cohorte 2) sin cambiar el link
// publicado. Para agregar uno, suma una fila acá; `content` identifica la
// cuenta o persona que lo publica.
type ShortLink = {
  path: string;
  destination: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
};

const SEMINARIO_C1 = "/seminarios/desproteccion-infancia";

const SHORT_LINKS: ShortLink[] = [
  { path: "/ig/crc", destination: SEMINARIO_C1, source: "instagram", medium: "bio", campaign: "seminario-c1", content: "crc" },
  { path: "/ig/jc", destination: SEMINARIO_C1, source: "instagram", medium: "bio", campaign: "seminario-c1", content: "jc" },
  { path: "/ig/rocio", destination: SEMINARIO_C1, source: "instagram", medium: "bio", campaign: "seminario-c1", content: "rocio" },
  { path: "/in/hugo", destination: "/instituciones", source: "linkedin", medium: "perfil", campaign: "instituciones", content: "hugo" },
  { path: "/in/jc", destination: SEMINARIO_C1, source: "linkedin", medium: "perfil", campaign: "seminario-c1", content: "jc" },
];

function shortLinkDestination(link: ShortLink) {
  const params = new URLSearchParams({
    utm_source: link.source,
    utm_medium: link.medium,
    utm_campaign: link.campaign,
    utm_content: link.content,
  });
  return `${link.destination}?${params.toString()}`;
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["192.168.4.164"],
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      // Supabase Storage – imágenes de cursos y avatares de la Academia CRC
      // El hostname real es: <project-id>.supabase.co
      // Se usa un wildcard para cubrir cualquier proyecto durante el desarrollo.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Se evalúan antes que middleware.ts, así que los redireccionamientos del CMS
  // no los pisan.
  async redirects() {
    return SHORT_LINKS.map((link) => ({
      source: link.path,
      destination: shortLinkDestination(link),
      permanent: false,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
