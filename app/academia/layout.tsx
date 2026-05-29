/**
 * Academia CRC – Layout dark & premium
 * Envuelve todas las rutas /academia con el tema oscuro.
 */
import type { ReactNode } from "react";
import { AcademiaNav } from "./_components/AcademiaNav";

export default function AcademiaLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-academia=""
      className="min-h-screen"
      style={{ background: "var(--ac-bg, #09090f)", color: "var(--ac-text, #f0ece4)" }}
    >
      <AcademiaNav />
      {children}
    </div>
  );
}
