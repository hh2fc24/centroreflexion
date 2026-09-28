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
              color: "#d3976d",
              fontFamily: "sans-serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Seminario en vivo · Cohorte 1
          </span>
          <span style={{ marginTop: 22, fontSize: 76, fontWeight: 700, lineHeight: 1.02 }}>
            Desprotección de la infancia
          </span>
          <div style={{ display: "flex", marginTop: 28, width: 70, height: 2, background: "#bd6f3c" }} />
          <span
            style={{ marginTop: 28, color: "#d8d0c4", fontFamily: "sans-serif", fontSize: 28, lineHeight: 1.35 }}
          >
            Ocho jueves con Juan Carlos Rauld, autor del libro. Desde el 15 de octubre, 19:00 a 21:00.
          </span>
          <span
            style={{
              marginTop: 30,
              color: "#a9a294",
              fontFamily: "sans-serif",
              fontSize: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
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
