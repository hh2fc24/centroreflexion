/**
 * Clases compartidas por /instituciones, /servicios y sus subpáginas.
 * Siguen docs/design-system-crc.md: la paleta no cambia; la escala tipográfica,
 * las etiquetas en tipo oración, los botones y el radio único de 6px sí.
 */

export const container = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8";

/** Etiqueta pequeña en tipo oración (reemplaza el eyebrow en mayúsculas). */
export const label = "text-[0.8125rem] font-semibold text-[#9f5528]";
export const labelOnDark = "text-[0.8125rem] font-semibold text-[#e4935d]";
export const labelMuted = "text-[0.8125rem] font-semibold text-[#6f675d]";

export const h1 =
    "crc-serif text-[clamp(2rem,3.2vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] text-balance";
export const h2 =
    "crc-serif text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-balance";
export const h3 = "crc-serif text-[1.35rem] font-medium leading-[1.2] tracking-[-0.01em]";

export const lead = "text-[1.0625rem] leading-[1.7] text-[#55574f]";
export const body = "text-[1rem] leading-[1.7] text-[#55574f]";

const btnBase =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] px-5 py-2.5 text-[0.9375rem] font-semibold transition-[color,background-color,border-color,transform] duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

export const btnPrimary = `${btnBase} bg-[#bd6f3c] text-white hover:bg-[#a85f31] focus-visible:ring-[#171713] focus-visible:ring-offset-[#fffdf8]`;
export const btnPrimaryOnDark = `${btnBase} bg-[#bd6f3c] text-white hover:bg-[#a85f31] focus-visible:ring-[#fbf7ee] focus-visible:ring-offset-[#15120e]`;
export const btnSecondary = `${btnBase} border border-[#171713] text-[#171713] hover:border-[#9f5528] hover:text-[#9f5528] focus-visible:ring-[#171713]`;
export const btnSecondaryOnDark = `${btnBase} border border-[#fbf7ee]/60 text-[#fbf7ee] hover:border-[#e4935d] hover:text-[#e4935d] focus-visible:ring-[#fbf7ee] focus-visible:ring-offset-[#15120e]`;

/** Link de texto subrayado (acción secundaria). */
export const textLink =
    "inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-[#9f5528] underline decoration-[#d8cfc0] underline-offset-4 transition-colors hover:text-[#171713] hover:decoration-[#9f5528]";

export const rule = "border-t border-[#d8cfc0]";
