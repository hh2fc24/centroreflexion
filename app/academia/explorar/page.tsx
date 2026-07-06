/**
 * Academia CRC – Catálogo privado (alumnos autenticados)
 * /academia/explorar — Área cerrada: solo la grilla de cursos para inscribirse.
 * Sin hero de marketing, stats ni CTA de "crear cuenta".
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Curso, Profile } from "@/lib/supabase/database.types";
import { CatalogoCursos } from "../_components/CatalogoCursos";

export const metadata: Metadata = {
  title: "Explorar cursos | Academia CRC",
  description: "Catálogo de cursos disponibles para tu inscripción.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type CursoRow = Pick<
  Curso,
  "id" | "slug" | "titulo" | "descripcion_corta" | "imagen_url" | "precio" | "moneda" | "nivel" | "duracion_horas" | "categoria"
> & {
  profiles: Pick<Profile, "nombre" | "apellido"> | Pick<Profile, "nombre" | "apellido">[] | null;
};

export default async function ExplorarPage() {
  // Área privada: exige sesión iniciada.
  if (!isSupabaseConfigured()) redirect("/academia");
  const supabase = await createClient();
  if (!supabase) redirect("/academia");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/academia/login?redirect=/academia/explorar");

  const cursos = await supabase
    .from("cursos")
    .select(`
      id, slug, titulo, descripcion_corta, imagen_url,
      precio, moneda, nivel, duracion_horas, categoria,
      profiles (nombre, apellido)
    `)
    .eq("estado", "publicado")
    .order("created_at", { ascending: false })
    .then(({ data }) =>
      (data as CursoRow[] | null ?? []).map((c) => ({
        ...c,
        precio: Number(c.precio),
        profesor: Array.isArray(c.profiles) ? c.profiles[0] : c.profiles,
        profiles: undefined,
      }))
    );

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
      {/* Encabezado sobrio del área privada */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="crc-eyebrow" style={{ color: "var(--ac-gold)" }}>
            Área de estudiante
          </span>
          <h1
            className="mt-3"
            style={{
              fontFamily: "var(--font-cormorant, Georgia, serif)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--ac-text)",
            }}
          >
            Explorar cursos
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: "var(--ac-text-2)" }}>
            Elige un curso para ver el detalle e inscribirte. Tus inscripciones activas están en{" "}
            <Link href="/academia/mis-cursos" style={{ color: "var(--ac-gold)" }}>
              Mis cursos
            </Link>
            .
          </p>
        </div>

        <Link
          href="/academia/mis-cursos"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] ac-btn-ghost"
          style={{ borderRadius: "5px" }}
        >
          Mis cursos <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <CatalogoCursos cursos={cursos as Parameters<typeof CatalogoCursos>[0]["cursos"]} />
    </div>
  );
}
