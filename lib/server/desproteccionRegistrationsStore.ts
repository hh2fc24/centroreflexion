/**
 * Almacenamiento durable de las inscripciones al conversatorio "Desprotección y
 * sufrimiento de la infancia en Chile" en Supabase.
 *
 * Por qué esto existe: las inscripciones se guardaban antes solo en un archivo
 * JSON local (`lib/server/leadsStore.ts`). En producción (Vercel) el sistema de
 * archivos no es compartido ni persistente entre invocaciones serverless: una
 * inscripción podía escribirse en el disco efímero de una instancia y nunca
 * aparecer cuando otra instancia (u otro request) leía el archivo. Resultado:
 * gente se inscribía con éxito pero no aparecía en el panel de admin. Supabase
 * es la única fuente de verdad para este evento — sin esto, no hay garantía
 * real de que una inscripción quede registrada.
 */
import { createClient } from "@supabase/supabase-js";
import type { StoredLead } from "@/lib/server/leadsStore";

const TABLE = "desproteccion_inscripciones";

export type DesproteccionRegistrationRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  page: string | null;
  fields: Record<string, unknown> | null;
};

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function insertDesproteccionRegistration(lead: StoredLead): Promise<void> {
  const supabase = getClient();
  if (!supabase) throw new Error("supabase_not_configured");

  const { error } = await supabase.from(TABLE).upsert(
    {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone ?? null,
      message: lead.message ?? null,
      page: lead.page ?? null,
      fields: lead.fields ?? null,
      created_at: new Date(lead.createdAt || Date.now()).toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) throw new Error(error.message);
}

export async function listDesproteccionRegistrations(): Promise<DesproteccionRegistrationRow[]> {
  const supabase = getClient();
  if (!supabase) throw new Error("supabase_not_configured");

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) throw new Error(error.message);
  return (data ?? []) as DesproteccionRegistrationRow[];
}
