"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ConsentStatus = "pending" | "accepted" | "rejected";

interface CookieConsentState {
  status: ConsentStatus;
  accept: () => void;
  reject: () => void;
}

function reportConsent(choice: "accepted" | "rejected") {
  if (typeof window === "undefined") return;
  try {
    fetch("/api/analytics/consent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ choice, path: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // No bloquear la UI si falla el registro.
  }
}

/**
 * Estado de consentimiento de cookies, persistido en localStorage.
 * Mientras status === "pending", IntegrationsScripts no debe cargar
 * Google Analytics, Google Tag Manager ni Meta Pixel.
 */
export const useCookieConsent = create<CookieConsentState>()(
  persist(
    (set) => ({
      status: "pending",
      accept: () => {
        set({ status: "accepted" });
        reportConsent("accepted");
      },
      reject: () => {
        set({ status: "rejected" });
        reportConsent("rejected");
      },
    }),
    { name: "crc-cookie-consent" }
  )
);
