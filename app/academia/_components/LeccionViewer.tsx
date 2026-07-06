"use client";

/**
 * Academia CRC – Aula / visor de lección
 * Modos de lectura: Diapositivas (imágenes), PDF embebido y Texto accesible.
 */
import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, ChevronDown, Download, LayoutGrid, FileText,
  AlignLeft, Lock, CheckCircle2, Circle, ArrowLeft, ArrowRight, Maximize2, X, List,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type LecMini = { id: string; titulo: string; tipo: string; es_preview: boolean; orden: number };
type ModTree = { id: string; titulo: string; orden: number; lecciones: LecMini[] };
type Deck = { kind: string; base: string; slides: number; pdf: string; cover: string; text: string[] };

interface Props {
  cursoSlug: string;
  cursoTitulo: string;
  cursoId: string;
  leccion: {
    id: string; titulo: string; descripcion: string | null;
    tipo: string; contenido: string | null; recurso_url: string | null; es_preview: boolean;
  };
  modulos: ModTree[];
  inscrito: boolean;
  userId: string | null;
  completadasInit: string[];
  prevId: string | null;
  nextId: string | null;
}

type Modo = "slides" | "pdf" | "texto";

export function LeccionViewer({
  cursoSlug, cursoTitulo, cursoId, leccion, modulos, inscrito, userId, completadasInit, prevId, nextId,
}: Props) {
  const router = useRouter();
  const deck = useMemo<Deck | null>(() => {
    if (!leccion.contenido) return null;
    try { return JSON.parse(leccion.contenido) as Deck; } catch { return null; }
  }, [leccion.contenido]);

  const [modo, setModo] = useState<Modo>("slides");
  const [page, setPage] = useState(1);
  const [sidebar, setSidebar] = useState(true);
  const [zoom, setZoom] = useState(false);
  const [completadas, setCompletadas] = useState<string[]>(completadasInit);
  const [openMod, setOpenMod] = useState<string | null>(
    modulos.find((m) => m.lecciones.some((l) => l.id === leccion.id))?.id ?? modulos[0]?.id ?? null
  );

  const total = deck?.slides ?? 0;
  const slideUrl = (n: number) => `${deck!.base}/slide-${String(n).padStart(3, "0")}.webp`;
  const esCompletada = completadas.includes(leccion.id);

  const go = useCallback((d: number) => {
    setPage((p) => Math.min(Math.max(1, p + d), total || 1));
  }, [total]);

  // Teclado en modo slides
  useEffect(() => {
    if (modo !== "slides") return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "Escape") setZoom(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [modo, go]);

  // Registro de aprendizaje: apertura (vista) + tiempo dedicado real.
  // Cuenta solo el tiempo con la pestaña visible y lo envía por "heartbeat".
  useEffect(() => {
    if (!userId || !inscrito) return;
    const sb = createClient();
    if (!sb) return;

    const registrar = (deltaSeg: number, nuevaVista: boolean, pct: number | null) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sb as any).rpc("registrar_progreso", {
        p_leccion: leccion.id,
        p_curso: cursoId,
        p_delta_seg: Math.round(deltaSeg),
        p_pct: pct,
        p_nueva_vista: nuevaVista,
      }).then(() => {}, () => {});

    let acumulado = 0;
    let ultimoTick = Date.now();
    registrar(0, true, 10); // apertura de la lección

    const tick = setInterval(() => {
      const ahora = Date.now();
      if (document.visibilityState === "visible") {
        acumulado += (ahora - ultimoTick) / 1000;
        if (acumulado >= 15) { registrar(acumulado, false, null); acumulado = 0; }
      }
      ultimoTick = ahora;
    }, 5000);

    const flush = () => { if (acumulado >= 1) { registrar(acumulado, false, null); acumulado = 0; } };
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("beforeunload", flush);

    return () => {
      clearInterval(tick);
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, [userId, inscrito, leccion.id, cursoId]);

  async function toggleCompletada() {
    if (!userId || !inscrito) return;
    const nuevo = !esCompletada;
    setCompletadas((c) => (nuevo ? [...c, leccion.id] : c.filter((x) => x !== leccion.id)));
    const sb = createClient();
    if (!sb) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sb as any).from("progreso_lecciones").upsert(
      { alumno_id: userId, leccion_id: leccion.id, curso_id: cursoId, completada: nuevo, porcentaje_visto: nuevo ? 100 : 50 },
      { onConflict: "alumno_id,leccion_id" }
    );
  }

  const MODOS: { id: Modo; label: string; icon: typeof LayoutGrid }[] = [
    { id: "slides", label: "Diapositivas", icon: LayoutGrid },
    { id: "pdf", label: "PDF", icon: FileText },
    { id: "texto", label: "Texto", icon: AlignLeft },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ background: "var(--ac-bg)" }}>
      <div className="mx-auto flex max-w-[1600px]">
        {/* ── Sidebar: temario ── */}
        <AnimatePresence initial={false}>
          {sidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="hidden shrink-0 overflow-hidden lg:block"
              style={{ borderRight: "1px solid var(--ac-border)" }}
            >
              <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto p-5" style={{ width: 320 }}>
                <Link
                  href={`/academia/cursos/${cursoSlug}`}
                  className="mb-5 inline-flex items-center gap-2 text-xs font-semibold"
                  style={{ color: "var(--ac-text-3)" }}
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Volver al curso
                </Link>
                <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>
                  Temario
                </p>
                <h2 className="mb-5 text-sm font-semibold leading-snug" style={{ color: "var(--ac-text-2)" }}>
                  {cursoTitulo}
                </h2>

                {modulos.map((m, mi) => (
                  <div key={m.id} className="mb-2">
                    <button
                      onClick={() => setOpenMod(openMod === m.id ? null : m.id)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-bold"
                          style={{ background: "var(--ac-gold-dim)", color: "var(--ac-gold)" }}
                        >
                          {mi + 1}
                        </span>
                        <span className="text-xs font-semibold leading-tight" style={{ color: "var(--ac-text-2)" }}>
                          {m.titulo}
                        </span>
                      </span>
                      <ChevronDown
                        className="h-4 w-4 shrink-0 transition-transform"
                        style={{ color: "var(--ac-text-3)", transform: openMod === m.id ? "rotate(180deg)" : "none" }}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {openMod === m.id && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden pl-2"
                        >
                          {m.lecciones.map((l) => {
                            const activa = l.id === leccion.id;
                            const hecha = completadas.includes(l.id);
                            const bloqueada = !l.es_preview && !inscrito;
                            const Inner = (
                              <span
                                className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs leading-snug transition-colors"
                                style={{
                                  background: activa ? "var(--ac-gold-dim)" : "transparent",
                                  color: activa ? "var(--ac-gold-light)" : "var(--ac-text-2)",
                                  border: activa ? "1px solid rgba(212,168,67,0.25)" : "1px solid transparent",
                                }}
                              >
                                <span className="mt-0.5 shrink-0">
                                  {bloqueada
                                    ? <Lock className="h-3.5 w-3.5" style={{ color: "var(--ac-text-3)" }} />
                                    : hecha
                                      ? <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "var(--ac-gold)" }} />
                                      : <Circle className="h-3.5 w-3.5" style={{ color: "var(--ac-text-3)" }} />}
                                </span>
                                <span>{l.titulo}</span>
                              </span>
                            );
                            return bloqueada ? (
                              <li key={l.id} className="opacity-60">{Inner}</li>
                            ) : (
                              <li key={l.id}>
                                <Link href={`/academia/cursos/${cursoSlug}/leccion/${l.id}`} className="block hover:opacity-90">
                                  {Inner}
                                </Link>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Contenido principal ── */}
        <main className="min-w-0 flex-1">
          {/* Barra superior */}
          <div
            className="sticky top-16 z-20 flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6"
            style={{ background: "rgba(9,9,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--ac-border)" }}
          >
            <button
              onClick={() => setSidebar((s) => !s)}
              className="hidden h-9 w-9 items-center justify-center rounded-lg lg:flex"
              style={{ border: "1px solid var(--ac-border-md)", color: "var(--ac-text-2)" }}
              aria-label="Temario"
            >
              <List className="h-4 w-4" />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold" style={{ color: "var(--ac-text)" }}>{leccion.titulo}</p>
              <p className="text-[0.7rem]" style={{ color: "var(--ac-text-3)" }}>
                {leccion.es_preview && !inscrito ? "Vista previa gratuita" : `${total} diapositivas`}
              </p>
            </div>

            {/* Selector de modo */}
            <div className="flex gap-1 rounded-lg p-1" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)" }}>
              {MODOS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setModo(id)}
                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.7rem] font-semibold transition-colors"
                  style={{
                    background: modo === id ? "var(--ac-surface-2)" : "transparent",
                    color: modo === id ? "var(--ac-gold-light)" : "var(--ac-text-3)",
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {leccion.recurso_url && (
              <a
                href={leccion.recurso_url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.7rem] font-bold ac-btn-ghost"
              >
                <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Descargar PDF</span>
              </a>
            )}
          </div>

          {/* Cuerpo según modo */}
          <div className="px-4 py-6 sm:px-8">
            {!deck ? (
              <p className="py-20 text-center" style={{ color: "var(--ac-text-3)" }}>
                Esta lección aún no tiene contenido disponible.
              </p>
            ) : modo === "slides" ? (
              <SlidesMode
                url={slideUrl} page={page} total={total} go={go} setPage={setPage}
                onZoom={() => setZoom(true)} titulo={leccion.titulo}
              />
            ) : modo === "pdf" ? (
              <div
                className="mx-auto max-w-5xl overflow-hidden rounded-xl"
                style={{ border: "1px solid var(--ac-border-md)", height: "80vh", background: "var(--ac-surface)" }}
              >
                <iframe src={`${deck.base}/${deck.pdf}#view=FitH`} title={leccion.titulo} className="h-full w-full" />
              </div>
            ) : (
              <TextoMode text={deck.text} titulo={leccion.titulo} descripcion={leccion.descripcion} />
            )}
          </div>

          {/* Pie: progreso + prev/next */}
          <div
            className="mx-4 mb-12 mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl px-5 py-4 sm:mx-8"
            style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)" }}
          >
            {inscrito ? (
              <button
                onClick={toggleCompletada}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-[0.7rem] font-bold transition-colors"
                style={{
                  background: esCompletada ? "var(--ac-gold-dim)" : "transparent",
                  color: esCompletada ? "var(--ac-gold-light)" : "var(--ac-text-2)",
                  border: "1px solid var(--ac-border-md)",
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                {esCompletada ? "Completada" : "Marcar como completada"}
              </button>
            ) : (
              <Link
                href={`/academia/cursos/${cursoSlug}`}
                className="text-xs font-semibold"
                style={{ color: "var(--ac-gold)" }}
              >
                Inscríbete para acceder a todas las clases →
              </Link>
            )}

            <div className="flex items-center gap-2">
              {prevId && (
                <button
                  onClick={() => router.push(`/academia/cursos/${cursoSlug}/leccion/${prevId}`)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.7rem] font-bold ac-btn-ghost"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Anterior
                </button>
              )}
              {nextId && (
                <button
                  onClick={() => router.push(`/academia/cursos/${cursoSlug}/leccion/${nextId}`)}
                  className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[0.7rem] font-bold ac-btn-gold"
                >
                  Siguiente <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Zoom de diapositiva */}
      <AnimatePresence>
        {zoom && deck && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(5,5,9,0.95)" }}
            onClick={() => setZoom(false)}
          >
            <button className="absolute right-5 top-5 h-10 w-10 rounded-full" style={{ background: "var(--ac-surface)", color: "var(--ac-text)" }}>
              <X className="mx-auto h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slideUrl(page)} alt="" className="max-h-full max-w-full rounded-lg" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Modo diapositivas ── */
function SlidesMode({
  url, page, total, go, setPage, onZoom, titulo,
}: {
  url: (n: number) => string; page: number; total: number;
  go: (d: number) => void; setPage: (n: number) => void; onZoom: () => void; titulo: string;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <div
        className="group relative overflow-hidden rounded-xl"
        style={{ border: "1px solid var(--ac-border-md)", background: "var(--ac-surface)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={page} src={url(page)} alt={`${titulo} — diapositiva ${page}`} className="w-full" loading="eager" />

        <button
          onClick={() => go(-1)}
          disabled={page <= 1}
          className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-0"
          style={{ background: "rgba(9,9,15,0.7)", color: "var(--ac-text)", backdropFilter: "blur(4px)" }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => go(1)}
          disabled={page >= total}
          className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-0"
          style={{ background: "rgba(9,9,15,0.7)", color: "var(--ac-text)", backdropFilter: "blur(4px)" }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={onZoom}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
          style={{ background: "rgba(9,9,15,0.7)", color: "var(--ac-text)", backdropFilter: "blur(4px)" }}
          aria-label="Ampliar"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Controles */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button onClick={() => go(-1)} disabled={page <= 1} className="rounded-lg px-3 py-2 ac-btn-ghost disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm tabular-nums" style={{ color: "var(--ac-text-2)" }}>
          <span style={{ color: "var(--ac-gold)" }}>{page}</span> / {total}
        </span>
        <button onClick={() => go(1)} disabled={page >= total} className="rounded-lg px-3 py-2 ac-btn-ghost disabled:opacity-40">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Barra de progreso de slides */}
      <div className="mx-auto mt-3 h-1 max-w-xs overflow-hidden rounded-full" style={{ background: "var(--ac-surface-2)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${(page / total) * 100}%`, background: "linear-gradient(90deg, var(--ac-gold), var(--ac-gold-light))" }} />
      </div>

      {/* Miniaturas */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-3">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className="shrink-0 overflow-hidden rounded-md transition-all"
            style={{
              width: 96, height: 56,
              border: n === page ? "2px solid var(--ac-gold)" : "1px solid var(--ac-border)",
              opacity: n === page ? 1 : 0.55,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url(n)} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Modo texto accesible ── */
function TextoMode({ text, titulo, descripcion }: { text: string[]; titulo: string; descripcion: string | null }) {
  return (
    <article className="mx-auto max-w-2xl py-4">
      <h1
        style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 700, color: "var(--ac-text)", lineHeight: 1.15 }}
      >
        {titulo}
      </h1>
      {descripcion && <p className="mt-3 text-sm" style={{ color: "var(--ac-text-3)" }}>{descripcion}</p>}
      <p className="mt-2 text-[0.7rem] uppercase tracking-widest" style={{ color: "var(--ac-gold)" }}>
        Lectura accesible · transcripción de diapositivas
      </p>
      <div className="mt-8 flex flex-col gap-8">
        {text.map((t, i) => (
          <section key={i}>
            <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-text-3)" }}>
              Diapositiva {i + 1}
            </p>
            <p className="whitespace-pre-wrap text-[0.95rem] leading-relaxed" style={{ color: "var(--ac-text-2)" }}>
              {t || "—"}
            </p>
            <div className="mt-6 h-px" style={{ background: "var(--ac-border)" }} />
          </section>
        ))}
      </div>
    </article>
  );
}
