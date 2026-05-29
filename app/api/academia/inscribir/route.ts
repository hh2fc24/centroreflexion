/**
 * API Route: inscribir alumno en un curso
 * POST /api/academia/inscribir
 */
import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Curso, Inscripcion } from "@/lib/supabase/database.types";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 503 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no disponible" }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const formData = await request.formData();
  const curso_id = formData.get("curso_id") as string | null;

  if (!curso_id) {
    return NextResponse.json({ error: "curso_id requerido" }, { status: 400 });
  }

  const { data: cursoRaw } = await supabase
    .from("cursos")
    .select("id, precio")
    .eq("id", curso_id)
    .eq("estado", "publicado")
    .single();
  const curso = cursoRaw as Pick<Curso, "id" | "precio"> | null;

  if (!curso) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }

  const { data: existingRaw } = await supabase
    .from("inscripciones")
    .select("id")
    .eq("alumno_id", user.id)
    .eq("curso_id", curso_id)
    .maybeSingle();
  const existing = existingRaw as Pick<Inscripcion, "id"> | null;

  if (existing) {
    return NextResponse.redirect(new URL("/academia/mis-cursos", request.url), 303);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("inscripciones")
    .insert({
      alumno_id: user.id,
      curso_id,
      monto_pagado: Number(curso.precio) === 0 ? 0 : null,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/academia/mis-cursos", request.url), 303);
}
