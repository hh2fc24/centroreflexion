/**
 * Callback OAuth / confirmación de email de Supabase Auth
 */
import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/academia/dashboard";

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/academia`);
  }

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/academia/login?error=callback_error`);
}
