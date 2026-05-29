"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock } from "lucide-react";

export interface CursoCard {
  id: string;
  slug: string;
  titulo: string;
  descripcion_corta: string | null;
  imagen_url: string | null;
  precio: number;
  moneda: string;
  nivel: string | null;
  duracion_horas: number | null;
  categoria: string | null;
  profesor?: { nombre: string | null; apellido: string | null } | null;
}

const NIVEL_LABEL: Record<string, string> = {
  basico:     "Básico",
  intermedio: "Intermedio",
  avanzado:   "Avanzado",
};

function CursoItem({ curso, index }: { curso: CursoCard; index: number }) {
  const profNombre = [curso.profesor?.nombre, curso.profesor?.apellido]
    .filter(Boolean).join(" ");

  const profInitials = [curso.profesor?.nombre, curso.profesor?.apellido]
    .filter(Boolean).map((n) => n![0].toUpperCase()).join("").slice(0, 2) || "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.07 }}
    >
      <Link href={`/academia/cursos/${curso.slug}`} className="group block h-full">
        <article
          className="flex h-full flex-col overflow-hidden transition-all duration-300"
          style={{
            background: "var(--ac-surface)",
            border: "1px solid var(--ac-border)",
            borderRadius: "6px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,67,0.45)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 50px rgba(0,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--ac-border)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
          }}
        >
          {/* Imagen */}
          <div className="relative aspect-[16/9] overflow-hidden" style={{ background: "var(--ac-card)" }}>
            {curso.imagen_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={curso.imagen_url}
                alt={curso.titulo}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              // Placeholder con patrón editorial
              <div className="relative h-full w-full overflow-hidden" style={{ background: "var(--ac-card)" }}>
                <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
                  <filter id={`card-grain-${index}`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                  </filter>
                  <rect width="100%" height="100%" filter={`url(#card-grain-${index})`} />
                </svg>
                {/* Número de posición como elemento visual */}
                <span
                  className="absolute bottom-4 right-4 select-none leading-none tabular-nums"
                  style={{
                    fontFamily: "var(--font-cormorant, Georgia, serif)",
                    fontSize: "5rem",
                    fontWeight: 700,
                    color: "rgba(212,168,67,0.08)",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            )}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(20,20,30,0.75) 0%, transparent 55%)" }}
            />

            {/* Categoria bottom-left */}
            {curso.categoria && (
              <span
                className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "rgba(240,236,228,0.55)" }}
              >
                {curso.categoria}
              </span>
            )}

            {/* Nivel top-right — solo texto, sin badge pill */}
            {curso.nivel && (
              <span
                className="absolute right-3 top-3 text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "var(--ac-gold)" }}
              >
                {NIVEL_LABEL[curso.nivel] ?? curso.nivel}
              </span>
            )}
          </div>

          {/* Contenido */}
          <div className="flex flex-1 flex-col p-5">
            <h3
              className="font-semibold leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-[var(--ac-gold)]"
              style={{
                fontFamily: "var(--font-cormorant, Georgia, serif)",
                fontSize: "1.15rem",
                fontWeight: 600,
                color: "var(--ac-text)",
                letterSpacing: "-0.01em",
              }}
            >
              {curso.titulo}
            </h3>

            {curso.descripcion_corta && (
              <p
                className="mt-2 line-clamp-2 text-sm leading-relaxed"
                style={{ color: "var(--ac-text-3)" }}
              >
                {curso.descripcion_corta}
              </p>
            )}

            {/* Footer */}
            <div
              className="mt-auto flex items-center justify-between pt-4"
              style={{ borderTop: "1px solid var(--ac-border)", marginTop: "1rem" }}
            >
              {/* Instructor */}
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center text-[9px] font-bold"
                  style={{
                    background: "var(--ac-gold-dim)",
                    color: "var(--ac-gold)",
                    border: "1px solid rgba(212,168,67,0.25)",
                    borderRadius: "2px",
                  }}
                >
                  {profInitials}
                </span>
                {profNombre && (
                  <span className="truncate text-xs" style={{ color: "var(--ac-text-3)" }}>
                    {profNombre}
                  </span>
                )}
              </div>

              {/* Precio + duración */}
              <div className="flex shrink-0 items-center gap-3 text-xs" style={{ color: "var(--ac-text-3)" }}>
                {curso.duracion_horas && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {curso.duracion_horas}h
                  </span>
                )}
                <span
                  className="font-bold"
                  style={{ color: curso.precio === 0 ? "#4ade80" : "var(--ac-gold-light)", fontSize: "0.85rem" }}
                >
                  {curso.precio === 0
                    ? "Gratis"
                    : `${curso.moneda} ${Number(curso.precio).toLocaleString("es-CL")}`}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export function CatalogoCursos({ cursos }: { cursos: CursoCard[] }) {
  if (!cursos.length) {
    return (
      <div className="py-20 text-center" style={{ color: "var(--ac-text-3)" }}>
        <p className="text-lg">Próximamente nuevos cursos.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cursos.map((c, i) => (
        <CursoItem key={c.id} curso={c} index={i} />
      ))}
    </div>
  );
}
