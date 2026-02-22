import { NextResponse, type NextRequest } from "next/server";
import publishedContent from "@/lib/editor/published-content.json";

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

export function middleware(req: NextRequest) {
  const pathname = normalize(req.nextUrl.pathname);
  const redirects = (((publishedContent as unknown as { redirects?: RedirectRule[] }).redirects ?? []) as RedirectRule[]);
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
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|admin/|favicon.ico).*)"],
};
