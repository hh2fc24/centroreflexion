"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getAttribution } from "@/lib/attribution";
import { WA_MESSAGE_INSTITUTIONAL, whatsAppUrl } from "@/components/WhatsAppButton";

const INSTITUTION_TYPES = [
    "Colegio o sostenedor",
    "Programa de protección (PIE, PRM, PPF, DAM u otro)",
    "OPD u oficina local de niñez",
    "Fundación u ONG",
    "Municipio",
    "Otra",
];

const inputClass =
    "mt-2 block w-full rounded-[6px] border-0 bg-white px-3.5 py-2.5 text-base text-[#171713] shadow-sm ring-1 ring-inset ring-[#cfc4b4] placeholder:text-[#8a8276] focus:ring-2 focus:ring-inset focus:ring-[#bd6f3c] sm:text-sm sm:leading-6";
const labelClass = "block text-sm font-semibold leading-6 text-[#171713]";

function WaGlyph({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
            <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.83.74 5.49 2.03 7.8L.5 31.5l7.93-2.08A15.44 15.44 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 28.22a13.7 13.7 0 0 1-7-1.92l-.5-.3-5.18 1.36 1.38-5.04-.33-.52A13.72 13.72 0 1 1 16 28.72zm7.52-10.28c-.41-.2-2.43-1.2-2.81-1.33-.37-.14-.64-.2-.91.2-.27.4-1.05 1.33-1.28 1.6-.23.27-.47.3-.88.1-.41-.2-1.73-.64-3.3-2.04-1.22-1.09-2.04-2.43-2.28-2.84-.24-.41-.03-.63.18-.83.18-.18.41-.47.61-.7.2-.23.27-.4.41-.67.14-.27.07-.5-.03-.7-.1-.2-.91-2.2-1.25-3.01-.33-.8-.67-.69-.91-.7h-.78c-.27 0-.7.1-1.07.5-.37.4-1.4 1.37-1.4 3.34s1.43 3.87 1.63 4.14c.2.27 2.82 4.3 6.83 6.03.95.41 1.7.66 2.28.84.96.3 1.83.26 2.52.16.77-.11 2.43-1 2.77-1.96.34-.97.34-1.8.24-1.97-.1-.17-.37-.27-.78-.47z" />
        </svg>
    );
}

/** WhatsApp con el mismo número del botón flotante y un mensaje institucional ya escrito. */
export function InstitucionesWhatsAppLink() {
    return (
        <a
            href={whatsAppUrl(WA_MESSAGE_INSTITUTIONAL)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[6px] border border-[#171713] bg-transparent px-5 py-2.5 text-[0.9375rem] font-semibold text-[#171713] transition-colors hover:border-[#9f5528] hover:text-[#9f5528] sm:w-auto"
        >
            <WaGlyph className="h-4 w-4" />
            Escribir por WhatsApp
        </a>
    );
}

// Servicio de origen: las páginas de servicios enlazan con `?servicio=` para no
// perder de dónde venía la persona.
function resolveServicio() {
    try {
        return new URLSearchParams(window.location.search).get("servicio") || "instituciones";
    } catch {
        return "instituciones";
    }
}

/** Formulario que publica en /api/leads, igual que los formularios de servicios. */
export function InstitucionesContactForm() {
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formEl = e.currentTarget;
        setResult(null);
        setBusy(true);

        try {
            const form = new FormData(formEl);
            const institution = String(form.get("institution") ?? "");
            const role = String(form.get("role") ?? "");
            const institutionType = String(form.get("institutionType") ?? "");
            const phone = String(form.get("phone") ?? "");
            const message = String(form.get("message") ?? "");

            const payload = {
                source: "instituciones",
                name: String(form.get("name") ?? ""),
                email: String(form.get("email") ?? ""),
                phone,
                message: [
                    `Institución: ${institution}`,
                    `Tipo: ${institutionType}`,
                    `Cargo: ${role}`,
                    "",
                    message,
                ].join("\n"),
                page: "/instituciones",
                formId: "agenda-instituciones",
                fields: { institution, institutionType, role, phone },
                servicio: resolveServicio(),
                attribution: getAttribution(),
            };

            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = (await response.json()) as { ok?: boolean; error?: string };

            if (!json.ok) {
                setResult({ ok: false, msg: "No pudimos enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp." });
                return;
            }

            setResult({ ok: true, msg: "Gracias. Recibimos tu solicitud y Hugo te escribirá para coordinar la reunión." });
            formEl.reset();
        } catch {
            setResult({ ok: false, msg: "No pudimos enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp." });
        } finally {
            setBusy(false);
        }
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="inst-name" className={labelClass}>Nombre</label>
                    <input id="inst-name" name="name" type="text" required autoComplete="name" className={inputClass} />
                </div>
                <div>
                    <label htmlFor="inst-email" className={labelClass}>Email institucional</label>
                    <input id="inst-email" name="email" type="email" required autoComplete="email" className={inputClass} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="inst-institution" className={labelClass}>Institución</label>
                    <input id="inst-institution" name="institution" type="text" required autoComplete="organization" className={inputClass} />
                </div>
                <div>
                    <label htmlFor="inst-role" className={labelClass}>Cargo</label>
                    <input id="inst-role" name="role" type="text" autoComplete="organization-title" className={inputClass} />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="inst-type" className={labelClass}>Tipo de institución</label>
                    <select id="inst-type" name="institutionType" required defaultValue="" className={inputClass}>
                        <option value="" disabled>Selecciona una opción</option>
                        {INSTITUTION_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="inst-phone" className={labelClass}>
                        Teléfono <span className="font-normal text-[#8a8276]">(opcional)</span>
                    </label>
                    <input id="inst-phone" name="phone" type="tel" autoComplete="tel" placeholder="+56 9 1234 5678" className={inputClass} />
                </div>
            </div>

            <div>
                <label htmlFor="inst-message" className={labelClass}>¿Qué decisión o situación los tiene ocupados hoy?</label>
                <textarea
                    id="inst-message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Por ejemplo: un protocolo que no se está aplicando, un equipo desbordado, un programa que hay que rediseñar."
                    className={inputClass}
                />
            </div>

            {result ? (
                <div
                    role="status"
                    className={`rounded-[6px] border px-4 py-3 text-sm ${
                        result.ok
                            ? "border-[#d8cfc0] bg-[#fffdf8] text-[#171713]"
                            : "border-[#e4a8a8] bg-[#fdf0f0] text-[#7a2525]"
                    }`}
                >
                    {result.msg}
                </div>
            ) : null}

            <Button type="submit" size="lg" className="h-auto min-h-11 w-full gap-2 rounded-[6px] bg-[#bd6f3c] py-2.5 text-[0.9375rem] hover:bg-[#a85f31]" disabled={busy}>
                <Send className="h-4 w-4" />
                {busy ? "Enviando…" : "Pedir la reunión de 20 minutos"}
            </Button>
            <p className="text-xs leading-5 text-[#8a8276]">
                Usamos estos datos solo para coordinar la reunión.
            </p>
        </form>
    );
}
