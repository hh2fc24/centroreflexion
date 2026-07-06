/**
 * Academia CRC – Profesor/Admin: analítica de aprendizaje de un curso
 * /academia/profesor/cursos/[id]/inscritos
 * Muestra, lección por lección, quiénes vieron/leyeron y cuánto demoraron.
 */
import { redirect, notFound } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { CursoAnalitica, type LessonStat, type StudentStat } from "../../../../_components/CursoAnalitica";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

type Leccion = { id: string; titulo: string; tipo: LessonStat["tipo"]; video_duracion_seg: number | null; modulo_id: string; orden: number };
type Modulo = { id: string; orden: number };
type Prog = { alumno_id: string; leccion_id: string; completada: boolean; porcentaje_visto: number | null; segundos_dedicados: number | null; ultima_vista: string | null };
type InsRow = {
  estado: string; fecha_inscripcion: string;
  profiles: { id: string; nombre: string | null; apellido: string | null; email: string } | { id: string; nombre: string | null; apellido: string | null; email: string }[] | null;
};

const one = <T,>(v: T | T[] | null): T | null => (Array.isArray(v) ? v[0] ?? null : v);
const mean = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);
// Helper a nivel de módulo: evita llamar Date.now() en el cuerpo del componente
const esReciente = (iso: string | null, dias = 7) => !!iso && new Date(iso).getTime() >= Date.now() - dias * 86400000;

export default async function AnaliticaCursoPage({ params }: Props) {
  const { id } = await params;
  if (!isSupabaseConfigured()) redirect("/academia");
  const supabase = await createClient();
  if (!supabase) redirect("/academia");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/academia/login?redirect=/academia/profesor/cursos/${id}/inscritos`);

  const { data: profileRaw } = await supabase.from("profiles").select("rol").eq("id", user.id).single();
  const profile = profileRaw as { rol: string } | null;
  if (!profile || (profile.rol !== "profesor" && profile.rol !== "admin")) redirect("/academia/dashboard");

  const { data: cursoRaw } = await supabase.from("cursos").select("id, titulo, profesor_id").eq("id", id).single();
  const curso = cursoRaw as { id: string; titulo: string; profesor_id: string } | null;
  if (!curso) notFound();
  if (profile.rol !== "admin" && curso.profesor_id !== user.id) redirect("/academia/profesor/cursos");

  // Datos en paralelo
  const [leccionesRes, modulosRes, insRes, progRes] = await Promise.all([
    supabase.from("lecciones").select("id, titulo, tipo, video_duracion_seg, modulo_id, orden").eq("curso_id", curso.id),
    supabase.from("modulos").select("id, orden").eq("curso_id", curso.id),
    supabase
      .from("inscripciones")
      .select("estado, fecha_inscripcion, profiles!inscripciones_alumno_id_fkey (id, nombre, apellido, email)")
      .eq("curso_id", curso.id)
      .in("estado", ["activa", "completada"])
      .order("fecha_inscripcion", { ascending: false }),
    // columnas nuevas de tracking → cliente sin tipar
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("progreso_lecciones")
      .select("alumno_id, leccion_id, completada, porcentaje_visto, segundos_dedicados, ultima_vista")
      .eq("curso_id", curso.id),
  ]);

  const modulos = (modulosRes.data as Modulo[] | null) ?? [];
  const modOrden = new Map(modulos.map((m) => [m.id, m.orden]));
  const lecciones = ((leccionesRes.data as Leccion[] | null) ?? []).slice().sort(
    (a, b) => (modOrden.get(a.modulo_id) ?? 0) - (modOrden.get(b.modulo_id) ?? 0) || a.orden - b.orden
  );
  const totalLecciones = lecciones.length;
  const insRows = (insRes.data as InsRow[] | null) ?? [];
  const prog = (progRes.data as Prog[] | null) ?? [];

  // Índices de progreso
  const porLeccion = new Map<string, Prog[]>();
  const porAlumno = new Map<string, Prog[]>();
  for (const p of prog) {
    (porLeccion.get(p.leccion_id) ?? porLeccion.set(p.leccion_id, []).get(p.leccion_id)!).push(p);
    (porAlumno.get(p.alumno_id) ?? porAlumno.set(p.alumno_id, []).get(p.alumno_id)!).push(p);
  }

  const totalInscritos = insRows.length;

  // Métricas por lección
  const leccionesStats: LessonStat[] = lecciones.map((l) => {
    const rows = porLeccion.get(l.id) ?? [];
    return {
      id: l.id,
      titulo: l.titulo,
      tipo: l.tipo,
      duracionSeg: l.video_duracion_seg,
      vistos: rows.length,
      completados: rows.filter((r) => r.completada).length,
      avgPct: mean(rows.map((r) => r.porcentaje_visto ?? 0)),
      avgSeg: mean(rows.map((r) => r.segundos_dedicados ?? 0)),
    };
  });

  // Métricas por alumno
  const alumnos: StudentStat[] = insRows.map((r) => {
    const al = one(r.profiles);
    const rows = al ? porAlumno.get(al.id) ?? [] : [];
    const completadas = rows.filter((p) => p.completada).length;
    const segTotal = rows.reduce((a, p) => a + (p.segundos_dedicados ?? 0), 0);
    const ultima = rows.reduce<string | null>((acc, p) => (p.ultima_vista && (!acc || p.ultima_vista > acc) ? p.ultima_vista : acc), null);
    return {
      id: al?.id ?? r.fecha_inscripcion,
      nombre: [al?.nombre, al?.apellido].filter(Boolean).join(" ") || "Alumno",
      email: al?.email ?? "",
      estado: r.estado,
      progresoPct: totalLecciones > 0 ? Math.round((completadas / totalLecciones) * 100) : 0,
      completadas,
      totalLecciones,
      segTotal,
      ultimaActividad: ultima,
    };
  });

  // KPIs
  const horasTotales = Math.round((prog.reduce((a, p) => a + (p.segundos_dedicados ?? 0), 0) / 3600) * 10) / 10;
  const activos7d = alumnos.filter((a) => esReciente(a.ultimaActividad)).length;
  const avancePromedio = mean(alumnos.map((a) => a.progresoPct));
  const completadosCount = insRows.filter((r) => r.estado === "completada").length;
  const tasaFinalizacion = totalInscritos > 0 ? Math.round((completadosCount / totalInscritos) * 100) : 0;

  return (
    <CursoAnalitica
      cursoTitulo={curso.titulo}
      totalInscritos={totalInscritos}
      kpis={{ avancePromedio, horasTotales, activos7d, tasaFinalizacion }}
      lecciones={leccionesStats}
      alumnos={alumnos}
    />
  );
}
