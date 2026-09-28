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

  // Abajo y compacto para no tapar la navegación. En móvil deja libre la
  // esquina inferior derecha, donde vive el botón de WhatsApp.
  return (
    <div
      role="dialog"
      aria-label="Consentimiento de cookies"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] left-3 right-[4.75rem] z-[110] rounded-[6px] border border-white/15 bg-[#15120e] px-3.5 py-3 sm:bottom-6 sm:left-1/2 sm:right-auto sm:w-[min(calc(100vw-12rem),600px)] sm:-translate-x-1/2 sm:px-4"
    >
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-[0.8125rem] leading-5 text-[#ede7dc]/85">
          Usamos cookies para medir tráfico y mejorar la experiencia. El sitio funciona igual si las rechazas.{" "}
          <Link href="/contacto" className="underline underline-offset-2 hover:text-white">
            Más información
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-[6px] border border-white/25 px-3 py-1.5 text-[0.8125rem] font-semibold text-[#ede7dc] transition-colors hover:border-white/60 hover:text-white"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-[6px] bg-[#bd6f3c] px-3 py-1.5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-[#a85f31]"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
