/**
 * Academia CRC – Mis cursos (alumno)
 * Ruta protegida: /academia/mis-cursos
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function MisCursosPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5">
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: "var(--ac-text-2)" }}>
            Supabase no configurado aún.
          </p>
          <Link href="/academia" className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm ac-btn-ghost">
            Volver al catálogo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  if (!supabase) redirect("/academia");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/academia/login?redirect=/academia/mis-cursos");

  type InscripcionConCurso = {
    id: string;
    estado: string;
    fecha_inscripcion: string;
    cursos: { id: string; slug: string; titulo: string; imagen_url: string | null; descripcion_corta: string | null; nivel: string | null } | null;
  };
  const { data: inscripcionesRaw } = await supabase
    .from("inscripciones")
    .select(`
      id,
      estado,
      fecha_inscripcion,
      cursos (id, slug, titulo, imagen_url, descripcion_corta, nivel)
    `)
    .eq("alumno_id", user.id)
    .eq("estado", "activa")
    .order("fecha_inscripcion", { ascending: false });
  const inscripciones = inscripcionesRaw as InscripcionConCurso[] | null;

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <h1
        style={{
          fontFamily: "var(--font-cormorant, Georgia, serif)",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 700,
          color: "var(--ac-text)",
        }}
      >
        Mis cursos
      </h1>

      {!inscripciones || inscripciones.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <p className="text-lg" style={{ color: "var(--ac-text-2)" }}>
            Aún no estás inscrito en ningún curso.
          </p>
          <Link
            href="/academia"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm ac-btn-gold"
          >
            Explorar catálogo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inscripciones.map((ins) => {
            const curso = ins.cursos;
            if (!curso) return null;
            return (
              <Link
                key={ins.id}
                href={`/academia/cursos/${curso.slug}`}
                className="group ac-card-glass flex flex-col overflow-hidden"
                style={{ borderRadius: "8px" }}
              >
                <div className="relative h-40 overflow-hidden" style={{ background: "var(--ac-card)" }}>
                  {curso.imagen_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={curso.imagen_url}
                      alt={curso.titulo}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full" style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.2), rgba(107,92,231,0.2))" }} />
                  )}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,9,15,0.6) 0%, transparent 60%)" }} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2
                    className="font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-[var(--ac-gold)]"
                    style={{ color: "var(--ac-text)" }}
                  >
                    {curso.titulo}
                  </h2>
                  {curso.descripcion_corta && (
                    <p className="mt-2 line-clamp-2 text-sm" style={{ color: "var(--ac-text-2)" }}>
                      {curso.descripcion_corta}
                    </p>
                  )}
                  <span className="mt-auto pt-3 text-xs capitalize" style={{ color: "var(--ac-text-3)" }}>
                    {curso.nivel ?? "Todos los niveles"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
