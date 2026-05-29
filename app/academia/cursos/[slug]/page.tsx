/**
 * Academia CRC – Detalle de curso (premium redesign)
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { CursoPageClient } from "../../_components/CursoPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isSupabaseConfigured()) return { title: slug };

  const supabase = await createClient();
  if (!supabase) return { title: slug };

  const { data: metadataData } = await supabase
    .from("cursos")
    .select("titulo, descripcion_corta, imagen_url")
    .eq("slug", slug)
    .single();
  const data = metadataData as { titulo: string; descripcion_corta: string | null; imagen_url: string | null } | null;

  return {
    title: data?.titulo ?? slug,
    description: data?.descripcion_corta ?? undefined,
    openGraph: data?.imagen_url ? { images: [{ url: data.imagen_url }] } : undefined,
  };
}

export default async function CursoPage({ params }: Props) {
  const { slug } = await params;

  // Sin Supabase: mostrar placeholder en vez de crashear
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5">
        <div
          className="w-full max-w-md p-10 text-center"
          style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border-md)", borderRadius: "8px" }}
        >
          <p className="text-lg font-semibold" style={{ color: "var(--ac-text-2)" }}>
            Curso <span style={{ color: "var(--ac-gold)" }}>{slug}</span>
          </p>
          <p className="mt-3 text-sm" style={{ color: "var(--ac-text-3)" }}>
            Configura Supabase para ver el contenido completo del curso.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  if (!supabase) notFound();

  const { data: rawData } = await supabase
    .from("cursos")
    .select(`
      id, titulo, descripcion, descripcion_corta, imagen_url,
      precio, moneda, nivel, duracion_horas, categoria,
      profiles (nombre, apellido, bio, avatar_url)
    `)
    .eq("slug", slug)
    .eq("estado", "publicado")
    .single();
  const raw = rawData as {
    id: string;
    titulo: string;
    descripcion: string | null;
    descripcion_corta: string | null;
    imagen_url: string | null;
    precio: number | string | null;
    moneda: string;
    nivel: string | null;
    duracion_horas: number | null;
    categoria: string | null;
    profiles: { nombre: string | null; apellido: string | null; bio: string | null; avatar_url: string | null } | { nombre: string | null; apellido: string | null; bio: string | null; avatar_url: string | null }[] | null;
  } | null;

  if (!raw) notFound();

  const curso = {
    id: raw.id,
    titulo: raw.titulo,
    descripcion: raw.descripcion,
    descripcion_corta: raw.descripcion_corta,
    imagen_url: raw.imagen_url,
    precio: Number(raw.precio),
    moneda: raw.moneda,
    nivel: raw.nivel,
    duracion_horas: raw.duracion_horas,
    categoria: raw.categoria,
  };

  const profesor = (Array.isArray(raw.profiles) ? raw.profiles[0] : raw.profiles) as {
    nombre: string | null; apellido: string | null; bio: string | null; avatar_url: string | null;
  } | null;

  const { data: { user } } = await supabase.auth.getUser();

  let inscrito = false;
  if (user) {
    const { data: ins } = await supabase
      .from("inscripciones")
      .select("id")
      .eq("alumno_id", user.id)
      .eq("curso_id", raw.id)
      .eq("estado", "activa")
      .maybeSingle();
    inscrito = !!ins;
  }

  const { data: modulosData } = await supabase
    .from("modulos")
    .select(`
      id, titulo, orden,
      lecciones (id, titulo, tipo, video_duracion_seg, es_preview, orden)
    `)
    .eq("curso_id", raw.id)
    .order("orden");
  const modulosRaw = modulosData as Array<{
    id: string;
    titulo: string;
    orden: number;
    lecciones: {
      id: string;
      titulo: string;
      tipo: string;
      video_duracion_seg: number | null;
      es_preview: boolean;
      orden: number;
    }[];
  }> | null;

  const modulos = (modulosRaw ?? []).map((m) => ({
    id: m.id,
    titulo: m.titulo,
    orden: m.orden,
    lecciones: m.lecciones as unknown as {
      id: string; titulo: string; tipo: string;
      video_duracion_seg: number | null; es_preview: boolean; orden: number;
    }[],
  }));

  return (
    <CursoPageClient
      curso={curso}
      profesor={profesor}
      modulos={modulos}
      inscrito={inscrito}
      userId={user?.id ?? null}
      slug={slug}
    />
  );
}
