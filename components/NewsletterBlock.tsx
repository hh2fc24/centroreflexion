"use client";

import { useState } from "react";
import { getAttribution } from "@/lib/attribution";

interface Props {
    origen?: string;
}

export function NewsletterBlock({ origen = "articulo" }: Props) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
    const [msg, setMsg] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email || status === "loading") return;

        setStatus("loading");
        try {
            const res = await fetch("/api/suscribir", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email, origen, attribution: getAttribution() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error");
            setStatus("ok");
            setMsg(data.existing ? "Ya estabas suscrito/a — te tenemos en cuenta." : "Listo. Te escribimos con la próxima columna.");
        } catch {
            setStatus("error");
            setMsg("Algo salió mal. Intenta de nuevo.");
        }
    }

    return (
        <section
            aria-labelledby="newsletter-titulo"
            className="my-10 rounded-[6px] border border-[#d8cfc0] bg-[#f8f5ee] px-5 py-6 sm:px-7 sm:py-7"
        >
            <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Suscripción</p>
            <h2
                id="newsletter-titulo"
                className="crc-serif mt-2 text-balance text-[1.35rem] font-semibold leading-[1.2] tracking-[-0.01em] text-[#171713]"
            >
                Una columna al mes, y aviso cuando abre una cohorte
            </h2>
            <p className="mt-2 max-w-[60ch] text-[0.9375rem] leading-[1.7] text-[#55574f]">
                Pensamiento crítico del CRC sobre niñez, juventud, salud mental e instituciones. Sin spam; te das de baja cuando quieras.
            </p>

            {status === "ok" ? (
                <p role="status" className="mt-5 text-[0.9375rem] font-semibold text-[#171713]">{msg}</p>
            ) : (
                <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <label htmlFor="newsletter-email" className="sr-only">
                        Correo electrónico
                    </label>
                    <input
                        id="newsletter-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="min-h-11 flex-1 rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8] px-3 py-2 text-[0.9375rem] text-[#171713] placeholder:text-[#6f675d] focus:border-[#9f5528] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bd6f3c]/40"
                    />
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="min-h-11 rounded-[6px] bg-[#bd6f3c] px-5 py-2 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] disabled:opacity-60"
                    >
                        {status === "loading" ? "Enviando…" : "Suscribirme"}
                    </button>
                </form>
            )}

            {status === "error" && (
                <p role="alert" className="mt-2 text-[0.875rem] font-semibold text-[#9f5528]">{msg}</p>
            )}
        </section>
    );
}
