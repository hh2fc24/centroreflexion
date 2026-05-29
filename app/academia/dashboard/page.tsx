/**
 * Academia CRC – Dashboard del alumno
 * Ruta protegida: /academia/dashboard
 */
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Profile, Curso, Inscripcion } from "@/lib/supabase/database.types";
import { DashboardClient } from "../_components/DashboardClient";

// Estado vacío para cuando Supabase no está configurado
function DashboardNotConfigured() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <div
        className="w-full max-w-md rounded-[8px] p-10 text-center"
        style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border-md)" }}
      >
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[8px]"
          style={{ background: "var(--ac-gold-dim)", border: "1px solid rgba(212,168,67,0.3)" }}
        >
          <span style={{ fontSize: "2rem" }}>🔧</span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-cormorant, Georgia, serif)",
            fontSize: "1.8rem",
            fontWeight: 700,
            color: "var(--ac-text)",
          }}
        >
          Supabase pendiente
        </h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ac-text-2)" }}>
          Configura las credenciales en{" "}
          <code
            className="rounded px-1.5 py-0.5 text-xs"
            style={{ background: "var(--ac-surface-2)", color: "var(--ac-gold)" }}
          >
            .env.local
          </code>{" "}
          para activar el dashboard. Copia{" "}
          <code className="rounded px-1.5 py-0.5 text-xs" style={{ background: "var(--ac-surface-2)", color: "var(--ac-gold)" }}>
            .env.local.example
          </code>{" "}
          y rellena los valores de tu proyecto Supabase.
        </p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) return <DashboardNotConfigured />;

  const supabase = await createClient();
  if (!supabase) return <DashboardNotConfigured />;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/academia/login?redirect=/academia/dashboard");

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("nombre, apellido, rol")
    .eq("id", user.id)
    .single();
  const profile = profileRaw as Pick<Profile, "nombre" | "apellido" | "rol"> | null;

  const rol = profile?.rol ?? "alumno";
  const nombre = profile?.nombre ?? null;
  const apellido = profile?.apellido ?? null;

  const avatar_initials = [nombre, apellido]
    .filter(Boolean)
    .map((n) => n![0].toUpperCase())
    .join("")
    .slice(0, 2) || user.email?.slice(0, 2).toUpperCase() || "AC";

  type InscripcionConCurso = Pick<Inscripcion, "id" | "curso_id"> & {
    cursos: (Pick<Curso, "id" | "slug" | "titulo" | "imagen_url"> & { lecciones: { id: string }[] }) | null;
  };

  // Cursos activos
  const { data: inscripcionesRaw } = await supabase
    .from("inscripciones")
    .select(`
      id, curso_id,
      cursos (id, slug, titulo, imagen_url, lecciones(id))
    `)
    .eq("alumno_id", user.id)
    .eq("estado", "activa")
    .order("fecha_inscripcion", { ascending: false })
    .limit(6);
  const inscripciones = inscripcionesRaw as InscripcionConCurso[] | null;

  const cursosConProgreso = await Promise.all(
    (inscripciones ?? []).map(async (ins) => {
      const curso = ins.cursos;
      if (!curso) return null;

      const totalLecciones = curso.lecciones?.length ?? 0;
      const { count } = await supabase
        .from("progreso_lecciones")
        .select("*", { count: "exact", head: true })
        .eq("alumno_id", user.id)
        .eq("curso_id", ins.curso_id)
        .eq("completada", true);

      const completadas = count ?? 0;
      const progreso = totalLecciones > 0 ? Math.round((completadas / totalLecciones) * 100) : 0;

      return {
        id: curso.id,
        slug: curso.slug,
        titulo: curso.titulo,
        imagen_url: curso.imagen_url,
        progreso,
        lecciones_completadas: completadas,
        total_lecciones: totalLecciones,
      };
    })
  );

  const cursosActivos = cursosConProgreso.filter(Boolean) as NonNullable<typeof cursosConProgreso[0]>[];

  const totalInscritos = inscripciones?.length ?? 0;
  const { count: completados } = await supabase
    .from("inscripciones")
    .select("*", { count: "exact", head: true })
    .eq("alumno_id", user.id)
    .eq("estado", "completada");

  type ProgresoConLeccion = { leccion_id: string; lecciones: { video_duracion_seg: number | null } | null };
  const { data: progresoRaw } = await supabase
    .from("progreso_lecciones")
    .select("leccion_id, lecciones(video_duracion_seg)")
    .eq("alumno_id", user.id)
    .eq("completada", true);
  const progreso = progresoRaw as ProgresoConLeccion[] | null;

  const horasEstudiadas = Math.round(
    (progreso ?? []).reduce((acc, p) => {
      const dur = p.lecciones?.video_duracion_seg ?? 0;
      return acc + dur;
    }, 0) / 3600
  );

  return (
    <DashboardClient
      user={{ nombre, email: user.email!, rol, avatar_initials }}
      cursosActivos={cursosActivos}
      stats={{
        cursos_inscritos: totalInscritos,
        cursos_completados: completados ?? 0,
        horas_estudiadas: horasEstudiadas,
        racha_dias: 0,
      }}
    />
  );
}
