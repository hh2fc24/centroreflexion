/**
 * Academia CRC – Instrucciones de pago / solicitud de inscripción
 * /academia/cursos/[slug]/inscripcion
 */
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { PagoInstrucciones } from "../../../_components/PagoInstrucciones";

interface Props { params: Promise<{ slug: string }> }

export default async function InscripcionPage({ params }: Props) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) redirect(`/academia/cursos/${slug}`);
  const supabase = await createClient();
  if (!supabase) redirect(`/academia/cursos/${slug}`);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/academia/login?redirect=/academia/cursos/${slug}/inscripcion`);

  const { data: cursoRaw } = await supabase
    .from("cursos")
    .select("id, titulo, precio, moneda")
    .eq("slug", slug)
    .eq("estado", "publicado")
    .single();
  const curso = cursoRaw as { id: string; titulo: string; precio: number | string; moneda: string } | null;
  if (!curso) redirect("/academia");

  const { data: insRaw } = await supabase
    .from("inscripciones")
    .select("id, estado")
    .eq("alumno_id", user.id)
    .eq("curso_id", curso.id)
    .maybeSingle();
  const ins = insRaw as { id: string; estado: string } | null;

  if (!ins) redirect(`/academia/cursos/${slug}`);
  if (ins.estado === "activa") redirect("/academia/mis-cursos");

  return (
    <PagoInstrucciones
      cursoTitulo={curso.titulo}
      cursoSlug={slug}
      precio={Number(curso.precio)}
      moneda={curso.moneda}
      estado={ins.estado}
      email={user.email ?? ""}
    />
  );
}

export const dynamic = "force-dynamic";
