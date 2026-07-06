"use client";

/**
 * Academia CRC – Analítica de aprendizaje de un curso.
 * Muestra, lección por lección, cuántos alumnos la vieron/leyeron, cuánto
 * tiempo dedicaron y su avance; más KPIs generales y el detalle por alumno.
 */
import Link from "next/link";
import {
  ArrowLeft, Users, Clock, TrendingUp, Activity,
  Video, FileText, HelpCircle, CheckCircle2, Eye,
} from "lucide-react";

export interface LessonStat {
  id: string;
  titulo: string;
  tipo: "video" | "texto" | "documento" | "quiz";
  duracionSeg: number | null;
  vistos: number;       // alumnos que la abrieron
  completados: number;  // alumnos que la completaron
  avgPct: number;       // % visto promedio (entre quienes la abrieron)
  avgSeg: number;       // tiempo dedicado promedio (entre quienes la abrieron)
}

export interface StudentStat {
  id: string;
  nombre: string;
  email: string;
  estado: string;
  progresoPct: number;
  completadas: number;
  totalLecciones: number;
  segTotal: number;
  ultimaActividad: string | null;
}

interface Props {
  cursoTitulo: string;
  totalInscritos: number;
  kpis: { avancePromedio: number; horasTotales: number; activos7d: number; tasaFinalizacion: number };
  lecciones: LessonStat[];
  alumnos: StudentStat[];
}

function fmtDur(seg: number): string {
  if (!seg || seg <= 0) return "—";
  const h = Math.floor(seg / 3600);
  const m = Math.floor((seg % 3600) / 60);
  const s = Math.floor(seg % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function fmtFecha(iso: string | null): string {
  if (!iso) return "Sin actividad";
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 86400000;
  if (diff < 1) return "Hoy";
  if (diff < 2) return "Ayer";
  if (diff < 7) return `Hace ${Math.floor(diff)} días`;
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short" });
}

const TIPO_META: Record<LessonStat["tipo"], { label: string; icon: typeof Video; color: string }> = {
  video: { label: "Video", icon: Video, color: "#6b5ce7" },
  texto: { label: "Texto", icon: FileText, color: "#d4a843" },
  documento: { label: "Documento", icon: FileText, color: "#38bdf8" },
  quiz: { label: "Quiz", icon: HelpCircle, color: "#4ade80" },
};

function Bar({ pct, color = "var(--ac-gold)" }: { pct: number; color?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--ac-surface-2)" }}>
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
    </div>
  );
}

export function CursoAnalitica({ cursoTitulo, totalInscritos, kpis, lecciones, alumnos }: Props) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <Link href="/academia/profesor/cursos" className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--ac-text-3)" }}>
        <ArrowLeft className="h-3.5 w-3.5" /> Mis cursos
      </Link>

      <span className="crc-eyebrow mt-4 block" style={{ color: "var(--ac-gold)" }}>Analítica de aprendizaje</span>
      <h1 className="mt-1" style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 700, color: "var(--ac-text)", lineHeight: 1.05 }}>
        {cursoTitulo}
      </h1>

      {/* KPIs */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Users} color="#d4a843" label="Estudiantes" value={String(totalInscritos)} />
        <Kpi icon={TrendingUp} color="#6b5ce7" label="Avance promedio" value={`${kpis.avancePromedio}%`} />
        <Kpi icon={Clock} color="#38bdf8" label="Horas dedicadas" value={`${kpis.horasTotales}h`} />
        <Kpi icon={Activity} color="#4ade80" label="Activos (7 días)" value={String(kpis.activos7d)} />
      </div>

      {/* Tabla por lección */}
      <h2 className="mt-12 mb-4 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>
        Por lección — quiénes la vieron y cuánto demoraron
      </h2>
      <div className="overflow-hidden rounded-xl" style={{ border: "1px solid var(--ac-border)" }}>
        <div className="hidden grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-wider sm:grid" style={{ background: "var(--ac-surface-2)", color: "var(--ac-text-3)" }}>
          <span>Lección</span>
          <span className="w-16 text-right">Vistos</span>
          <span className="w-20 text-right">Completado</span>
          <span className="w-24 text-right">% visto</span>
          <span className="w-24 text-right">T. medio</span>
        </div>
        {lecciones.map((l) => {
          const meta = TIPO_META[l.tipo];
          const Icon = meta.icon;
          const tasaComp = totalInscritos > 0 ? Math.round((l.completados / totalInscritos) * 100) : 0;
          const verbo = l.tipo === "video" ? "vieron" : "leyeron";
          return (
            <div key={l.id} className="grid grid-cols-1 gap-3 border-t px-5 py-4 sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-center sm:gap-4" style={{ borderColor: "var(--ac-border)" }}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style={{ background: `${meta.color}22` }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: meta.color }} />
                  </span>
                  <span className="truncate text-sm font-medium" style={{ color: "var(--ac-text)" }}>{l.titulo}</span>
                </div>
                <p className="mt-1 pl-8 text-[0.7rem]" style={{ color: "var(--ac-text-3)" }}>
                  {meta.label}{l.duracionSeg ? ` · ${fmtDur(l.duracionSeg)}` : ""} — {l.vistos} de {totalInscritos} {verbo}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-sm sm:w-16 sm:justify-end" style={{ color: "var(--ac-text-2)" }}>
                <Eye className="h-3.5 w-3.5 sm:hidden" style={{ color: "var(--ac-text-3)" }} />{l.vistos}
              </div>
              <div className="sm:w-20 sm:text-right">
                <span className="inline-flex items-center gap-1 text-sm" style={{ color: "var(--ac-text-2)" }}>
                  <CheckCircle2 className="h-3.5 w-3.5" style={{ color: tasaComp >= 60 ? "#4ade80" : "var(--ac-text-3)" }} />
                  {l.completados} <span className="text-xs" style={{ color: "var(--ac-text-3)" }}>({tasaComp}%)</span>
                </span>
              </div>
              <div className="sm:w-24">
                <div className="flex items-center gap-2">
                  <Bar pct={l.avgPct} color={meta.color} />
                  <span className="w-9 shrink-0 text-right text-xs tabular-nums" style={{ color: "var(--ac-text-2)" }}>{l.avgPct}%</span>
                </div>
              </div>
              <div className="text-sm tabular-nums sm:w-24 sm:text-right" style={{ color: "var(--ac-text-2)" }}>
                {fmtDur(l.avgSeg)}
              </div>
            </div>
          );
        })}
        {lecciones.length === 0 && (
          <p className="px-5 py-10 text-center text-sm" style={{ color: "var(--ac-text-3)" }}>Este curso aún no tiene lecciones.</p>
        )}
      </div>

      {/* Detalle por alumno */}
      <h2 className="mt-12 mb-4 flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>
        <span>Estudiantes</span>
        <span className="font-medium normal-case tracking-normal" style={{ color: "var(--ac-text-3)" }}>{alumnos.length} inscrito(s)</span>
      </h2>
      {alumnos.length === 0 ? (
        <p className="rounded-xl py-12 text-center text-sm" style={{ background: "var(--ac-surface)", border: "1px dashed var(--ac-border-md)", color: "var(--ac-text-3)" }}>
          Aún no hay estudiantes inscritos en este curso.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {alumnos.map((a) => (
            <div key={a.id} className="rounded-xl px-5 py-4" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)" }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--ac-text)" }}>
                    {a.nombre}
                    {a.estado === "completada" && (
                      <span className="rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>Completado</span>
                    )}
                  </p>
                  <p className="text-xs" style={{ color: "var(--ac-text-3)" }}>{a.email}</p>
                </div>
                <div className="flex items-center gap-5 text-right">
                  <div>
                    <p className="text-sm font-bold tabular-nums" style={{ color: "var(--ac-text-2)" }}>{fmtDur(a.segTotal)}</p>
                    <p className="text-[0.65rem]" style={{ color: "var(--ac-text-3)" }}>dedicado</p>
                  </div>
                  <div>
                    <p className="text-[0.65rem]" style={{ color: "var(--ac-text-3)" }}>{fmtFecha(a.ultimaActividad)}</p>
                  </div>
                  <div className="w-14">
                    <p className="text-sm font-bold" style={{ color: "var(--ac-gold)" }}>{a.progresoPct}%</p>
                    <p className="text-[0.65rem]" style={{ color: "var(--ac-text-3)" }}>{a.completadas}/{a.totalLecciones}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3"><Bar pct={a.progresoPct} color="linear-gradient(90deg, var(--ac-gold), var(--ac-gold-light))" /></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Kpi({ icon: Icon, color, label, value }: { icon: typeof Users; color: string; label: string; value: string }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)" }}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${color}1f` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <p className="mt-3" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.9rem", fontWeight: 700, color: "var(--ac-text)" }}>{value}</p>
      <p className="text-xs" style={{ color: "var(--ac-text-3)" }}>{label}</p>
    </div>
  );
}
