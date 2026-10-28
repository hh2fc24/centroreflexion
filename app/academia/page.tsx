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
import { DEMO_SLUG_LIKE } from "@/lib/academia/catalogo";
import { SEMINAR_PATH, isSeminarCampaignActive } from "@/components/ColumnCta";

export const metadata: Metadata = pageMetadata({
  title: "Academia CRC | Cursos para profesionales de infancia y salud mental",
  description: "Cursos y seminarios del Centro de Reflexiones Críticas para profesionales que trabajan con infancia, salud mental y protección de derechos.",
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
        .not("slug", "like", DEMO_SLUG_LIKE)
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
          supabase
            .from("cursos")
            .select("id", { count: "exact", head: true })
            .eq("estado", "publicado")
            .not("slug", "like", DEMO_SLUG_LIKE),
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

  const seminarActive = isSeminarCampaignActive();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroAcademia />

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="mb-20">
        <StatsBar stats={stats} />
      </div>

      {/* ── Features ─────────────────────────────────────── */}
      <div className="mb-20">
        <FeaturesSection />
      </div>

      {/* ── Seminario en vivo (fuera del catálogo) ────────── */}
      {/* El seminario no es un curso del catálogo: es en vivo, con cupo cerrado y
          otro precio. Va antes del grid para que no se compare de reojo con los
          cursos asincrónicos, que es de donde salen las dudas de precio. */}
      <section className="mx-auto mb-20 max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <Link
          href={seminarActive ? SEMINAR_PATH : `${SEMINAR_PATH}#postular`}
          className="group grid gap-6 border-y border-[#d8cfc0] py-8 lg:grid-cols-[200px_minmax(0,1fr)_auto] lg:items-center lg:gap-12"
        >
          <p className="text-[0.8125rem] font-semibold text-[#9f5528]">
            {seminarActive ? "Seminario en vivo · Cohorte 1" : "Seminario en vivo · Cohorte 2 en marzo de 2027"}
          </p>
          <div>
            <h2 className="crc-serif text-[clamp(1.35rem,2vw,1.75rem)] font-medium leading-[1.15] text-[#171713] group-hover:text-[#9f5528]">
              Desprotección de la infancia
            </h2>
            <p className="mt-2 max-w-[62ch] text-[0.9375rem] leading-[1.6] text-[#55574f]">
              Ocho sesiones en vivo con Juan Carlos Rauld, autor del libro y Director del CRC, con discusión de casos,
              ensayo final y certificación CRC + Editorial Hammurabi. Formato distinto al de los cursos del catálogo.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[#9f5528]">
            {seminarActive ? "Ver el seminario" : "Postular a la cohorte 2"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </Link>
      </section>

      {/* ── Catálogo de cursos ────────────────────────────── */}
      {/* Sin Supabase (entorno local sin credenciales) no se muestra nada:
          un aviso técnico no debe llegar nunca a la vista pública. */}
      {supabase && (
      <section id="catalogo" className="mx-auto mb-20 max-w-[1240px] scroll-mt-24 px-5 sm:px-8 lg:px-12">
        <div className="mb-12 grid gap-4 lg:grid-cols-2 lg:items-end">
          <h2 className="crc-serif text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713]">
            Cursos disponibles
          </h2>
          <p className="max-w-xs text-sm leading-relaxed lg:ml-auto lg:text-right" style={{ color: "var(--ac-text-3)" }}>
            Cada curso es diseñado y revisado por el equipo académico del Centro de Reflexiones Críticas.
          </p>
        </div>

        <CatalogoCursos cursos={cursos as Parameters<typeof CatalogoCursos>[0]["cursos"]} />
      </section>
      )}

      {/* ── Cierre ───────────────────────────────────────── */}
      <section className="border-t border-[#d8cfc0] bg-[#eee8dc]">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-14 lg:px-12 lg:py-20">
          <div className="max-w-[52ch]">
            <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Para equipos</p>
            <h2 className="crc-serif mt-3 text-balance text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713]">
              ¿Necesitas formar a un equipo completo?
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-[1.7] text-[#55574f]">
              Diseñamos programas de formación y supervisión para colegios, programas de protección, fundaciones y
              municipios, a partir de los casos del propio equipo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/academia/login"
              className="inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31]"
            >
              Crear cuenta gratuita <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/instituciones"
              className="inline-flex min-h-11 items-center text-[0.9375rem] font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-[6px] transition-colors hover:text-[#9f5528]"
            >
              Formación para instituciones
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
