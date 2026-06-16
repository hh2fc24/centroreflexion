/**
 * Academia CRC – Perfil público del profesor
 * /academia/profesores/[id]
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, GraduationCap, Quote, Sparkles } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { PROFESORES_EXTRA } from "@/lib/academia/profesores";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!isSupabaseConfigured()) return { title: "Profesor" };
  const supabase = await createClient();
  if (!supabase) return { title: "Profesor" };
  const { data } = await supabase.from("profiles").select("nombre, apellido, bio").eq("id", id).single();
  const p = data as { nombre: string | null; apellido: string | null; bio: string | null } | null;
  const nombre = [p?.nombre, p?.apellido].filter(Boolean).join(" ") || "Profesor";
  return { title: `${nombre} | Academia CRC`, description: p?.bio ?? undefined };
}

export default async function ProfesorPage({ params }: Props) {
  const { id } = await params;
  if (!isSupabaseConfigured()) notFound();
  const supabase = await createClient();
  if (!supabase) notFound();

  const { data: profRaw } = await supabase
    .from("profiles")
    .select("id, email, nombre, apellido, bio, avatar_url, rol")
    .eq("id", id)
    .single();
  const prof = profRaw as {
    id: string; email: string; nombre: string | null; apellido: string | null;
    bio: string | null; avatar_url: string | null; rol: string;
  } | null;
  if (!prof || (prof.rol !== "profesor" && prof.rol !== "admin")) notFound();

  const { data: cursosRaw } = await supabase
    .from("cursos")
    .select("id, slug, titulo, descripcion_corta, imagen_url, nivel, categoria")
    .eq("profesor_id", id)
    .eq("estado", "publicado")
    .order("created_at", { ascending: false });
  const cursos = (cursosRaw as Array<{
    id: string; slug: string; titulo: string; descripcion_corta: string | null;
    imagen_url: string | null; nivel: string | null; categoria: string | null;
  }> | null) ?? [];

  const nombre = [prof.nombre, prof.apellido].filter(Boolean).join(" ") || "Profesor";
  const iniciales = [prof.nombre, prof.apellido].filter(Boolean).map((n) => n![0]).join("").slice(0, 2).toUpperCase() || "PR";
  const extra = PROFESORES_EXTRA[prof.email];

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <Link href="/academia" className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--ac-text-3)" }}>
        ← Academia CRC
      </Link>

      {/* ── Cabecera ── */}
      <header className="mt-8 grid gap-8 sm:grid-cols-[160px_1fr] sm:items-start">
        <div
          className="flex h-40 w-40 items-center justify-center overflow-hidden"
          style={{
            borderRadius: "14px",
            background: "var(--ac-gold-dim)",
            border: "1px solid var(--ac-border-gold)",
            boxShadow: "0 0 40px rgba(212,168,67,0.12)",
          }}
        >
          {prof.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={prof.avatar_url} alt={nombre} className="h-full w-full object-cover" />
          ) : (
            <span style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "3rem", fontWeight: 700, color: "var(--ac-gold-light)" }}>
              {iniciales}
            </span>
          )}
        </div>

        <div>
          <span className="crc-eyebrow" style={{ color: "var(--ac-gold)" }}>Profesor</span>
          <h1
            className="mt-2"
            style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontSize: "clamp(2.2rem,5vw,3.4rem)", fontWeight: 700, lineHeight: 1, color: "var(--ac-text)" }}
          >
            {nombre}
          </h1>
          {extra?.titulo && <p className="mt-3 text-sm" style={{ color: "var(--ac-text-2)" }}>{extra.titulo}</p>}
          {extra?.temaCentral && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
               style={{ background: "var(--ac-purple-dim)", color: "#b9aef5", border: "1px solid rgba(107,92,231,0.3)" }}>
              <Sparkles className="h-3.5 w-3.5" /> {extra.temaCentral}
            </p>
          )}
        </div>
      </header>

      {/* ── Frase destacada ── */}
      {extra?.fraseDestacada && (
        <blockquote
          className="relative mt-12 overflow-hidden rounded-2xl px-8 py-10"
          style={{ background: "linear-gradient(135deg, var(--ac-surface), var(--ac-surface-2))", border: "1px solid var(--ac-border-md)" }}
        >
          <Quote className="absolute right-6 top-6 h-12 w-12 opacity-10" style={{ color: "var(--ac-gold)" }} />
          <p style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 600, fontStyle: "italic", color: "var(--ac-text)", lineHeight: 1.3 }}>
            “{extra.fraseDestacada}”
          </p>
        </blockquote>
      )}

      {/* ── Bio ── */}
      {prof.bio && (
        <section className="mt-12 max-w-2xl">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>Sobre el profesor</h2>
          <p className="whitespace-pre-wrap text-base leading-relaxed" style={{ color: "var(--ac-text-2)" }}>{prof.bio}</p>
        </section>
      )}

      {/* ── Credenciales ── */}
      {extra?.credenciales?.length ? (
        <section className="mt-12">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>Formación y trayectoria</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {extra.credenciales.map((c) => (
              <li key={c} className="flex items-start gap-3 rounded-xl p-4 text-sm" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)", color: "var(--ac-text-2)" }}>
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--ac-gold)" }} />
                {c}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── Ideas clave ── */}
      {extra?.ideasClave?.length ? (
        <section className="mt-12">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>Ideas clave</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {extra.ideasClave.map((idea, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)" }}>
                <span style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.6rem", fontWeight: 700, color: "var(--ac-gold)" }}>0{i + 1}</span>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ac-text-2)" }}>{idea}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Libros ── */}
      {extra?.libros?.length ? (
        <section className="mt-12">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>Libros publicados</h2>
          <div className="flex flex-col gap-4">
            {extra.libros.map((l) => (
              <div key={l.titulo} className="flex gap-4 rounded-xl p-5" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)" }}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--ac-gold-dim)", border: "1px solid rgba(212,168,67,0.25)" }}>
                  <BookOpen className="h-5 w-5" style={{ color: "var(--ac-gold)" }} />
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-sm font-semibold" style={{ color: "var(--ac-text)" }}>{l.titulo}</h3>
                    <span className="text-xs" style={{ color: "var(--ac-gold)" }}>{l.anio}</span>
                  </div>
                  {l.resena && <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--ac-text-3)" }}>{l.resena}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Cursos que dicta ── */}
      {cursos.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>Cursos en la Academia</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {cursos.map((c) => (
              <Link
                key={c.id}
                href={`/academia/cursos/${c.slug}`}
                className="group overflow-hidden rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: "var(--ac-card)", border: "1px solid var(--ac-border)" }}
              >
                <div className="relative h-36 overflow-hidden" style={{ background: "var(--ac-surface-2)" }}>
                  {c.imagen_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.imagen_url} alt={c.titulo} className="h-full w-full object-cover opacity-85 transition-transform group-hover:scale-105" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-semibold leading-snug" style={{ color: "var(--ac-text)" }}>{c.titulo}</h3>
                  {c.descripcion_corta && <p className="mt-2 line-clamp-2 text-xs" style={{ color: "var(--ac-text-3)" }}>{c.descripcion_corta}</p>}
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--ac-gold)" }}>
                    Ver curso <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
