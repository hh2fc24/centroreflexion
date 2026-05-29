"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, FileText, Lock, CheckCircle2, Clock, Users, Star, ArrowRight } from "lucide-react";

interface Leccion {
  id: string;
  titulo: string;
  tipo: string;
  video_duracion_seg: number | null;
  es_preview: boolean;
  orden: number;
}

interface Modulo {
  id: string;
  titulo: string;
  orden: number;
  lecciones: Leccion[];
}

interface Props {
  curso: {
    id: string;
    titulo: string;
    descripcion: string | null;
    descripcion_corta: string | null;
    imagen_url: string | null;
    precio: number;
    moneda: string;
    nivel: string | null;
    duracion_horas: number | null;
    categoria: string | null;
  };
  profesor: {
    nombre: string | null;
    apellido: string | null;
    bio: string | null;
    avatar_url: string | null;
  } | null;
  modulos: Modulo[];
  inscrito: boolean;
  userId: string | null;
  slug: string;
}

function dur(seg: number | null) {
  if (!seg) return "";
  const m = Math.floor(seg / 60);
  return `${m}min`;
}

export function CursoPageClient({ curso, profesor, modulos, inscrito, userId, slug }: Props) {
  const [openModulo, setOpenModulo] = useState<string | null>(modulos[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState<"descripcion" | "temario" | "instructor">("descripcion");

  const totalLecciones = modulos.reduce((a, m) => a + m.lecciones.length, 0);
  const profNombre = [profesor?.nombre, profesor?.apellido].filter(Boolean).join(" ");
  const profInitials = [profesor?.nombre, profesor?.apellido]
    .filter(Boolean).map((n) => n![0].toUpperCase()).join("").slice(0, 2) || "PR";

  const TABS = ["descripcion", "temario", "instructor"] as const;
  const TAB_LABELS = { descripcion: "Descripción", temario: "Temario", instructor: "Instructor" };

  return (
    <div>
      {/* ── Hero del curso ── */}
      <div
        className="relative min-h-[55vh] overflow-hidden"
        style={{ background: "var(--ac-surface)" }}
      >
        {/* Imagen de fondo con blur */}
        {curso.imagen_url && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={curso.imagen_url} alt="" className="h-full w-full object-cover" style={{ filter: "blur(2px) brightness(0.25)" }} />
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(9,9,15,0.85) 0%, rgba(9,9,15,0.6) 100%)" }}
        />
        {/* Orb dorado */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-96 w-96"
          style={{ background: "radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)", transform: "translate(30%,-30%)" }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:grid lg:grid-cols-[1fr_380px] lg:items-center lg:gap-12">
          <div>
            {/* Badges */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {curso.categoria && (
                <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ac-badge">
                  {curso.categoria}
                </span>
              )}
              {curso.nivel && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                  style={{ background: "rgba(212,168,67,0.15)", color: "var(--ac-gold)", border: "1px solid rgba(212,168,67,0.3)" }}
                >
                  {curso.nivel}
                </span>
              )}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-cormorant, Georgia, serif)",
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                fontWeight: 700,
                color: "var(--ac-text)",
                lineHeight: 1.1,
              }}
            >
              {curso.titulo}
            </motion.h1>

            {curso.descripcion_corta && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="mt-4 max-w-xl text-sm leading-relaxed"
                style={{ color: "var(--ac-text-2)" }}
              >
                {curso.descripcion_corta}
              </motion.p>
            )}

            {/* Meta info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 flex flex-wrap items-center gap-5 text-sm"
              style={{ color: "var(--ac-text-2)" }}
            >
              {profNombre && (
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: "var(--ac-gold-dim)", color: "var(--ac-gold)", border: "1px solid rgba(212,168,67,0.3)" }}
                  >
                    {profInitials}
                  </div>
                  {profNombre}
                </div>
              )}
              {curso.duracion_horas && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" style={{ color: "var(--ac-gold)" }} />
                  {curso.duracion_horas}h de contenido
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" style={{ color: "var(--ac-gold)" }} />
                {totalLecciones} lecciones
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-current" style={{ color: "var(--ac-gold)" }} />
                Nuevo
              </span>
            </motion.div>
          </div>

          {/* Sidebar sticky (en desktop dentro del hero) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="mt-10 lg:mt-0"
          >
            <div
              className="overflow-hidden"
              style={{
                background: "var(--ac-card)",
                border: "1px solid var(--ac-border-gold)",
                boxShadow: "0 0 40px rgba(212,168,67,0.1)",
                borderRadius: "8px",
              }}
            >
              {/* Preview thumbnail */}
              <div className="relative h-44 bg-[var(--ac-surface-2)]">
                {curso.imagen_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={curso.imagen_url} alt={curso.titulo} className="h-full w-full object-cover opacity-80" />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.2), rgba(107,92,231,0.2))" }}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(9,9,15,0.4)" }}>
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full ac-pulse-ring transition-transform hover:scale-110"
                    style={{ background: "var(--ac-gold-dim)", border: "2px solid var(--ac-gold)" }}
                  >
                    <Play className="ml-0.5 h-5 w-5" style={{ color: "var(--ac-gold-light)" }} />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p
                  className="mb-4 font-bold"
                  style={{
                    fontFamily: "var(--font-cormorant, Georgia, serif)",
                    fontSize: "2rem",
                    color: "var(--ac-text)",
                  }}
                >
                  {curso.precio === 0
                    ? "Gratuito"
                    : `${curso.moneda} ${Number(curso.precio).toLocaleString("es-CL")}`}
                </p>

                {inscrito ? (
                  <a
                    href={`/academia/mis-cursos`}
                    className="flex w-full items-center justify-center gap-2 py-3 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-gold"
                    style={{ borderRadius: "5px" }}
                  >
                    Ir a mis cursos <ArrowRight className="h-4 w-4" />
                  </a>
                ) : userId ? (
                  <form action="/api/academia/inscribir" method="POST">
                    <input type="hidden" name="curso_id" value={curso.id} />
                    <button
                      type="submit"
                      className="w-full py-3 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-gold ac-glow-gold"
                      style={{ borderRadius: "5px" }}
                    >
                      {curso.precio === 0 ? "Inscribirse gratis" : "Inscribirse ahora"}
                    </button>
                  </form>
                ) : (
                  <a
                    href={`/academia/login?redirect=/academia/cursos/${slug}`}
                    className="flex w-full items-center justify-center gap-2 py-3 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-gold"
                    style={{ borderRadius: "5px" }}
                  >
                    Iniciar sesión para inscribirse
                  </a>
                )}

                <ul className="mt-5 flex flex-col gap-2 text-xs" style={{ color: "var(--ac-text-3)" }}>
                  {[
                    "Material descargable incluido",
                    "Certificado al completar",
                    "Clases en video HD",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--ac-gold)" }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Tabs de contenido ── */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Tab bar */}
        <div
          className="mt-8 flex gap-1 overflow-x-auto p-1"
          style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)", borderRadius: "6px" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative flex-1 min-w-max px-5 py-2.5 text-[0.7rem] font-semibold whitespace-nowrap transition-colors"
              style={{ borderRadius: "4px", color: activeTab === tab ? "var(--ac-text)" : "var(--ac-text-3)" }}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="ac-course-tab"
                  className="absolute inset-0"
                  style={{ background: "var(--ac-surface-2)", borderRadius: "4px" }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <span className="relative">{TAB_LABELS[tab]}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="py-8"
          >
            {/* Descripción */}
            {activeTab === "descripcion" && (
              <div className="max-w-2xl">
                <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: "var(--ac-text-2)" }}>
                  {curso.descripcion ?? "Este curso no tiene descripción detallada aún."}
                </p>
              </div>
            )}

            {/* Temario / Acordeón */}
            {activeTab === "temario" && (
              <div className="flex flex-col gap-3">
                {modulos.length === 0 ? (
                  <p style={{ color: "var(--ac-text-3)" }}>El temario está siendo preparado.</p>
                ) : (
                  modulos.map((mod, mi) => (
                    <div
                      key={mod.id}
                      className="overflow-hidden"
                      style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)", borderRadius: "8px" }}
                    >
                      {/* Header del módulo */}
                      <button
                        onClick={() => setOpenModulo(openModulo === mod.id ? null : mod.id)}
                        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[var(--ac-surface-2)]"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                            style={{ background: "var(--ac-gold-dim)", color: "var(--ac-gold)", border: "1px solid rgba(212,168,67,0.3)" }}
                          >
                            {mi + 1}
                          </span>
                          <span className="font-semibold" style={{ color: "var(--ac-text)" }}>
                            {mod.titulo}
                          </span>
                          <span className="text-xs" style={{ color: "var(--ac-text-3)" }}>
                            {mod.lecciones.length} lecciones
                          </span>
                        </div>
                        <motion.div
                          animate={{ rotate: openModulo === mod.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 shrink-0" style={{ color: "var(--ac-text-3)" }} />
                        </motion.div>
                      </button>

                      {/* Lecciones */}
                      <AnimatePresence>
                        {openModulo === mod.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div
                              style={{ borderTop: "1px solid var(--ac-border)" }}
                            >
                              {mod.lecciones.sort((a, b) => a.orden - b.orden).map((lec) => (
                                <div
                                  key={lec.id}
                                  className="flex items-center gap-4 px-6 py-3.5 transition-colors"
                                  style={{ borderBottom: "1px solid var(--ac-border)" }}
                                >
                                  {/* Icono tipo lección */}
                                  <div
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                                    style={{ background: lec.es_preview ? "rgba(212,168,67,0.1)" : "var(--ac-surface-2)" }}
                                  >
                                    {lec.tipo === "video"
                                      ? <Play className="h-3 w-3" style={{ color: lec.es_preview ? "var(--ac-gold)" : "var(--ac-text-3)" }} />
                                      : <FileText className="h-3 w-3" style={{ color: "var(--ac-text-3)" }} />
                                    }
                                  </div>

                                  {/* Título */}
                                  <span className="flex-1 text-sm" style={{ color: "var(--ac-text-2)" }}>
                                    {lec.titulo}
                                  </span>

                                  {/* Preview / lock */}
                                  <div className="flex items-center gap-3 shrink-0 text-xs" style={{ color: "var(--ac-text-3)" }}>
                                    {dur(lec.video_duracion_seg) && <span>{dur(lec.video_duracion_seg)}</span>}
                                    {lec.es_preview ? (
                                      <span
                                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                        style={{ background: "rgba(212,168,67,0.12)", color: "var(--ac-gold)" }}
                                      >
                                        Preview
                                      </span>
                                    ) : !inscrito ? (
                                      <Lock className="h-3.5 w-3.5" />
                                    ) : (
                                      <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--ac-gold)" }} />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Instructor */}
            {activeTab === "instructor" && profesor && (
              <div
                className="flex max-w-2xl items-start gap-6 p-6"
                style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)", borderRadius: "8px" }}
              >
                {/* Avatar */}
                {profesor.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profesor.avatar_url}
                    alt={profNombre}
                    className="h-20 w-20 shrink-0 object-cover"
                    style={{ borderRadius: "8px" }}
                  />
                ) : (
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center text-2xl font-bold"
                    style={{
                      background: "var(--ac-gold-dim)",
                      color: "var(--ac-gold-light)",
                      border: "1px solid rgba(212,168,67,0.3)",
                      borderRadius: "8px",
                      fontFamily: "var(--font-cormorant, serif)",
                    }}
                  >
                    {profInitials}
                  </div>
                )}
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-cormorant, Georgia, serif)",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--ac-text)",
                    }}
                  >
                    {profNombre}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-widest" style={{ color: "var(--ac-gold)" }}>
                    Profesor
                  </p>
                  {profesor.bio && (
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ac-text-2)" }}>
                      {profesor.bio}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Spacer inferior */}
      <div className="h-20" />
    </div>
  );
}
