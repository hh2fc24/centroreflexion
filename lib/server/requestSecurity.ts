import { NextResponse } from "next/server";

function normalizeOrigin(input: string | null) {
  if (!input) return null;
  try {
    return new URL(input).origin;
  } catch {
    return null;
  }
}

function getExpectedOrigin(req: Request) {
  const url = new URL(req.url);
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || req.headers.get("host") || url.host;
  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || url.protocol.replace(/:$/, "");
  return `${protocol}://${host}`;
}

export function requireTrustedOrigin(req: Request, { allowMissingOrigin = true }: { allowMissingOrigin?: boolean } = {}) {
  const expectedOrigin = getExpectedOrigin(req);
  const origin = normalizeOrigin(req.headers.get("origin"));
  const referer = normalizeOrigin(req.headers.get("referer"));
  const secFetchSite = (req.headers.get("sec-fetch-site") || "").toLowerCase();

  if (secFetchSite && !["same-origin", "same-site", "none"].includes(secFetchSite)) {
    return NextResponse.json({ ok: false, error: "invalid_origin" }, { status: 403 });
  }

  const requestOrigin = origin || referer;
  if (!requestOrigin) {
    if (allowMissingOrigin) return null;
    return NextResponse.json({ ok: false, error: "missing_origin" }, { status: 403 });
  }

  if (requestOrigin !== expectedOrigin) {
    return NextResponse.json({ ok: false, error: "invalid_origin" }, { status: 403 });
  }

  return null;
}
