"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ConsentStatus = "pending" | "accepted" | "rejected";

interface CookieConsentState {
  status: ConsentStatus;
  accept: () => void;
  reject: () => void;
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
      accept: () => set({ status: "accepted" }),
      reject: () => set({ status: "rejected" }),
    }),
    { name: "crc-cookie-consent" }
  )
);
