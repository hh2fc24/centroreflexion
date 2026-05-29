"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

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
    "mt-2.5 block w-full rounded-[6px] border-0 px-3.5 py-2 text-[#171713] shadow-sm ring-1 ring-inset ring-[#cfc4b4] placeholder:text-[#b0a898] focus:ring-2 focus:ring-inset focus:ring-[#bd6f3c] sm:text-sm sm:leading-6";

const labelClass = "block text-sm font-semibold leading-6 text-[#171713]";

export function ContactForm({ servicio }: { servicio?: string }) {
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
    const [contactMethod, setContactMethod] = useState("whatsapp");
    const [horario, setHorario] = useState("cualquiera");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setResult(null);
        setBusy(true);
        try {
            const form = new FormData(e.currentTarget);
            const payload = {
                source: "contact",
                name: String(form.get("name") ?? ""),
                email: String(form.get("email") ?? ""),
                phone: String(form.get("phone") ?? ""),
                contactMethod,
                horario,
                message: String(form.get("message") ?? ""),
                page: "/contacto",
                ...(servicio ? { servicio } : {}),
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
            (e.currentTarget as HTMLFormElement).reset();
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
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                    {CONTACT_METHODS.map((m) => (
                        <button
                            key={m.value}
                            type="button"
                            onClick={() => setContactMethod(m.value)}
                            className={`rounded-[6px] border px-3 py-2 text-sm font-semibold transition ${
                                contactMethod === m.value
                                    ? "border-[#bd6f3c] bg-[#bd6f3c]/10 text-[#9f5528]"
                                    : "border-[#cfc4b4] bg-white text-[#55574f] hover:border-[#bd6f3c]/50"
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
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                    {HORARIOS.map((h) => (
                        <button
                            key={h.value}
                            type="button"
                            onClick={() => setHorario(h.value)}
                            className={`rounded-[6px] border px-3 py-2 text-sm font-semibold transition ${
                                horario === h.value
                                    ? "border-[#bd6f3c] bg-[#bd6f3c]/10 text-[#9f5528]"
                                    : "border-[#cfc4b4] bg-white text-[#55574f] hover:border-[#bd6f3c]/50"
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
                    className={`rounded-[6px] border px-4 py-3 text-sm ${
                        result.ok
                            ? "border-[#a8c99a] bg-[#f0f7ed] text-[#2e5e25]"
                            : "border-[#e4a8a8] bg-[#fdf0f0] text-[#7a2525]"
                    }`}
                >
                    {result.msg}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Enviando…" : "Enviar mensaje"}
            </Button>
        </form>
    );
}
