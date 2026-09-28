import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Imagen para compartir la landing del seminario (WhatsApp, LinkedIn, X).
// Va aparte de la del sitio porque la portada del libro sola mide 500×500 y
// las redes la recortaban al formato 1200×630.
export const alt = "Seminario Desprotección de la Infancia, con Juan Carlos Rauld. Cohorte 1, desde el 15 de octubre de 2026.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const portada = await readFile(join(process.cwd(), "public/images/book_desproteccion.png"), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#15120e",
          color: "#fbf7ee",
          padding: "64px 56px 64px 82px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 660 }}>
          <span
            style={{
              color: "#e4935d",
              fontFamily: "sans-serif",
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            Seminario en vivo · Cohorte 1
          </span>
          <span style={{ marginTop: 22, fontSize: 72, fontWeight: 600, lineHeight: 1.08, letterSpacing: -0.7 }}>
            Desprotección de la infancia
          </span>
          <span
            style={{ marginTop: 30, color: "#ede7dc", fontFamily: "sans-serif", fontSize: 28, lineHeight: 1.4 }}
          >
            Ocho jueves con Juan Carlos Rauld, autor del libro. Desde el 15 de octubre, 19:00 a 21:00.
          </span>
          <span
            style={{
              marginTop: 34,
              color: "#ede7dc",
              opacity: 0.7,
              fontFamily: "sans-serif",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Centro de Reflexiones Críticas
          </span>
        </div>
        <img src={`data:image/png;base64,${portada}`} width={440} height={440} alt="" />
      </div>
    ),
    size
  );
}
