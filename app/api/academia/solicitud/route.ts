/**
 * API: gestión de solicitudes de inscripción (admin)
 * POST /api/academia/solicitud   { inscripcion_id, accion: 'activar' | 'rechazar' }
 */
import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 503 });
  }
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase no disponible" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: profileRaw } = await supabase.from("profiles").select("rol").eq("id", user.id).single();
  const profile = profileRaw as { rol: string } | null;
  if (!profile || profile.rol !== "admin") {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  const formData = await request.formData();
  const inscripcion_id = formData.get("inscripcion_id") as string | null;
  const accion = formData.get("accion") as string | null;
  if (!inscripcion_id || !accion) {
    return NextResponse.json({ error: "Parámetros faltantes" }, { status: 400 });
  }

  const patch =
    accion === "activar"
      ? {
          estado: "activa",
          activada_por: user.id,
          fecha_activacion: new Date().toISOString(),
        }
      : accion === "rechazar"
        ? { estado: "cancelada", activada_por: user.id, fecha_activacion: new Date().toISOString() }
        : null;

  if (!patch) return NextResponse.json({ error: "Acción inválida" }, { status: 400 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("inscripciones").update(patch).eq("id", inscripcion_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.redirect(new URL("/academia/admin/solicitudes", request.url), 303);
}
