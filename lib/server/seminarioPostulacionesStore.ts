/**
 * Almacenamiento durable de las postulaciones al seminario "Desprotección de la
 * Infancia" (cohorte 1, oct–dic 2026) en Supabase.
 *
 * Misma decisión que en `desproteccionRegistrationsStore.ts`: en Vercel el
 * sistema de archivos es efímero y no compartido entre invocaciones
 * serverless, así que el archivo JSON local no sirve como fuente de verdad.
 * Supabase lo es; el leads store local queda solo como espejo best-effort.
 */
import { createClient } from "@supabase/supabase-js";
import type { StoredLead } from "@/lib/server/leadsStore";

const TABLE = "seminario_postulaciones";

export const SEMINARIO_SOURCE = "seminario-desproteccion-infancia";
export const SEMINARIO_FORM_ID = "seminario-desproteccion-postulacion";

export type SeminarioPostulacionRow = {
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

export async function insertSeminarioPostulacion(lead: StoredLead): Promise<void> {
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

export async function listSeminarioPostulaciones(): Promise<SeminarioPostulacionRow[]> {
  const supabase = getClient();
  if (!supabase) throw new Error("supabase_not_configured");

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) throw new Error(error.message);
  return (data ?? []) as SeminarioPostulacionRow[];
}
