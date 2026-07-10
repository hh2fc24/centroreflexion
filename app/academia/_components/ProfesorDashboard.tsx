/**
 * Academia CRC – Dashboard del profesor
 * Resumen de sus cursos, inscritos y accesos a la gestión.
 */
import Link from "next/link";
import { BookOpen, Users, GraduationCap, ArrowRight, Eye, Clock, TrendingUp, Activity } from "lucide-react";

interface CursoResumen {
  id: string;
  slug: string;
  titulo: string;
  estado: string;
  nInscritos: number;
}

export function ProfesorDashboard({
  nombre,
  cursos,
  totalInscritos,
  engagement,
}: {
  nombre: string | null;
  cursos: CursoResumen[];
  totalInscritos: number;
  engagement?: { horas: number; avance: number; activos7d: number };
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="crc-eyebrow" style={{ color: "var(--ac-gold)" }}>Panel de profesor</span>
      <h1
        className="mt-2"
        style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700, color: "var(--ac-text)", lineHeight: 1 }}
      >
        Hola{nombre ? `, ${nombre}` : ""}.
      </h1>
      <p className="mt-3 text-sm" style={{ color: "var(--ac-text-2)" }}>
        Gestiona tus cursos y revisa el avance de tus estudiantes.
      </p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat icon={BookOpen} label="Cursos" value={cursos.length} color="#6b5ce7" />
        <Stat icon={Users} label="Estudiantes inscritos" value={totalInscritos} color="#d4a843" />
        <Stat icon={GraduationCap} label="Publicados" value={cursos.filter((c) => c.estado === "publicado").length} color="#4ade80" />
      </div>

      {/* Engagement */}
      {engagement && (
        <>
          <h2 className="mt-10 mb-4 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>Aprendizaje</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat icon={TrendingUp} label="Avance promedio" value={`${engagement.avance}%`} color="#6b5ce7" />
            <Stat icon={Clock} label="Horas dedicadas" value={`${engagement.horas}h`} color="#38bdf8" />
            <Stat icon={Activity} label="Activos (7 días)" value={engagement.activos7d} color="#4ade80" />
          </div>
        </>
      )}

      {/* Cursos */}
      <div className="mt-12 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>Mis cursos</h2>
        <Link href="/academia/profesor/cursos" className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--ac-text-2)" }}>
          Ver todos <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {cursos.length === 0 ? (
        <p className="mt-8 rounded-xl py-12 text-center text-sm" style={{ background: "var(--ac-surface)", border: "1px dashed var(--ac-border-md)", color: "var(--ac-text-3)" }}>
          Aún no tienes cursos asignados.
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {cursos.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-4 rounded-xl px-5 py-4" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)" }}>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--ac-text)" }}>{c.titulo}</p>
                <p className="mt-0.5 flex items-center gap-3 text-xs" style={{ color: "var(--ac-text-3)" }}>
                  <span className="capitalize rounded-full px-2 py-0.5" style={{ background: "var(--ac-surface-2)" }}>{c.estado}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.nInscritos} inscritos</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/academia/profesor/cursos/${c.id}/inscritos`} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.7rem] font-bold ac-btn-ghost">
                  <Users className="h-3.5 w-3.5" /> Inscritos
                </Link>
                <Link href={`/academia/cursos/${c.slug}`} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[0.7rem] font-bold ac-btn-ghost">
                  <Eye className="h-3.5 w-3.5" /> Ver
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: typeof BookOpen; label: string; value: number | string; color: string }) {
  return (
    <div className="p-5" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)", borderRadius: "14px" }}>
      <div className="flex h-10 w-10 items-center justify-center" style={{ background: `${color}1f`, borderRadius: "10px" }}>
        <Icon className="h-[18px] w-[18px]" style={{ color }} />
      </div>
      <p className="mt-3 tabular-nums" style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "2.1rem", fontWeight: 700, color: "var(--ac-text)", lineHeight: 1 }}>{value}</p>
      <p className="mt-1 text-[0.7rem] uppercase tracking-[0.1em]" style={{ color: "var(--ac-text-3)" }}>{label}</p>
    </div>
  );
}
