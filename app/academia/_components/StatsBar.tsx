"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Stat { value: number; suffix: string; label: string; note?: string }

/**
 * Los números de esta barra vienen de la base de datos, no están escritos a mano.
 * Antes eran fijos (40+ cursos, 20+ profesores, 1200+ alumnos) y no correspondían
 * a nada real: cualquiera que contara los cursos del catálogo veía la diferencia,
 * y en el HTML servido —lo que leen los buscadores y los previsualizadores de
 * redes— aparecían como "0+" porque la animación solo corre en el navegador.
 * Una métrica que no se puede verificar resta credibilidad en vez de sumarla,
 * así que la barra ahora muestra solo lo que existe: un tramo en 0 no se muestra.
 */
export interface AcademiaStats {
  cursos: number;
  profesores: number;
  alumnos: number;
}

const LG_COLS: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

function buildStats({ cursos, profesores, alumnos }: AcademiaStats): Stat[] {
  const out: Stat[] = [];
  if (cursos > 0) out.push({ value: cursos, suffix: "", label: cursos === 1 ? "Curso" : "Cursos", note: "Publicados hoy" });
  if (profesores > 0) out.push({ value: profesores, suffix: "", label: profesores === 1 ? "Profesor" : "Profesores", note: "Activos en el CRC" });
  // Es el total de inscripciones, no de personas únicas: la etiqueta dice eso.
  if (alumnos > 0) out.push({ value: alumnos, suffix: "", label: alumnos === 1 ? "Inscripción" : "Inscripciones", note: "Registradas hasta hoy" });
  out.push({ value: 100, suffix: "%", label: "En español", note: "Todo el contenido" });
  return out;
}

function useCountUp(target: number, duration = 1600, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setVal(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

function StatItem({ stat, active, last }: { stat: Stat; active: boolean; last: boolean }) {
  const val = useCountUp(stat.value, 1600, active);
  return (
    <div
      className="flex flex-1 flex-col gap-2 px-8 py-8 lg:py-10"
      style={{ borderRight: last ? "none" : "1px solid var(--ac-border)" }}
    >
      {/* Número grande */}
      <div
        className="leading-none font-bold tabular-nums"
        style={{
          fontFamily: "var(--font-cormorant, Georgia, serif)",
          fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
          color: "var(--ac-text)",
          letterSpacing: "-0.02em",
        }}
      >
        {val.toLocaleString("es-CL")}
        <span style={{ color: "var(--ac-gold)" }}>{stat.suffix}</span>
      </div>

      {/* Label */}
      <div className="flex flex-col gap-0.5">
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--ac-text-2)" }}
        >
          {stat.label}
        </span>
        {stat.note && (
          <span
            className="text-xs"
            style={{ color: "var(--ac-text-3)" }}
          >
            {stat.note}
          </span>
        )}
      </div>
    </div>
  );
}

export function StatsBar({ stats }: { stats: AcademiaStats }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const items = buildStats(stats);

  // Con una sola métrica real la barra no aporta nada; mejor no renderizarla.
  if (items.length < 2) return null;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden"
      style={{
        background: "var(--ac-surface)",
        border: "1px solid var(--ac-border)",
      }}
    >
      {/* Línea gold top */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, var(--ac-gold) 40%, var(--ac-gold-light) 60%, transparent 100%)" }}
      />

      {/* Grain sutil */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
        <filter id="stats-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#stats-grain)" />
      </svg>

      <div
        className={`grid grid-cols-2 divide-y lg:divide-y-0 ${LG_COLS[items.length] ?? "lg:grid-cols-4"}`}
        style={{ borderColor: "var(--ac-border)" }}
      >
        {items.map((s, i) => (
          <StatItem key={s.label} stat={s} active={inView} last={i === items.length - 1} />
        ))}
      </div>

      {/* Línea gold bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.2), transparent)" }}
      />
    </motion.section>
  );
}
