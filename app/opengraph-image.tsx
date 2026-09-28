import { ImageResponse } from "next/og";

export const alt = "Centro de Reflexiones Críticas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "Centro de Reflexiones Críticas";
const SUBTITLE = "Formación, consultoría y clínica en infancia, salud mental e instituciones.";
const LABEL = "Chile · CRC";
const DOMAIN = "centrodereflexionescriticas.com";

/**
 * Descarga de Google Fonts solo los glifos necesarios (Source Serif 4 para el
 * título, IBM Plex Sans para el resto). Si no hay red o falla, la imagen se
 * genera igual con la fuente por defecto.
 */
async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl)).text();
    const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!match) return null;
    const res = await fetch(match[1]);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const [serif, sans] = await Promise.all([
    loadGoogleFont("Source+Serif+4", 600, TITLE),
    loadGoogleFont("IBM+Plex+Sans", 500, LABEL + SUBTITLE + DOMAIN),
  ]);
  const fonts = [
    ...(serif ? [{ name: "Source Serif 4", data: serif, weight: 600 as const, style: "normal" as const }] : []),
    ...(sans ? [{ name: "IBM Plex Sans", data: sans, weight: 500 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#15120e",
          color: "#fbf7ee",
          padding: "72px 80px",
          fontFamily: sans ? "IBM Plex Sans" : "sans-serif",
        }}
      >
        <span style={{ color: "#e4935d", fontSize: 26, fontWeight: 500 }}>{LABEL}</span>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
          <span
            style={{
              fontFamily: serif ? "Source Serif 4" : "serif",
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: -0.7,
            }}
          >
            {TITLE}
          </span>
          <span style={{ marginTop: 28, color: "#ede7dc", fontSize: 30, lineHeight: 1.4 }}>{SUBTITLE}</span>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.18)", paddingTop: 22, color: "#a99f91", fontSize: 24 }}>
          {DOMAIN}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}
