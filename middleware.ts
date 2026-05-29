import { NextResponse, type NextRequest } from "next/server";
import publishedContent from "@/lib/editor/published-content.json";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

type RedirectRule = {
  from: string;
  to: string;
  permanent: boolean;
  enabled: boolean;
};

function normalize(pathname: string) {
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  if (pathname !== "/" && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
  return pathname;
}

// Rutas de Academia que requieren autenticación
const ACADEMIA_PROTECTED = [
  "/academia/dashboard",
  "/academia/mis-cursos",
  "/academia/admin",
  "/academia/profesor",
];

// Rutas de Academia que requieren un rol específico
const ROLE_PROTECTED: Record<string, string[]> = {
  "/academia/admin":    ["admin"],
  "/academia/profesor": ["admin", "profesor"],
};

export async function middleware(req: NextRequest) {
  const pathname = normalize(req.nextUrl.pathname);

  // ── 1. Redireccionamientos del CMS ──────────────────────
  const redirects = (
    ((publishedContent as unknown as { redirects?: RedirectRule[] }).redirects ?? []) as RedirectRule[]
  );
  for (const r of redirects) {
    if (!r?.enabled) continue;
    if (normalize(r.from) !== pathname) continue;
    if (r.to.startsWith("http://") || r.to.startsWith("https://")) {
      return NextResponse.redirect(r.to, r.permanent ? 308 : 307);
    }
    const url = req.nextUrl.clone();
    url.pathname = normalize(r.to);
    return NextResponse.redirect(url, r.permanent ? 308 : 307);
  }

  // ── 2. Rutas de Academia: refrescar sesión Supabase ─────
  if (pathname.startsWith("/academia")) {
    // Sólo procesar si las vars de entorno están configuradas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const { supabaseResponse, user } = await updateSupabaseSession(req);

      const isProtected = ACADEMIA_PROTECTED.some((p) => pathname.startsWith(p));

      if (isProtected && !user) {
        // No autenticado → redirigir al login de Academia
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/academia/login";
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Verificar restricciones por rol
      for (const [prefix, allowedRoles] of Object.entries(ROLE_PROTECTED)) {
        if (pathname.startsWith(prefix) && user) {
          // El rol se lee del token JWT (app_metadata) para evitar una query extra
          const role = (user.app_metadata?.role ?? user.user_metadata?.rol ?? "alumno") as string;
          if (!allowedRoles.includes(role)) {
            const url = req.nextUrl.clone();
            url.pathname = "/academia/dashboard";
            return NextResponse.redirect(url);
          }
        }
      }

      return supabaseResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|admin/|favicon.ico).*)"],
};
