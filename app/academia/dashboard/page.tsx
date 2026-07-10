/**
 * Academia CRC – Dashboard del alumno
 * Ruta protegida: /academia/dashboard
 */
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Profile, Curso, Inscripcion } from "@/lib/supabase/database.types";
import { DashboardClient } from "../_components/DashboardClient";
import { ProfesorDashboard } from "../_components/ProfesorDashboard";
import { AdminDashboard } from "../_components/AdminDashboard";

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

  // Google SSO entrega el nombre en user_metadata (full_name / name / given_name).
  // Lo usamos como respaldo cuando el perfil aún no tiene nombre guardado, para no
  // caer nunca en el prefijo del correo (ej. "hh2fc24").
  const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
  const metaFull = (meta.full_name || meta.name || "").trim();
  const metaGiven = (meta.given_name || (metaFull ? metaFull.split(" ")[0] : "")).trim();
  const metaFamily = (meta.family_name || (metaFull.split(" ").length > 1 ? metaFull.split(" ").slice(1).join(" ") : "")).trim();

  const rol = profile?.rol ?? "alumno";
  const nombre = profile?.nombre || metaGiven || null;
  const apellido = profile?.apellido || metaFamily || null;

  const avatar_initials = [nombre, apellido]
    .filter(Boolean)
    .map((n) => n![0].toUpperCase())
    .join("")
    .slice(0, 2) || user.email?.slice(0, 2).toUpperCase() || "AC";

  // ── Dashboard del PROFESOR ──────────────────────────────
  if (rol === "profesor") {
    const { data: cursosRaw } = await supabase
      .from("cursos")
      .select("id, slug, titulo, estado")
      .eq("profesor_id", user.id)
      .order("created_at", { ascending: false });
    const cursosP = (cursosRaw as Array<{ id: string; slug: string; titulo: string; estado: string }> | null) ?? [];

    const cursos = await Promise.all(
      cursosP.map(async (c) => {
        const { count } = await supabase
          .from("inscripciones")
          .select("*", { count: "exact", head: true })
          .eq("curso_id", c.id)
          .eq("estado", "activa");
        return { ...c, nInscritos: count ?? 0 };
      })
    );
    const totalInscritos = cursos.reduce((a, c) => a + c.nInscritos, 0);

    // ── Engagement (aprendizaje real) ──
    const courseIds = cursosP.map((c) => c.id);
    let engagement: { horas: number; avance: number; activos7d: number } | undefined;
    if (courseIds.length) {
      const [progRes, lecRes, insRes] = await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase as any).from("progreso_lecciones").select("alumno_id, curso_id, completada, segundos_dedicados, ultima_vista").in("curso_id", courseIds),
        supabase.from("lecciones").select("id, curso_id").in("curso_id", courseIds),
        supabase.from("inscripciones").select("alumno_id, curso_id").in("curso_id", courseIds).in("estado", ["activa", "completada"]),
      ]);
      type P = { alumno_id: string; curso_id: string; completada: boolean; segundos_dedicados: number | null; ultima_vista: string | null };
      const prog = (progRes.data as P[] | null) ?? [];
      const lecCount = new Map<string, number>();
      ((lecRes.data as { id: string; curso_id: string }[] | null) ?? []).forEach((l) => lecCount.set(l.curso_id, (lecCount.get(l.curso_id) ?? 0) + 1));
      const compByKey = new Map<string, number>();
      prog.forEach((p) => { if (p.completada) { const k = `${p.alumno_id}|${p.curso_id}`; compByKey.set(k, (compByKey.get(k) ?? 0) + 1); } });
      const inscritosList = (insRes.data as { alumno_id: string; curso_id: string }[] | null) ?? [];
      const avances = inscritosList.map((i) => {
        const tot = lecCount.get(i.curso_id) ?? 0;
        return tot > 0 ? ((compByKey.get(`${i.alumno_id}|${i.curso_id}`) ?? 0) / tot) * 100 : 0;
      });
      const semana = Date.now() - 7 * 86400000;
      engagement = {
        horas: Math.round((prog.reduce((a, p) => a + (p.segundos_dedicados ?? 0), 0) / 3600) * 10) / 10,
        avance: avances.length ? Math.round(avances.reduce((a, b) => a + b, 0) / avances.length) : 0,
        activos7d: new Set(prog.filter((p) => p.ultima_vista && new Date(p.ultima_vista).getTime() >= semana).map((p) => p.alumno_id)).size,
      };
    }

    return <ProfesorDashboard nombre={nombre} cursos={cursos} totalInscritos={totalInscritos} engagement={engagement} />;
  }

  // ── Dashboard del ADMIN ─────────────────────────────────
  if (rol === "admin") {
    const [cursosCount, alumnosCount, profesoresCount, solicitudesCount, insTotal, insCompletadas, progRes] = await Promise.all([
      supabase.from("cursos").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("rol", "alumno"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("rol", "profesor"),
      supabase.from("inscripciones").select("*", { count: "exact", head: true }).eq("estado", "pendiente"),
      supabase.from("inscripciones").select("*", { count: "exact", head: true }).in("estado", ["activa", "completada"]),
      supabase.from("inscripciones").select("*", { count: "exact", head: true }).eq("estado", "completada"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("progreso_lecciones").select("alumno_id, segundos_dedicados, ultima_vista"),
    ]);
    type P = { alumno_id: string; segundos_dedicados: number | null; ultima_vista: string | null };
    const prog = (progRes.data as P[] | null) ?? [];
    const semana = Date.now() - 7 * 86400000;
    const insBase = insTotal.count ?? 0;
    const engagement = {
      horas: Math.round((prog.reduce((a, p) => a + (p.segundos_dedicados ?? 0), 0) / 3600) * 10) / 10,
      activos7d: new Set(prog.filter((p) => p.ultima_vista && new Date(p.ultima_vista).getTime() >= semana).map((p) => p.alumno_id)).size,
      tasaFinalizacion: insBase > 0 ? Math.round(((insCompletadas.count ?? 0) / insBase) * 100) : 0,
    };
    return (
      <AdminDashboard
        nombre={nombre}
        totalCursos={cursosCount.count ?? 0}
        totalAlumnos={alumnosCount.count ?? 0}
        totalProfesores={profesoresCount.count ?? 0}
        solicitudesPendientes={solicitudesCount.count ?? 0}
        engagement={engagement}
      />
    );
  }

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

  // Tiempo real dedicado (segundos_dedicados) y racha de días activos
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: progresoRaw } = await (supabase as any)
    .from("progreso_lecciones")
    .select("segundos_dedicados, ultima_vista")
    .eq("alumno_id", user.id);
  const progreso = (progresoRaw as { segundos_dedicados: number | null; ultima_vista: string | null }[] | null) ?? [];

  const horasEstudiadas = Math.round(progreso.reduce((acc, p) => acc + (p.segundos_dedicados ?? 0), 0) / 3600);

  const diasActivos = new Set(
    progreso.filter((p) => p.ultima_vista).map((p) => new Date(p.ultima_vista as string).toISOString().slice(0, 10))
  );
  let racha_dias = 0;
  for (const d = new Date(); ; d.setDate(d.getDate() - 1)) {
    if (diasActivos.has(d.toISOString().slice(0, 10))) racha_dias++;
    else break;
  }

  return (
    <DashboardClient
      user={{ nombre, email: user.email!, rol, avatar_initials }}
      cursosActivos={cursosActivos}
      stats={{
        cursos_inscritos: totalInscritos,
        cursos_completados: completados ?? 0,
        horas_estudiadas: horasEstudiadas,
        racha_dias,
      }}
    />
  );
}
