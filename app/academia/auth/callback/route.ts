/**
 * Callback de Supabase Auth — confirmación de email, magic link, recuperación, OAuth.
 * Soporta los dos formatos de enlace de Supabase:
 *   1) PKCE:        ?code=...                        → exchangeCodeForSession
 *   2) token_hash:  ?token_hash=...&type=signup...   → verifyOtp
 */
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/academia/dashboard";

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/academia`);
  }

  const supabase = await createClient();
  if (supabase) {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    } else if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash });
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/academia/login?error=callback_error`);
}
