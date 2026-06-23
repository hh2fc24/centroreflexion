"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useCookieConsent } from "@/lib/cookieConsent";

export function CookieConsentBanner() {
  const { status, accept, reject } = useCookieConsent();
  const hydrated = useSyncExternalStore(
    (onStoreChange) => useCookieConsent.persist.onFinishHydration(onStoreChange),
    () => useCookieConsent.persist.hasHydrated(),
    () => false
  );

  if (!hydrated || status !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimiento de cookies"
      className="fixed left-1/2 top-[calc(env(safe-area-inset-top)+0.75rem)] z-[110] w-[min(calc(100vw-1.5rem),760px)] -translate-x-1/2 rounded-[8px] border border-[rgba(193,127,62,0.28)] bg-[#171713]/95 px-3 py-2.5 shadow-[0_10px_28px_rgba(0,0,0,0.26)] backdrop-blur-md sm:px-4"
    >
      <div className="flex flex-col items-center gap-2.5 sm:flex-row sm:justify-between">
        <p className="text-center text-[11px] leading-5 text-[#cfc6b8] sm:text-left sm:text-xs">
          Usamos cookies para medir tráfico y mejorar la experiencia. El sitio funciona igual si las rechazas.{" "}
          <Link href="/contacto" className="underline hover:text-white">
            Más información
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-[5px] border border-[rgba(193,127,62,0.35)] px-3 py-1.5 text-[11px] font-medium text-[#a99f91] transition-colors hover:border-[#bd6f3c] hover:text-white"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-[5px] bg-[#bd6f3c] px-3 py-1.5 text-[11px] font-semibold text-[#171713] transition-opacity hover:opacity-90"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
