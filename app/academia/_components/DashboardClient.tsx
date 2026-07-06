"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Clock, Trophy, Flame, ArrowRight, Play, CheckCircle2, Circle } from "lucide-react";

interface DashboardProps {
  user: {
    nombre: string | null;
    email: string;
    rol: string;
    avatar_initials: string;
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

// Ring de progreso SVG
function ProgressRing({ pct, size = 80 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="url(#gold-grad)"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
      />
      <defs>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c9963a" />
          <stop offset="100%" stopColor="#f0c355" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Mini stat card
function StatCard({ icon: Icon, label, value, color }: {
  icon: typeof BookOpen; label: string; value: string | number; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex flex-col gap-3 p-5"
      style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)", borderRadius: "8px" }}
    >
      <div
        className="inline-flex h-10 w-10 items-center justify-center"
        style={{ background: color + "22", borderRadius: "6px" }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: "var(--ac-text)", fontFamily: "var(--font-cormorant, serif)" }}>
          {value}
        </p>
        <p className="text-xs uppercase tracking-wider mt-0.5" style={{ color: "var(--ac-text-3)" }}>{label}</p>
      </div>
    </motion.div>
  );
}

// Tarjeta de curso activo
function CursoActivoCard({ curso, index }: { curso: DashboardProps["cursosActivos"][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease, delay: index * 0.07 }}
      whileHover={{ x: 4 }}
      className="group flex items-center gap-4 p-4"
      style={{ background: "var(--ac-surface-2)", border: "1px solid var(--ac-border)", borderRadius: "8px" }}
    >
      {/* Thumbnail */}
      <div
        className="relative h-14 w-20 shrink-0 overflow-hidden"
        style={{ background: "var(--ac-card)", borderRadius: "5px" }}
      >
        {curso.imagen_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={curso.imagen_url} alt={curso.titulo} className="h-full w-full object-cover" />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.2), rgba(107,92,231,0.2))" }}
          />
        )}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
          style={{ background: "rgba(9,9,15,0.5)" }}
        >
          <Play className="h-4 w-4" style={{ color: "var(--ac-gold)" }} />
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h4
          className="truncate text-sm font-semibold transition-colors group-hover:text-[var(--ac-gold)]"
          style={{ color: "var(--ac-text)" }}
        >
          {curso.titulo}
        </h4>
        <p className="mt-1 text-xs" style={{ color: "var(--ac-text-3)" }}>
          {curso.lecciones_completadas} / {curso.total_lecciones} lecciones
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--ac-border-md)" }}>
          <motion.div
            className="h-full ac-progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${curso.progreso}%` }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.3 + index * 0.1 }}
          />
        </div>
      </div>

      {/* Progreso % */}
      <div className="shrink-0 text-right">
        <span className="text-sm font-bold" style={{ color: "var(--ac-gold)" }}>{curso.progreso}%</span>
      </div>
    </motion.div>
  );
}

export function DashboardClient({ user, cursosActivos, stats }: DashboardProps) {
  const progresoGeneral = stats.cursos_inscritos > 0
    ? Math.round((stats.cursos_completados / stats.cursos_inscritos) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

      {/* ── Welcome ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="mb-8 flex items-center gap-5"
      >
        {/* Avatar */}
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center text-xl font-bold ac-glow-gold"
          style={{
            background: "linear-gradient(135deg, var(--ac-gold-dim), rgba(107,92,231,0.15))",
            border: "1px solid rgba(212,168,67,0.4)",
            borderRadius: "8px",
            color: "var(--ac-gold-light)",
            fontFamily: "var(--font-cormorant, serif)",
          }}
        >
          {user.avatar_initials}
        </div>
        <div>
          <p className="text-sm uppercase tracking-widest" style={{ color: "var(--ac-text-3)" }}>Bienvenido</p>
          <h1
            style={{
              fontFamily: "var(--font-cormorant, Georgia, serif)",
              fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
              fontWeight: 700,
              color: "var(--ac-text)",
              lineHeight: 1.1,
            }}
          >
            {user.nombre ?? user.email.split("@")[0]}
          </h1>
          <span
            className="mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ac-badge"
          >
            {user.rol}
          </span>
        </div>
      </motion.div>

      {/* ── Bento Grid ── */}
      <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-[auto_auto]">

        {/* 1. Progreso general — grande, ocupa 2 cols en desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
          className="relative overflow-hidden p-8 lg:col-span-2"
          style={{
            background: "var(--ac-surface)",
            border: "1px solid var(--ac-border-md)",
            borderRadius: "8px",
          }}
        >
          {/* Orb de fondo */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full"
            style={{ background: "radial-gradient(circle, var(--ac-gold-glow) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
          />
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--ac-gold), transparent)" }}
          />

          <div className="relative z-10 flex items-center gap-8">
            <div className="relative shrink-0">
              <ProgressRing pct={progresoGeneral} size={96} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold" style={{ color: "var(--ac-gold-light)", fontFamily: "var(--font-cormorant, serif)" }}>
                  {progresoGeneral}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--ac-text-3)" }}>Progreso general</p>
              <p
                style={{
                  fontFamily: "var(--font-cormorant, Georgia, serif)",
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  fontWeight: 700,
                  color: "var(--ac-text)",
                  lineHeight: 1.1,
                }}
              >
                {stats.cursos_completados} de {stats.cursos_inscritos} cursos completados
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--ac-text-2)" }}>
                Sigue así. Estás construyendo tu conocimiento crítico.
              </p>
              {stats.cursos_inscritos === 0 && (
                <Link
                  href="/academia/explorar"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-gold"
              style={{ borderRadius: "5px" }}
                >
                  Explorar cursos <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* 2. Racha */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="flex flex-col items-center justify-center p-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(212,168,67,0.12), rgba(107,92,231,0.1))",
            border: "1px solid rgba(212,168,67,0.2)",
            borderRadius: "8px",
          }}
        >
          <Flame className="mb-2 h-8 w-8" style={{ color: "#fb923c" }} />
          <p
            className="mb-1 font-bold"
            style={{
              fontFamily: "var(--font-cormorant, Georgia, serif)",
              fontSize: "2.2rem",
              color: "var(--ac-text)",
              lineHeight: 1,
            }}
          >
            {stats.racha_dias}
          </p>
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--ac-text-3)" }}>
            días de racha
          </p>
        </motion.div>

        {/* 3. Stats pequeñas */}
        <StatCard icon={BookOpen}   label="Cursos activos"   value={stats.cursos_inscritos}  color="#6b5ce7" />
        <StatCard icon={Trophy}     label="Completados"       value={stats.cursos_completados} color="#d4a843" />
        <StatCard icon={Clock}      label="Horas estudiadas"  value={`${stats.horas_estudiadas}h`} color="#4ade80" />

        {/* 4. Mis cursos activos — ocupa 3 cols */}
        <div
          className="p-6 lg:col-span-3"
          style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)", borderRadius: "8px" }}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2
              style={{
                fontFamily: "var(--font-cormorant, Georgia, serif)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--ac-text)",
              }}
            >
              Continuar aprendiendo
            </h2>
            <Link
              href="/academia/mis-cursos"
              className="flex items-center gap-1.5 ac-btn-ghost px-3 py-1.5"
              style={{ borderRadius: "5px", fontSize: "0.8rem" }}
            >
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {cursosActivos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BookOpen className="mb-3 h-10 w-10" style={{ color: "var(--ac-text-3)" }} />
              <p className="text-sm" style={{ color: "var(--ac-text-3)" }}>
                Aún no estás inscrito en ningún curso.
              </p>
              <Link
                href="/academia"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-gold"
              style={{ borderRadius: "5px" }}
              >
                Explorar cursos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cursosActivos.slice(0, 6).map((c, i) => (
                <CursoActivoCard key={c.id} curso={c} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
