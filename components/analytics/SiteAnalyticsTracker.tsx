"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";

// Analítica propia: registra cada vista de página en Supabase para tener
// tráfico, países y referrers propios, independiente de si el visitante acepta
// o no las cookies de GA/Meta (que solo aplican a esos scripts de terceros).
//
// Además captura la atribución de marketing (primer y último contacto) en
// almacenamiento propio del sitio —localStorage y la cookie `crc_attr`, solo
// con datos de campaña— para poder adjuntarla a postulaciones, pagos y
// suscripciones. Ver lib/attribution.ts.
export function SiteAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const qs = searchParams?.toString();
    const fullPath = qs ? `${pathname}?${qs}` : pathname;
    if (lastSent.current === fullPath) return;
    lastSent.current = fullPath;

    const { sessionReferrer, newTouch } = captureAttribution();

    const payload = JSON.stringify({
      path: fullPath,
      // Solo en la primera página de la sesión: en navegación SPA
      // document.referrer sigue apuntando al sitio externo de origen y lo
      // contaría en cada página.
      referrer: sessionReferrer,
      utmSource: searchParams?.get("utm_source") || "",
      utmMedium: searchParams?.get("utm_medium") || "",
      utmCampaign: searchParams?.get("utm_campaign") || "",
      language: navigator.language || "",
      viewportWidth: window.innerWidth || undefined,
      ...(newTouch ? { touch: newTouch } : {}),
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/track", blob);
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // No bloquear la navegación si falla el tracking.
    }
  }, [pathname, searchParams]);

  return null;
}
