/**
 * Academia CRC – Visor de lección (aula)
 * /academia/cursos/[slug]/leccion/[leccionId]
 *
 * Lectura en línea con 3 modos: diapositivas, PDF y texto accesible.
 * Acceso: lecciones preview son públicas; el resto requiere inscripción activa.
 */
import { notFound, redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { LeccionViewer } from "../../../../_components/LeccionViewer";
import type { Leccion } from "@/lib/supabase/database.types";

interface Props {
  params: Promise<{ slug: string; leccionId: string }>;
}

type LecMini = {
  id: string;
  titulo: string;
  tipo: string;
  es_preview: boolean;
  orden: number;
};
type ModTree = { id: string; titulo: string; orden: number; lecciones: LecMini[] };

export default async function LeccionPage({ params }: Props) {
  const { slug, leccionId } = await params;

  if (!isSupabaseConfigured()) notFound();
  const supabase = await createClient();
  if (!supabase) notFound();

  // Curso
  const { data: cursoRaw } = await supabase
    .from("cursos")
    .select("id, titulo, slug")
    .eq("slug", slug)
    .eq("estado", "publicado")
    .single();
  const curso = cursoRaw as { id: string; titulo: string; slug: string } | null;
  if (!curso) notFound();

  // Lección actual
  const { data: lecRaw } = await supabase
    .from("lecciones")
    .select("id, modulo_id, curso_id, titulo, descripcion, tipo, contenido, recurso_url, es_preview, orden")
    .eq("id", leccionId)
    .eq("curso_id", curso.id)
    .single();
  const leccion = lecRaw as Pick<
    Leccion,
    "id" | "modulo_id" | "curso_id" | "titulo" | "descripcion" | "tipo" | "contenido" | "recurso_url" | "es_preview" | "orden"
  > | null;
  if (!leccion) notFound();

  // Usuario + inscripción
  const { data: { user } } = await supabase.auth.getUser();
  let inscrito = false;
  if (user) {
    const { data: ins } = await supabase
      .from("inscripciones")
      .select("id")
      .eq("alumno_id", user.id)
      .eq("curso_id", curso.id)
      .eq("estado", "activa")
      .maybeSingle();
    inscrito = !!ins;
  }

  const tieneAcceso = leccion.es_preview || inscrito;
  if (!tieneAcceso) {
    redirect(`/academia/cursos/${slug}?bloqueada=${leccionId}`);
  }

  // Árbol de módulos/lecciones para el panel lateral (temario completo desde la
  // vista pública de metadatos, sin exponer contenido de lecciones bloqueadas).
  const { data: modulosData } = await supabase
    .from("modulos")
    .select("id, titulo, orden")
    .eq("curso_id", curso.id)
    .order("orden");
  const modsRaw = (modulosData as Array<{ id: string; titulo: string; orden: number }> | null) ?? [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: lecData } = await (supabase as any)
    .from("lecciones_meta")
    .select("id, modulo_id, titulo, tipo, es_preview, orden")
    .eq("curso_id", curso.id)
    .order("orden");
  const lecMeta = (lecData as Array<LecMini & { modulo_id: string }> | null) ?? [];

  const modulos: ModTree[] = modsRaw.map((m) => ({
    id: m.id,
    titulo: m.titulo,
    orden: m.orden,
    lecciones: lecMeta
      .filter((l) => l.modulo_id === m.id)
      .map(({ id, titulo, tipo, es_preview, orden }) => ({ id, titulo, tipo, es_preview, orden }))
      .sort((a, b) => a.orden - b.orden),
  }));

  // Progreso del alumno (para marcar completadas en el panel)
  let completadas: string[] = [];
  if (user) {
    const { data: prog } = await supabase
      .from("progreso_lecciones")
      .select("leccion_id, completada")
      .eq("alumno_id", user.id)
      .eq("curso_id", curso.id);
    completadas = ((prog as { leccion_id: string; completada: boolean }[] | null) ?? [])
      .filter((p) => p.completada)
      .map((p) => p.leccion_id);
  }

  // Orden plano para prev / next
  const flat = modulos.flatMap((m) => m.lecciones.map((l) => l.id));
  const idx = flat.indexOf(leccion.id);
  const prevId = idx > 0 ? flat[idx - 1] : null;
  const nextId = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  return (
    <LeccionViewer
      cursoSlug={slug}
      cursoTitulo={curso.titulo}
      cursoId={curso.id}
      leccion={leccion}
      modulos={modulos}
      inscrito={inscrito}
      userId={user?.id ?? null}
      completadasInit={completadas}
      prevId={prevId}
      nextId={nextId}
    />
  );
}

export const dynamic = "force-dynamic";
