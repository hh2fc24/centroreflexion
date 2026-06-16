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
      precio, moneda, nivel, duracion_horas, categoria, profesor_id,
      profiles (nombre, apellido, bio, avatar_url)
    `)
    .eq("slug", slug)
    .eq("estado", "publicado")
    .single();
  const raw = rawData as {
    id: string;
    profesor_id: string | null;
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
  const profesorId = raw.profesor_id;

  const { data: { user } } = await supabase.auth.getUser();

  let inscrito = false;
  let estadoInscripcion: string | null = null;
  if (user) {
    const { data: ins } = await supabase
      .from("inscripciones")
      .select("id, estado")
      .eq("alumno_id", user.id)
      .eq("curso_id", raw.id)
      .maybeSingle();
    estadoInscripcion = (ins as { estado: string } | null)?.estado ?? null;
    inscrito = estadoInscripcion === "activa";
  }

  // Módulos + lecciones (temario completo): las lecciones se leen desde la vista
  // pública `lecciones_meta` (solo metadatos, sin contenido ni recurso_url), para
  // mostrar el temario íntegro con candado a visitantes no inscritos.
  const { data: modulosData } = await supabase
    .from("modulos")
    .select("id, titulo, orden")
    .eq("curso_id", raw.id)
    .order("orden");
  const modulosRaw = (modulosData as Array<{ id: string; titulo: string; orden: number }> | null) ?? [];

  type LecMeta = { id: string; modulo_id: string; titulo: string; tipo: string; video_duracion_seg: number | null; es_preview: boolean; orden: number };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: lecData } = await (supabase as any)
    .from("lecciones_meta")
    .select("id, modulo_id, titulo, tipo, video_duracion_seg, es_preview, orden")
    .eq("curso_id", raw.id)
    .order("orden");
  const lecciones = (lecData as LecMeta[] | null) ?? [];

  const modulos = modulosRaw.map((m) => ({
    id: m.id,
    titulo: m.titulo,
    orden: m.orden,
    lecciones: lecciones
      .filter((l) => l.modulo_id === m.id)
      .map((l) => ({
        id: l.id, titulo: l.titulo, tipo: l.tipo,
        video_duracion_seg: l.video_duracion_seg, es_preview: l.es_preview, orden: l.orden,
      })),
  }));

  return (
    <CursoPageClient
      curso={curso}
      profesor={profesor}
      profesorId={profesorId}
      modulos={modulos}
      inscrito={inscrito}
      estadoInscripcion={estadoInscripcion}
      userId={user?.id ?? null}
      slug={slug}
    />
  );
}
