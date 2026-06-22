"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCookieConsent } from "@/lib/cookieConsent";

export function CookieConsentBanner() {
  const { status, accept, reject } = useCookieConsent();
  const [mounted, setMounted] = useState(false);

  // Evita parpadeo por hidratación: solo se muestra una vez el store
  // ya leyó el valor persistido en localStorage.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimiento de cookies"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-[rgba(193,127,62,0.3)] bg-[#171713] px-4 py-5 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-center text-sm leading-relaxed text-[#cfc6b8] sm:text-left">
          Usamos cookies para medir el tráfico del sitio y mejorar tu experiencia. Puedes aceptarlas o
          rechazarlas; el sitio funciona igual en ambos casos.{" "}
          <Link href="/contacto" className="underline hover:text-white">
            Más información
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={reject}
            className="rounded-md border border-[rgba(193,127,62,0.35)] px-4 py-2 text-sm font-medium text-[#a99f91] transition-colors hover:border-[#bd6f3c] hover:text-white"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-md bg-[#bd6f3c] px-4 py-2 text-sm font-semibold text-[#171713] transition-opacity hover:opacity-90"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
