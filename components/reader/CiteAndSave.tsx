"use client";

import { useState } from "react";
import { Check, Copy, FileDown } from "lucide-react";
import { SITE_NAME } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

/**
 * "Cómo citar" en APA 7 y descarga en PDF (impresión del navegador con la
 * hoja de estilos de impresión de globals.css, que deja solo el texto).
 *
 * Una columna citable es lo que separa a un centro de estudios de un blog:
 * docentes y tesistas la pueden llevar a una bibliografía sin rearmarla.
 */

const MESES: Record<string, string> = {
    ene: "enero", feb: "febrero", mar: "marzo", abr: "abril", may: "mayo", jun: "junio",
    jul: "julio", ago: "agosto", sep: "septiembre", sept: "septiembre", oct: "octubre", nov: "noviembre", dic: "diciembre",
};

/** "08 Feb 2026" → "2026, 8 de febrero". Si no reconoce el formato, deja la fecha tal cual. */
function apaDate(date: string) {
    const m = date.trim().match(/^(\d{1,2})\s+([A-Za-zÁÉÍÓÚáéíóú]+)\.?\s+(\d{4})$/);
    if (!m) return date;
    const mes = MESES[m[2].toLowerCase().slice(0, 4)] ?? MESES[m[2].toLowerCase().slice(0, 3)];
    return mes ? `${m[3]}, ${Number(m[1])} de ${mes}` : `${m[3]}`;
}

/**
 * "Juan Carlos Rauld Farías" → "Rauld Farías, J. C.". Con cuatro palabras o más
 * se toman los dos apellidos (uso chileno); con dos o tres, el último. Si hay
 * varios autores ("y", comas), se deja el texto como viene.
 */
function apaAuthor(author: string) {
    const clean = author.trim();
    if (/,|\sy\s|&/.test(clean)) return clean;
    const words = clean.split(/\s+/);
    if (words.length < 2) return clean;
    const surnameCount = words.length >= 4 ? 2 : 1;
    const surnames = words.slice(-surnameCount).join(" ");
    const initials = words
        .slice(0, -surnameCount)
        .map((w) => `${w.charAt(0).toUpperCase()}.`)
        .join(" ");
    return `${surnames}, ${initials}`;
}

export function CiteAndSave({ author, date, title, path }: { author: string; date: string; title: string; path: string }) {
    const [copied, setCopied] = useState(false);
    const url = `${getSiteUrl()}${path}`;
    const citation = `${apaAuthor(author)} (${apaDate(date)}). ${title}. ${SITE_NAME}. ${url}`;

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(citation);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Sin permiso de portapapeles: el texto queda visible para copiarlo a mano.
        }
    };

    return (
        <section aria-labelledby="como-citar" data-print-hide="" className="mt-12 border-t border-[#d8cfc0] pt-8">
            <h2 id="como-citar" className="text-[0.8125rem] font-semibold text-[#9f5528]">
                Cómo citar esta columna
            </h2>
            <p className="mt-3 rounded-[6px] bg-[#f8f5ee] px-4 py-3 text-[0.9375rem] leading-[1.6] text-[#171713] [overflow-wrap:anywhere]">
                {citation}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                <button
                    type="button"
                    onClick={copy}
                    className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-[6px] transition-colors hover:text-[#9f5528]"
                >
                    {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                    <span aria-live="polite">{copied ? "Cita copiada" : "Copiar cita (APA)"}</span>
                </button>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-[6px] transition-colors hover:text-[#9f5528]"
                >
                    <FileDown className="h-4 w-4" aria-hidden="true" />
                    Descargar en PDF
                </button>
            </div>
        </section>
    );
}
