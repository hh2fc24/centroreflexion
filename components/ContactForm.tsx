"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getAttribution } from "@/lib/attribution";

const CONTACT_METHODS = [
    { value: "whatsapp", label: "WhatsApp" },
    { value: "email", label: "Email" },
    { value: "llamada", label: "Llamada telefónica" },
];

const HORARIOS = [
    { value: "manana", label: "Mañana (9 – 12h)" },
    { value: "mediodia", label: "Mediodía (12 – 15h)" },
    { value: "tarde", label: "Tarde (15 – 18h)" },
    { value: "cualquiera", label: "Cualquier horario" },
];

const inputClass =
    "mt-2 block w-full rounded-[6px] border-0 bg-white px-3.5 py-2.5 text-base text-[#171713] ring-1 ring-inset ring-[#d8cfc0] placeholder:text-[#8a8276] focus:ring-2 focus:ring-inset focus:ring-[#bd6f3c] sm:text-[0.9375rem] sm:leading-6";

const labelClass = "block text-sm font-semibold leading-6 text-[#171713]";

// Servicio de origen: el prop si la página lo pasa; si no, `?servicio=` de la URL.
function resolveServicio(prop?: string) {
    if (prop) return prop;
    if (typeof window === "undefined") return "";
    try {
        return new URLSearchParams(window.location.search).get("servicio") ?? "";
    } catch {
        return "";
    }
}

export function ContactForm({ servicio }: { servicio?: string }) {
    const pathname = usePathname();
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
    const [contactMethod, setContactMethod] = useState("whatsapp");
    const [horario, setHorario] = useState("cualquiera");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setResult(null);
        setBusy(true);
        // Guardar la referencia antes del await: React deja currentTarget en null
        // después del despacho y el reset() fallaba tras un envío exitoso.
        const formElement = e.currentTarget;
        try {
            const form = new FormData(formElement);
            const servicioFinal = resolveServicio(servicio);
            const payload = {
                source: "contact",
                name: String(form.get("name") ?? ""),
                email: String(form.get("email") ?? ""),
                phone: String(form.get("phone") ?? ""),
                contactMethod,
                horario,
                message: String(form.get("message") ?? ""),
                page: pathname || "/contacto",
                ...(servicioFinal ? { servicio: servicioFinal } : {}),
                attribution: getAttribution(),
            };
            const r = await fetch("/api/leads", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = (await r.json()) as { ok?: boolean; error?: string };
            if (!json.ok) {
                setResult({ ok: false, msg: `Error: ${json.error}` });
                return;
            }
            setResult({ ok: true, msg: "¡Gracias! Recibimos tu mensaje y te contactaremos pronto." });
            formElement.reset();
            setContactMethod("whatsapp");
            setHorario("cualquiera");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
            setResult({ ok: false, msg: `Error: ${message}` });
        } finally {
            setBusy(false);
        }
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Nombre */}
            <div>
                <label htmlFor="name" className={labelClass}>Nombre</label>
                <input type="text" id="name" name="name" required autoComplete="name" className={inputClass} />
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input type="email" id="email" name="email" required autoComplete="email" className={inputClass} />
            </div>

            {/* Teléfono */}
            <div>
                <label htmlFor="phone" className={labelClass}>
                    Teléfono <span className="font-normal text-[#8a8276]">(opcional)</span>
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    placeholder="+56 9 1234 5678"
                    className={inputClass}
                />
            </div>

            {/* ¿Cómo prefieres que te contactemos? */}
            <div>
                <p className={labelClass}>¿Cómo prefieres que te contactemos?</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {CONTACT_METHODS.map((m) => (
                        <button
                            key={m.value}
                            type="button"
                            onClick={() => setContactMethod(m.value)}
                            className={`min-h-11 rounded-[6px] border px-3 py-2 text-[0.875rem] font-semibold transition-colors ${
                                contactMethod === m.value
                                    ? "border-[#9f5528] bg-[#fffdf8] text-[#9f5528] ring-1 ring-inset ring-[#9f5528]"
                                    : "border-[#d8cfc0] bg-white text-[#55574f] hover:border-[#9f5528]"
                            }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Horario preferido */}
            <div>
                <p className={labelClass}>Horario preferido</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                    {HORARIOS.map((h) => (
                        <button
                            key={h.value}
                            type="button"
                            onClick={() => setHorario(h.value)}
                            className={`min-h-11 rounded-[6px] border px-3 py-2 text-[0.875rem] font-semibold transition-colors ${
                                horario === h.value
                                    ? "border-[#9f5528] bg-[#fffdf8] text-[#9f5528] ring-1 ring-inset ring-[#9f5528]"
                                    : "border-[#d8cfc0] bg-white text-[#55574f] hover:border-[#9f5528]"
                            }`}
                        >
                            {h.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mensaje */}
            <div>
                <label htmlFor="message" className={labelClass}>Mensaje</label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Cuéntanos brevemente en qué podemos ayudarte…"
                    className={inputClass}
                    defaultValue={""}
                />
            </div>

            {result && (
                <div
                    className={`rounded-[6px] border px-4 py-3 text-[0.9375rem] ${
                        result.ok
                            ? "border-[#d8cfc0] bg-[#fffdf8] text-[#171713]"
                            : "border-[#e4a8a8] bg-[#fdf0f0] text-[#7a2525]"
                    }`}
                >
                    {result.msg}
                </div>
            )}

            <Button type="submit" className="h-auto min-h-11 w-full rounded-[6px] bg-[#bd6f3c] py-2.5 text-[0.9375rem] text-white hover:bg-[#a85f31]" disabled={busy}>
                {busy ? "Enviando…" : "Enviar mensaje"}
            </Button>
        </form>
    );
}
