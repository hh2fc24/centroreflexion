"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

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
                body: JSON.stringify({ email, origen }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error");
            setStatus("ok");
            setMsg(data.existing ? "Ya estabas suscrito/a — te tenemos en cuenta." : "¡Listo! Te avisamos cuando publiquemos.");
        } catch {
            setStatus("error");
            setMsg("Algo salió mal. Intenta de nuevo.");
        }
    }

    return (
        <div className="my-10 rounded-[10px] border border-[#dec0a8] bg-[#fdf6ed] px-6 py-7">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#bd6f3c]/10">
                    <Mail className="h-4 w-4 text-[#bd6f3c]" />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-[#171713]">¿Te gustó este artículo?</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-[#55574f]">
                        Recibe nuevas publicaciones de CRC directamente en tu correo. Sin spam.
                    </p>

                    {status === "ok" ? (
                        <p className="mt-4 text-sm font-semibold text-[#4a7c3f]">{msg}</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@correo.com"
                                className="flex-1 rounded-[6px] border border-[#ded5c7] bg-white px-3 py-2 text-sm text-[#171713] placeholder:text-[#b0a898] focus:border-[#bd6f3c]/60 focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="rounded-[6px] bg-[#bd6f3c] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#a85f2e] disabled:opacity-60"
                            >
                                {status === "loading" ? "Enviando…" : "Suscribirme"}
                            </button>
                        </form>
                    )}

                    {status === "error" && (
                        <p className="mt-2 text-xs text-red-600">{msg}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
