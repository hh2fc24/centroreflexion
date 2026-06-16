/**
 * Academia CRC – Profesor: inscritos y progreso de un curso
 * /academia/profesor/cursos/[id]/inscritos
 */
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function InscritosCursoPage({ params }: Props) {
  const { id } = await params;
  if (!isSupabaseConfigured()) redirect("/academia");
  const supabase = await createClient();
  if (!supabase) redirect("/academia");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/academia/login?redirect=/academia/profesor/cursos/${id}/inscritos`);

  const { data: profileRaw } = await supabase.from("profiles").select("rol").eq("id", user.id).single();
  const profile = profileRaw as { rol: string } | null;
  if (!profile || (profile.rol !== "profesor" && profile.rol !== "admin")) redirect("/academia/dashboard");

  // Curso (debe ser del profesor, salvo admin)
  const { data: cursoRaw } = await supabase
    .from("cursos")
    .select("id, titulo, profesor_id")
    .eq("id", id)
    .single();
  const curso = cursoRaw as { id: string; titulo: string; profesor_id: string } | null;
  if (!curso) notFound();
  if (profile.rol !== "admin" && curso.profesor_id !== user.id) redirect("/academia/profesor/cursos");

  // Total de lecciones del curso (para % de progreso)
  const { count: totalLecciones } = await supabase
    .from("lecciones")
    .select("*", { count: "exact", head: true })
    .eq("curso_id", curso.id);
  const totLec = totalLecciones ?? 0;

  // Inscritos (activos)
  const { data: insRaw } = await supabase
    .from("inscripciones")
    .select(`
      id, estado, fecha_inscripcion,
      profiles!inscripciones_alumno_id_fkey (id, nombre, apellido, email)
    `)
    .eq("curso_id", curso.id)
    .eq("estado", "activa")
    .order("fecha_inscripcion", { ascending: false });

  type Row = {
    id: string; fecha_inscripcion: string;
    profiles: { id: string; nombre: string | null; apellido: string | null; email: string } | { id: string; nombre: string | null; apellido: string | null; email: string }[] | null;
  };
  const rows = (insRaw as Row[] | null) ?? [];
  const one = <T,>(v: T | T[] | null): T | null => (Array.isArray(v) ? v[0] ?? null : v);

  const inscritos = await Promise.all(
    rows.map(async (r) => {
      const al = one(r.profiles);
      let completadas = 0;
      if (al) {
        const { count } = await supabase
          .from("progreso_lecciones")
          .select("*", { count: "exact", head: true })
          .eq("alumno_id", al.id)
          .eq("curso_id", curso.id)
          .eq("completada", true);
        completadas = count ?? 0;
      }
      const progreso = totLec > 0 ? Math.round((completadas / totLec) * 100) : 0;
      return {
        id: r.id,
        nombre: [al?.nombre, al?.apellido].filter(Boolean).join(" ") || "Alumno",
        email: al?.email ?? "",
        fecha: r.fecha_inscripcion,
        completadas, progreso,
      };
    })
  );

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <Link href="/academia/profesor/cursos" className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--ac-text-3)" }}>
        <ArrowLeft className="h-3.5 w-3.5" /> Mis cursos
      </Link>
      <h1 className="mt-4" style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 700, color: "var(--ac-text)", lineHeight: 1.05 }}>
        {curso.titulo}
      </h1>
      <p className="mt-2 flex items-center gap-2 text-sm" style={{ color: "var(--ac-text-2)" }}>
        <Users className="h-4 w-4" style={{ color: "var(--ac-gold)" }} /> {inscritos.length} estudiante(s) inscrito(s)
      </p>

      {inscritos.length === 0 ? (
        <p className="mt-12 rounded-xl py-12 text-center text-sm" style={{ background: "var(--ac-surface)", border: "1px dashed var(--ac-border-md)", color: "var(--ac-text-3)" }}>
          Aún no hay estudiantes inscritos en este curso.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {inscritos.map((a) => (
            <div key={a.id} className="rounded-xl px-5 py-4" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)" }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--ac-text)" }}>{a.nombre}</p>
                  <p className="text-xs" style={{ color: "var(--ac-text-3)" }}>{a.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "var(--ac-gold)" }}>{a.progreso}%</p>
                  <p className="text-[0.7rem]" style={{ color: "var(--ac-text-3)" }}>{a.completadas}/{totLec} clases</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--ac-surface-2)" }}>
                <div className="h-full rounded-full" style={{ width: `${a.progreso}%`, background: "linear-gradient(90deg, var(--ac-gold), var(--ac-gold-light))" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
