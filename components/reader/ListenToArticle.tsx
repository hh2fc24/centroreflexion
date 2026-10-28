"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Pause, Play, Square } from "lucide-react";

/**
 * Lectura en voz alta de una columna con la voz del sistema (Web Speech API).
 * Recibe solo el cuerpo (sin notas ni referencias) y lo lee párrafo por
 * párrafo: los navegadores cortan los textos largos si van en un solo
 * enunciado. Si el navegador no tiene voz en español, el botón no se muestra.
 */

type Status = "idle" | "playing" | "paused";

function pickSpanishVoice() {
    const voices = window.speechSynthesis.getVoices();
    return (
        voices.find((v) => v.lang === "es-CL") ??
        voices.find((v) => v.lang === "es-419" || v.lang === "es-MX" || v.lang === "es-US") ??
        voices.find((v) => v.lang.startsWith("es")) ??
        null
    );
}

/** Quita marcas de formato del contenido: encabezados, citas, enlaces y llamadas a notas. */
function toSpeech(paragraph: string) {
    return paragraph
        .replace(/^##\s+/, "")
        .replace(/^>\s+/, "")
        .replace(/\[(\d{1,2})\]/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/https?:\/\/\S+/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

export function ListenToArticle({ title, paragraphs }: { title: string; paragraphs: string[] }) {
    const [supported, setSupported] = useState(false);
    const [status, setStatus] = useState<Status>("idle");
    const queue = useRef<string[]>([]);
    const index = useRef(0);

    useEffect(() => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
        const check = () => setSupported(pickSpanishVoice() !== null);
        check();
        window.speechSynthesis.addEventListener("voiceschanged", check);
        return () => {
            window.speechSynthesis.removeEventListener("voiceschanged", check);
            window.speechSynthesis.cancel();
        };
    }, []);

    const speakNext = () => {
        const text = queue.current[index.current];
        if (text === undefined) {
            setStatus("idle");
            return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = pickSpanishVoice();
        if (voice) utterance.voice = voice;
        utterance.lang = voice?.lang ?? "es-CL";
        utterance.rate = 1;
        utterance.onend = () => {
            index.current += 1;
            speakNext();
        };
        window.speechSynthesis.speak(utterance);
    };

    const start = () => {
        window.speechSynthesis.cancel();
        queue.current = [title, ...paragraphs].map(toSpeech).filter((text) => text.length > 0);
        index.current = 0;
        setStatus("playing");
        speakNext();
    };

    const toggle = () => {
        if (status === "idle") return start();
        if (status === "playing") {
            window.speechSynthesis.pause();
            setStatus("paused");
        } else {
            window.speechSynthesis.resume();
            setStatus("playing");
        }
    };

    const stop = () => {
        queue.current = [];
        window.speechSynthesis.cancel();
        setStatus("idle");
    };

    if (!supported) return null;

    const button =
        "inline-flex min-h-11 items-center gap-2 rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8] px-4 text-[0.9375rem] font-semibold text-[#171713] transition-colors hover:border-[#bd6f3c] hover:text-[#9f5528] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd6f3c]";

    return (
        <div data-print-hide="" className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={toggle} className={button} aria-pressed={status === "playing"}>
                {status === "idle" ? (
                    <Headphones className="h-4 w-4" aria-hidden="true" />
                ) : status === "playing" ? (
                    <Pause className="h-4 w-4" aria-hidden="true" />
                ) : (
                    <Play className="h-4 w-4" aria-hidden="true" />
                )}
                {status === "idle" ? "Escuchar la columna" : status === "playing" ? "Pausar" : "Continuar"}
            </button>
            {status !== "idle" ? (
                <button type="button" onClick={stop} className={button}>
                    <Square className="h-3.5 w-3.5" aria-hidden="true" />
                    Detener
                </button>
            ) : null}
            <span className="text-[0.8125rem] text-[#6f675d]">Voz del dispositivo</span>
        </div>
    );
}
