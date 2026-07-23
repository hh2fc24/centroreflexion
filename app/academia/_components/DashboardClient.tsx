"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen, Clock, Trophy, Flame, ArrowRight, Play,
  Sparkles, Compass, GraduationCap,
} from "lucide-react";

interface DashboardProps {
  user: {
    nombre: string | null;
    email: string;
    rol: string;
    avatar_initials: string;
    avatar_url?: string | null;
  };
  cursosActivos: {
    id: string;
    slug: string;
    titulo: string;
    imagen_url: string | null;
    progreso: number; // 0-100
    lecciones_completadas: number;
    total_lecciones: number;
  }[];
  stats: {
    cursos_inscritos: number;
    cursos_completados: number;
    horas_estudiadas: number;
    racha_dias: number;
  };
}

const ease = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────── */

function useGreeting() {
  // Se calcula tras el montaje para evitar mismatch de hidratación.
  const [saludo, setSaludo] = useState("Hola");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const h = new Date().getHours();
      setSaludo(h < 6 ? "Buenas noches" : h < 13 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return saludo;
}

/* Ring de progreso SVG */
function ProgressRing({ pct, size = 108 }: { pct: number; size?: number }) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="url(#gold-grad)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
      />
      <defs>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9963a" />
          <stop offset="100%" stopColor="#f0c355" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* Píldora de estadística — compacta, números tabulares y legibles */
function StatPill({ icon: Icon, label, value, color, delay = 0 }: {
  icon: typeof BookOpen; label: string; value: string | number; color: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay }}
      className="flex items-center gap-3.5 p-4"
      style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)", borderRadius: "12px" }}
    >
      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center"
        style={{ background: color + "1f", borderRadius: "9px" }}>
        <Icon className="h-[18px] w-[18px]" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[1.35rem] font-bold leading-none tabular-nums" style={{ color: "var(--ac-text)" }}>{value}</p>
        <p className="mt-1 text-[0.68rem] uppercase tracking-[0.12em]" style={{ color: "var(--ac-text-3)" }}>{label}</p>
      </div>
    </motion.div>
  );
}

/* Visualización de racha — 7 puntos, no un número solitario */
function WeekStreak({ dias }: { dias: number }) {
  const labels = ["L", "M", "M", "J", "V", "S", "D"];
  const active = Math.min(dias, 7);
  return (
    <div className="flex items-center gap-1.5">
      {labels.map((l, i) => {
        const on = i >= 7 - active;
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-md text-[0.6rem] font-bold"
              style={{
                background: on ? "linear-gradient(135deg,#fb923c,#f0c355)" : "var(--ac-surface-2)",
                color: on ? "#1a1206" : "var(--ac-text-3)",
                border: on ? "none" : "1px solid var(--ac-border)",
              }}>
              {on ? "🔥" : l}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Tarjeta de curso activo */
function CursoActivoCard({ curso, index }: { curso: DashboardProps["cursosActivos"][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: index * 0.06 }}
    >
      <Link
        href={`/academia/cursos/${curso.slug}`}
        className="group flex flex-col overflow-hidden ac-card-glass"
        style={{ borderRadius: "14px" }}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] w-full overflow-hidden" style={{ background: "var(--ac-card)" }}>
          {curso.imagen_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={curso.imagen_url} alt={curso.titulo}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
          ) : (
            <div className="h-full w-full"
              style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.22), rgba(107,92,231,0.22))" }} />
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
            style={{ background: "rgba(9,9,15,0.45)" }}>
            <span className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ background: "var(--ac-gold)", color: "#1a1206" }}>
              <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" />
            </span>
          </div>
          <div className="absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold backdrop-blur-md"
            style={{ background: "rgba(9,9,15,0.7)", color: "var(--ac-gold-light)" }}>
            {curso.progreso}%
          </div>
        </div>
        {/* Info */}
        <div className="flex flex-1 flex-col p-4">
          <h4 className="line-clamp-2 text-[0.95rem] font-semibold leading-snug transition-colors group-hover:text-[var(--ac-gold)]"
            style={{ color: "var(--ac-text)" }}>
            {curso.titulo}
          </h4>
          <p className="mt-1.5 text-xs" style={{ color: "var(--ac-text-3)" }}>
            {curso.lecciones_completadas} de {curso.total_lecciones} lecciones
          </p>
          <div className="mt-auto pt-3">
            <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--ac-border-md)" }}>
              <motion.div className="h-full ac-progress-bar"
                initial={{ width: 0 }} animate={{ width: `${curso.progreso}%` }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.3 + index * 0.08 }} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Cabecera de bienvenida (común)
──────────────────────────────────────────────────────────── */
function WelcomeHeader({ user }: { user: DashboardProps["user"] }) {
  const saludo = useGreeting();
  const displayName = user.nombre ?? user.email.split("@")[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="flex flex-wrap items-center justify-between gap-5"
    >
      <div className="flex items-center gap-4">
        {user.avatar_url ? (
          <div className="h-14 w-14 shrink-0 overflow-hidden ac-glow-gold"
            style={{ border: "1px solid var(--ac-border-gold)", borderRadius: "14px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user.avatar_url} alt={user.nombre ?? "Avatar"}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center text-lg font-bold ac-glow-gold"
            style={{
              background: "linear-gradient(135deg, var(--ac-gold-dim), rgba(107,92,231,0.18))",
              border: "1px solid var(--ac-border-gold)", borderRadius: "14px",
              color: "var(--ac-gold-light)", fontFamily: "var(--font-cormorant, serif)",
            }}>
            {user.avatar_initials}
          </div>
        )}
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.18em]" style={{ color: "var(--ac-text-3)" }}>{saludo}</p>
          <h1 style={{
            fontFamily: "var(--font-cormorant, Georgia, serif)",
            fontSize: "clamp(1.6rem, 4vw, 2.3rem)", fontWeight: 700,
            color: "var(--ac-text)", lineHeight: 1.05,
          }}>
            {displayName}
          </h1>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] ac-badge">
        <GraduationCap className="h-3.5 w-3.5" /> {user.rol}
      </span>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Estado de ONBOARDING (alumno sin cursos) — elevado, no vacío
──────────────────────────────────────────────────────────── */
function OnboardingState() {
  const pasos = [
    { icon: Compass, titulo: "Elige un curso", desc: "Explora el catálogo curado por el equipo académico del Centro." },
    { icon: Play, titulo: "Aprende a tu ritmo", desc: "Lecciones en video y lecturas, disponibles cuando quieras." },
    { icon: Trophy, titulo: "Obtén tu constancia", desc: "Completa el curso y suma conocimiento crítico verificable." },
  ];
  return (
    <div className="mt-6 flex flex-col gap-5">
      {/* Hero de inicio */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease, delay: 0.05 }}
        className="relative overflow-hidden p-8 sm:p-11"
        style={{
          background: "linear-gradient(135deg, var(--ac-surface) 0%, var(--ac-surface-2) 100%)",
          border: "1px solid var(--ac-border-md)", borderRadius: "18px",
        }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full"
          style={{ background: "radial-gradient(circle, var(--ac-gold-glow) 0%, transparent 70%)" }} />
        <div className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, var(--ac-gold), transparent)" }} />
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 crc-eyebrow" style={{ color: "var(--ac-gold)" }}>
            <Sparkles className="h-3.5 w-3.5" /> Tu biblioteca crítica te espera
          </span>
          <h2 className="mt-3" style={{
            fontFamily: "var(--font-cormorant, Georgia, serif)",
            fontSize: "clamp(1.8rem, 4.5vw, 2.9rem)", fontWeight: 700,
            color: "var(--ac-text)", lineHeight: 1.02,
          }}>
            Comienza tu primer <span className="ac-text-gradient" style={{ fontStyle: "italic" }}>curso</span>.
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed" style={{ color: "var(--ac-text-2)" }}>
            Aún no estás inscrito en ningún curso. Explora el catálogo del Centro de Reflexiones
            Críticas y da el primer paso hacia una mirada más aguda del mundo.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/academia/explorar"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-gold ac-glow-gold"
              style={{ borderRadius: "7px" }}>
              Explorar cursos <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/academia/mis-cursos"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-ghost"
              style={{ borderRadius: "7px" }}>
              Mis cursos
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Cómo empezar — 3 pasos */}
      <div className="grid gap-4 sm:grid-cols-3">
        {pasos.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.08 }}
            className="p-6" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)", borderRadius: "14px" }}>
            <div className="flex h-11 w-11 items-center justify-center"
              style={{ background: "var(--ac-gold-dim)", border: "1px solid var(--ac-border-gold)", borderRadius: "11px" }}>
              <p.icon className="h-5 w-5" style={{ color: "var(--ac-gold-light)" }} />
            </div>
            <p className="mt-4 text-[0.72rem] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--ac-text-3)" }}>
              Paso {i + 1}
            </p>
            <h3 className="mt-1 text-lg font-semibold" style={{ color: "var(--ac-text)", fontFamily: "var(--font-cormorant, serif)" }}>
              {p.titulo}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--ac-text-2)" }}>{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Estado ACTIVO (alumno con cursos)
──────────────────────────────────────────────────────────── */
function ActiveState({ cursosActivos, stats }: Pick<DashboardProps, "cursosActivos" | "stats">) {
  const progresoGeneral = stats.cursos_inscritos > 0
    ? Math.round((stats.cursos_completados / stats.cursos_inscritos) * 100)
    : 0;

  return (
    <div className="mt-6 flex flex-col gap-5">
      {/* Fila 1: progreso (2/3) + racha (1/3) */}
      <div className="grid gap-5 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
          className="relative overflow-hidden p-7 lg:col-span-2"
          style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border-md)", borderRadius: "16px" }}>
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full"
            style={{ background: "radial-gradient(circle, var(--ac-gold-glow) 0%, transparent 70%)" }} />
          <div className="absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--ac-gold), transparent)" }} />
          <div className="relative z-10 flex flex-wrap items-center gap-7">
            <div className="relative shrink-0">
              <ProgressRing pct={progresoGeneral} size={112} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold leading-none" style={{ color: "var(--ac-gold-light)", fontFamily: "var(--font-cormorant, serif)" }}>
                  {progresoGeneral}%
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.72rem] uppercase tracking-[0.15em]" style={{ color: "var(--ac-text-3)" }}>Progreso general</p>
              <p className="mt-1.5" style={{
                fontFamily: "var(--font-cormorant, Georgia, serif)",
                fontSize: "clamp(1.3rem, 3vw, 1.9rem)", fontWeight: 700, color: "var(--ac-text)", lineHeight: 1.05,
              }}>
                {stats.cursos_completados} de {stats.cursos_inscritos} cursos completados
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--ac-text-2)" }}>
                Sigue así. Estás construyendo tu conocimiento crítico.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="flex flex-col justify-between p-6"
          style={{
            background: "linear-gradient(150deg, rgba(251,146,60,0.14), rgba(212,168,67,0.08))",
            border: "1px solid rgba(212,168,67,0.24)", borderRadius: "16px",
          }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.15em]" style={{ color: "var(--ac-text-3)" }}>Racha</p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "2.4rem", fontWeight: 700, color: "var(--ac-text)", lineHeight: 1 }}>
                  {stats.racha_dias}
                </span>
                <span className="text-sm" style={{ color: "var(--ac-text-2)" }}>días</span>
              </p>
            </div>
            <Flame className="h-9 w-9" style={{ color: "#fb923c" }} />
          </div>
          <div className="mt-5">
            <WeekStreak dias={stats.racha_dias} />
          </div>
        </motion.div>
      </div>

      {/* Fila 2: stats compactas */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatPill icon={BookOpen} label="Cursos activos"  value={stats.cursos_inscritos}   color="#6b5ce7" delay={0.12} />
        <StatPill icon={Trophy}   label="Completados"      value={stats.cursos_completados} color="#d4a843" delay={0.18} />
        <StatPill icon={Clock}    label="Horas estudiadas" value={`${stats.horas_estudiadas} h`} color="#4ade80" delay={0.24} />
      </div>

      {/* Fila 3: continuar aprendiendo */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "1.55rem", fontWeight: 700, color: "var(--ac-text)" }}>
            Continuar aprendiendo
          </h2>
          <Link href="/academia/mis-cursos"
            className="flex items-center gap-1.5 ac-btn-ghost px-3.5 py-2"
            style={{ borderRadius: "7px", fontSize: "0.78rem" }}>
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cursosActivos.slice(0, 6).map((c, i) => (
            <CursoActivoCard key={c.id} curso={c} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Componente principal
──────────────────────────────────────────────────────────── */
export function DashboardClient({ user, cursosActivos, stats }: DashboardProps) {
  const esNuevo = stats.cursos_inscritos === 0 && cursosActivos.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
      <WelcomeHeader user={user} />
      {esNuevo
        ? <OnboardingState />
        : <ActiveState cursosActivos={cursosActivos} stats={stats} />}
    </div>
  );
}
