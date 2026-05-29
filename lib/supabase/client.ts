/**
 * Supabase – cliente para el navegador (Client Components)
 *
 * Retorna `null` si las variables de entorno no están configuradas,
 * permitiendo que los componentes muestren estados vacíos durante el desarrollo.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function createClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
