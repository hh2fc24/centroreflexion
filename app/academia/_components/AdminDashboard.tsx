/**
 * Academia CRC – Dashboard del administrador
 * Vista general + accesos rápidos a la gestión.
 */
import Link from "next/link";
import { BookOpen, Users, Inbox, GraduationCap, ArrowRight, Clock, Activity, CheckCircle2 } from "lucide-react";

export function AdminDashboard({
  nombre,
  totalCursos,
  totalAlumnos,
  totalProfesores,
  solicitudesPendientes,
  engagement,
}: {
  nombre: string | null;
  totalCursos: number;
  totalAlumnos: number;
  totalProfesores: number;
  solicitudesPendientes: number;
  engagement?: { horas: number; activos7d: number; tasaFinalizacion: number };
}) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <span className="crc-eyebrow" style={{ color: "var(--ac-gold)" }}>Panel de administración</span>
      <h1
        className="mt-2"
        style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700, color: "var(--ac-text)", lineHeight: 1 }}
      >
        Hola{nombre ? `, ${nombre}` : ""}.
      </h1>
      <p className="mt-3 text-sm" style={{ color: "var(--ac-text-2)" }}>
        Vista general de la Academia y gestión de cursos e inscripciones.
      </p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <Stat icon={BookOpen} label="Cursos" value={totalCursos} color="#6b5ce7" />
        <Stat icon={Users} label="Alumnos" value={totalAlumnos} color="#d4a843" />
        <Stat icon={GraduationCap} label="Profesores" value={totalProfesores} color="#4ade80" />
        <Stat icon={Inbox} label="Solicitudes" value={solicitudesPendientes} color="#f97316" highlight={solicitudesPendientes > 0} />
      </div>

      {/* Engagement */}
      {engagement && (
        <>
          <h2 className="mt-10 mb-4 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>Aprendizaje en la plataforma</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat icon={Clock} label="Horas de estudio" value={`${engagement.horas}h`} color="#38bdf8" />
            <Stat icon={Activity} label="Alumnos activos (7 días)" value={engagement.activos7d} color="#4ade80" />
            <Stat icon={CheckCircle2} label="Tasa de finalización" value={`${engagement.tasaFinalizacion}%`} color="#6b5ce7" />
          </div>
        </>
      )}

      {/* Accesos rápidos */}
      <h2 className="mt-12 mb-5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>Gestión</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <QuickLink
          href="/academia/admin/solicitudes"
          icon={Inbox}
          title="Solicitudes de inscripción"
          desc={solicitudesPendientes > 0 ? `${solicitudesPendientes} pendiente(s) por confirmar` : "Sin solicitudes pendientes"}
          badge={solicitudesPendientes > 0 ? solicitudesPendientes : undefined}
        />
        <QuickLink href="/academia/admin/cursos" icon={BookOpen} title="Cursos" desc="Ver y administrar todos los cursos" />
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color, highlight }: { icon: typeof BookOpen; label: string; value: number | string; color: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "var(--ac-surface)", border: highlight ? `1px solid ${color}` : "1px solid var(--ac-border)" }}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${color}1f` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <p className="mt-3" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "2rem", fontWeight: 700, color: "var(--ac-text)" }}>{value}</p>
      <p className="text-xs" style={{ color: "var(--ac-text-3)" }}>{label}</p>
    </div>
  );
}

function QuickLink({ href, icon: Icon, title, desc, badge }: { href: string; icon: typeof BookOpen; title: string; desc: string; badge?: number }) {
  return (
    <Link href={href} className="group flex items-center gap-4 rounded-xl p-5 transition-all hover:-translate-y-0.5" style={{ background: "var(--ac-card)", border: "1px solid var(--ac-border)" }}>
      <div className="flex h-11 w-11 items-center justify-center rounded-lg" style={{ background: "var(--ac-gold-dim)", border: "1px solid rgba(212,168,67,0.25)" }}>
        <Icon className="h-5 w-5" style={{ color: "var(--ac-gold)" }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--ac-text)" }}>
          {title}
          {badge !== undefined && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "#f97316", color: "#0c0c10" }}>{badge}</span>
          )}
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--ac-text-3)" }}>{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" style={{ color: "var(--ac-gold)" }} />
    </Link>
  );
}
