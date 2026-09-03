/**
 * Academia CRC – Landing page
 * /academia — Público, sin autenticación
 */
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Curso, Profile } from "@/lib/supabase/database.types";
import { HeroAcademia } from "./_components/HeroAcademia";
import { StatsBar } from "./_components/StatsBar";
import { CatalogoCursos } from "./_components/CatalogoCursos";
import { FeaturesSection } from "./_components/FeaturesSection";
import { WaitlistHero } from "./_components/WaitlistHero";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Academia CRC | Próximamente",
  description: "La academia para mentes críticas abre pronto sus puertas.",
  path: "/academia",
});

export default async function AcademiaPage() {
  const supabase = await createClient();

  // Home público SOLO para visitantes sin sesión.
  // Si el usuario ya inició sesión, su lugar es el entorno privado, no el marketing.
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/academia/dashboard");
  }

  // Si Supabase no está configurado, mostrar catálogo vacío sin crashear
  type CursoRow = Pick<Curso, "id" | "slug" | "titulo" | "descripcion_corta" | "imagen_url" | "precio" | "moneda" | "nivel" | "duracion_horas" | "categoria"> & {
    profiles: Pick<Profile, "nombre" | "apellido"> | Pick<Profile, "nombre" | "apellido">[] | null;
  };

  const cursos = supabase
    ? await supabase
        .from("cursos")
        .select(`
          id, slug, titulo, descripcion_corta, imagen_url,
          precio, moneda, nivel, duracion_horas, categoria,
          profiles (nombre, apellido)
        `)
        .eq("estado", "publicado")
        .order("created_at", { ascending: false })
        .limit(9)
        .then(({ data }) =>
          (data as CursoRow[] | null ?? []).map((c) => ({
            ...c,
            precio: Number(c.precio),
            profesor: Array.isArray(c.profiles) ? c.profiles[0] : c.profiles,
            profiles: undefined,
          }))
        )
    : [];

  // Métricas reales de la barra de estadísticas. Se cuentan aquí (server) para no
  // publicar números inventados: la barra oculta cualquier métrica que esté en 0.
  const stats = supabase
    ? await (async () => {
        const [cursosRes, profesRes, alumnosRes] = await Promise.all([
          supabase.from("cursos").select("id", { count: "exact", head: true }).eq("estado", "publicado"),
          supabase.from("profiles").select("id", { count: "exact", head: true }).eq("rol", "profesor"),
          supabase.from("inscripciones").select("id", { count: "exact", head: true }),
        ]);
        return {
          cursos: cursosRes.count ?? 0,
          profesores: profesRes.count ?? 0,
          alumnos: alumnosRes.count ?? 0,
        };
      })()
    : { cursos: 0, profesores: 0, alumnos: 0 };

  // MODO "PRÓXIMAMENTE" / WAITLIST
  // Lanzado por defecto. Para volver al modo waitlist: NEXT_PUBLIC_ACADEMIA_LAUNCHED=false
  const isLaunched = process.env.NEXT_PUBLIC_ACADEMIA_LAUNCHED !== "false";

  if (!isLaunched) {
    return <WaitlistHero />;
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroAcademia />

      {/* ── Stats ────────────────────────────────────────── */}
      <div style={{ marginBottom: "8rem" }}>
        <StatsBar stats={stats} />
      </div>

      {/* ── Features ─────────────────────────────────────── */}
      <div style={{ marginBottom: "9rem" }}>
        <FeaturesSection />
      </div>

      {/* ── Seminario en vivo (fuera del catálogo) ────────── */}
      {/* El seminario no es un curso del catálogo: es en vivo, con cupo cerrado y
          otro precio. Va antes del grid para que no se compare de reojo con los
          cursos asincrónicos, que es de donde salen las dudas de precio. */}
      <section className="mx-auto mb-24 max-w-7xl px-6 sm:px-10 lg:px-16">
        <Link
          href="/seminarios/desproteccion-infancia"
          className="group grid gap-6 rounded-[12px] p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center"
          style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border-md)" }}
        >
          <div>
            <span className="crc-eyebrow" style={{ color: "var(--ac-gold)" }}>
              Seminario en vivo · Cohorte 1
            </span>
            <h3
              className="mt-3 leading-tight"
              style={{
                fontFamily: "var(--font-cormorant, Georgia, serif)",
                fontSize: "clamp(1.6rem, 2.6vw, 2.3rem)",
                fontWeight: 700,
                color: "var(--ac-text)",
              }}
            >
              Desprotección de la Infancia
            </h3>
            <p className="mt-2.5 max-w-xl text-sm leading-6" style={{ color: "var(--ac-text-2)" }}>
              Ocho sesiones en vivo con Juan Carlos Rauld, autor del libro y Director del CRC. Jueves 19:00, del 15
              de octubre al 3 de diciembre. Cohorte cerrada de 15 personas, con certificación CRC + Editorial
              Hammurabi.
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--ac-text-3)" }}>
              Formato distinto al de los cursos del catálogo: en vivo, con cupo limitado y ensayo final.
            </p>
          </div>
          <span
            className="inline-flex items-center gap-2 px-7 py-3.5 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-gold"
            style={{ borderRadius: "5px" }}
          >
            Ver el seminario <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </section>

      {/* ── Catálogo de cursos ────────────────────────────── */}
      <section id="catalogo" className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16" style={{ marginBottom: "9rem" }}>
        <div className="mb-12 grid gap-4 lg:grid-cols-2 lg:items-end">
          <h2
            style={{
              fontFamily: "var(--font-cormorant, Georgia, serif)",
              fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              color: "var(--ac-text)",
            }}
          >
            Cursos
            <br />
            <span style={{ color: "var(--ac-gold)", fontStyle: "italic" }}>disponibles.</span>
          </h2>
          <p className="max-w-xs text-sm leading-relaxed lg:ml-auto lg:text-right" style={{ color: "var(--ac-text-3)" }}>
            Cada curso es diseñado y revisado por el equipo académico del Centro de Reflexiones Críticas.
          </p>
        </div>

        {!supabase ? (
          // Estado: Supabase no configurado aún
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            style={{ border: "1px dashed var(--ac-border-md)", borderRadius: "8px" }}
          >
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center"
              style={{ background: "var(--ac-gold-dim)", border: "1px solid rgba(212,168,67,0.3)", borderRadius: "8px" }}
            >
              <span style={{ fontSize: "1.5rem" }}>🎓</span>
            </div>
            <p className="text-base font-semibold" style={{ color: "var(--ac-text-2)" }}>
              Los cursos están en camino.
            </p>
            <p className="mt-2 max-w-xs text-sm" style={{ color: "var(--ac-text-3)" }}>
              Configura las credenciales de Supabase para ver el catálogo completo.
            </p>
            <Link
              href="/academia/login"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-ghost"
              style={{ borderRadius: "5px" }}
            >
              Ir al login de prueba <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <CatalogoCursos cursos={cursos as Parameters<typeof CatalogoCursos>[0]["cursos"]} />
        )}
      </section>

      {/* ── CTA Final ────────────────────────────────────── */}
      <section className="relative mx-5 mb-24 overflow-hidden rounded-[12px] px-8 py-20 text-center sm:mx-8">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, var(--ac-surface) 0%, var(--ac-surface-2) 100%)" }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(212,168,67,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, var(--ac-gold), transparent)" }}
        />
        <div
          className="absolute inset-0 rounded-[12px]"
          style={{ border: "1px solid var(--ac-border-md)", pointerEvents: "none" }}
        />

        <div className="relative z-10">
          <span className="crc-eyebrow" style={{ color: "var(--ac-gold)" }}>Empieza hoy</span>
          <h2
            className="mx-auto mt-4 max-w-2xl leading-tight"
            style={{
              fontFamily: "var(--font-cormorant, Georgia, serif)",
              fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
              fontWeight: 700,
              color: "var(--ac-text)",
            }}
          >
            Tu aprendizaje comienza con{" "}
            <span className="ac-text-gradient">un solo paso.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base" style={{ color: "var(--ac-text-2)" }}>
            Únete a la Academia CRC y accede a contenido que transforma la manera en que piensas y ves el mundo.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/academia/login"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-gold ac-glow-gold"
              style={{ borderRadius: "5px" }}
            >
              Crear cuenta gratuita <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#catalogo"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-ghost"
              style={{ borderRadius: "5px" }}
            >
              Ver cursos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
