import { ImageResponse } from "next/og";

export const alt = "Centro de Reflexiones Críticas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#171713",
          color: "#fffdf8",
          padding: "74px 82px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 540,
            height: 540,
            borderRadius: "50%",
            background: "#bd6f3c",
            opacity: 0.22,
            right: -110,
            top: -170,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            border: "2px solid rgba(211,151,109,0.45)",
            left: -120,
            bottom: -160,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "sans-serif" }}>
            <div
              style={{
                display: "flex",
                width: 62,
                height: 62,
                borderRadius: "50%",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8f5ee",
                color: "#171713",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              CRC
            </div>
            <span style={{ color: "#d8d0c4", fontSize: 24, letterSpacing: 5, textTransform: "uppercase" }}>
              Chile
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 950 }}>
            <span style={{ color: "#d3976d", fontFamily: "sans-serif", fontSize: 23, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>
              Pensamiento · evidencia · diálogo
            </span>
            <span style={{ marginTop: 18, fontSize: 78, fontWeight: 700, lineHeight: 1.02 }}>
              Centro de Reflexiones Críticas
            </span>
            <span style={{ marginTop: 26, color: "#d8d0c4", fontFamily: "sans-serif", fontSize: 29, lineHeight: 1.3 }}>
              Clínica, consultoría, formación y pensamiento crítico.
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
