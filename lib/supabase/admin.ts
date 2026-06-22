/**
 * Supabase – cliente con Service Role (server-only, NUNCA importar desde código de cliente)
 *
 * Se usa para escribir/leer las tablas de analítica propia (analytics_pageviews,
 * analytics_consent_events), que tienen RLS habilitado sin policies públicas.
 * El service role key ignora RLS, por eso este cliente solo debe usarse dentro de
 * API routes (`app/api/**`) o código server-side, jamás expuesto al navegador.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export function isSupabaseAdminConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createAdminClient() {
  if (!isSupabaseAdminConfigured()) return null;
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
