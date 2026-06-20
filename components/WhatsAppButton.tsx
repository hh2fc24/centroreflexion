"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Copy, CreditCard, Phone, ShieldAlert } from "lucide-react";

const WA_NUMBER = "56949186447";
const CALL_NUMBER = "+56949186447";
const MERCADO_PAGO_LINK = "https://link.mercadopago.cl/asesoriasaludmental";
const UF_QUANTITY = 2;

const TRANSFER_DATA = [
    ["Titular", "Juan Carlos Rauld Farias"],
    ["RUT", "15.929.424-2"],
    ["Banco", "Mercado Pago"],
    ["Tipo de cuenta", "Cuenta Vista"],
    ["Numero de cuenta", "1031549162"],
    ["Email", "juan.rauld@mail.udp.cl"],
];

const SERVICIOS = [
    { id: "clinica", label: "Atención clínica", emoji: "🩺" },
    { id: "consultoria", label: "Consultoría institucional", emoji: "🏛️" },
    { id: "compliance", label: "Compliance escolar", emoji: "⚖️" },
    { id: "bienestar", label: "Bienestar escolar", emoji: "🏫" },
    { id: "otra", label: "Otra consulta", emoji: "💬" },
];

type Step = "idle" | "servicios" | "mensaje";

function WaIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-6 w-6 fill-white" aria-hidden="true">
            <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.83.74 5.49 2.03 7.8L.5 31.5l7.93-2.08A15.44 15.44 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 28.22a13.7 13.7 0 0 1-7-1.92l-.5-.3-5.18 1.36 1.38-5.04-.33-.52A13.72 13.72 0 1 1 16 28.72zm7.52-10.28c-.41-.2-2.43-1.2-2.81-1.33-.37-.14-.64-.2-.91.2-.27.4-1.05 1.33-1.28 1.6-.23.27-.47.3-.88.1-.41-.2-1.73-.64-3.3-2.04-1.22-1.09-2.04-2.43-2.28-2.84-.24-.41-.03-.63.18-.83.18-.18.41-.47.61-.7.2-.23.27-.4.41-.67.14-.27.07-.5-.03-.7-.1-.2-.91-2.2-1.25-3.01-.33-.8-.67-.69-.91-.7h-.78c-.27 0-.7.1-1.07.5-.37.4-1.4 1.37-1.4 3.34s1.43 3.87 1.63 4.14c.2.27 2.82 4.3 6.83 6.03.95.41 1.7.66 2.28.84.96.3 1.83.26 2.52.16.77-.11 2.43-1 2.77-1.96.34-.97.34-1.8.24-1.97-.1-.17-.37-.27-.78-.47z" />
        </svg>
    );
}

export function WhatsAppButton() {
    const [open, setOpen] = useState(false);
    const [criticalOpen, setCriticalOpen] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [copiedTransfer, setCopiedTransfer] = useState(false);
    const [ufAmount, setUfAmount] = useState<number | null>(null);
    const [step, setStep] = useState<Step>("idle");
    const [servicio, setServicio] = useState<typeof SERVICIOS[0] | null>(null);
    const [mensaje, setMensaje] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const criticalPanelRef = useRef<HTMLDivElement>(null);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            const target = e.target as Node;
            const clickedWhatsapp = panelRef.current?.contains(target);
            const clickedCritical = criticalPanelRef.current?.contains(target);
            if (!clickedWhatsapp && !clickedCritical) {
                setOpen(false);
                setCriticalOpen(false);
                setShowTransfer(false);
            }
        }
        if (open || criticalOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, criticalOpen]);

    // Focus textarea al llegar al paso de mensaje
    useEffect(() => {
        if (step === "mensaje") {
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    }, [step]);

    useEffect(() => {
        let cancelled = false;
        async function fetchUf() {
            try {
                const response = await fetch("https://mindicador.cl/api/uf", { cache: "no-store" });
                const data = (await response.json()) as { serie?: Array<{ valor?: number }> };
                const value = data.serie?.[0]?.valor;
                if (!cancelled && typeof value === "number") {
                    setUfAmount(Math.round(value * UF_QUANTITY));
                }
            } catch {
                if (!cancelled) setUfAmount(null);
            }
        }
        fetchUf();
        return () => {
            cancelled = true;
        };
    }, []);

    function handleOpen() {
        setOpen(true);
        setCriticalOpen(false);
        setStep("servicios");
    }

    function handleCriticalOpen() {
        setCriticalOpen(true);
        setOpen(false);
    }

    function handleClose() {
        setOpen(false);
        setCriticalOpen(false);
        setShowTransfer(false);
        setCopiedTransfer(false);
        setTimeout(() => {
            setStep("idle");
            setServicio(null);
            setMensaje("");
        }, 300);
    }

    function handleSelectServicio(s: typeof SERVICIOS[0]) {
        setServicio(s);
        setStep("mensaje");
    }

    function handleEnviar() {
        const servLabel = servicio?.label ?? "consulta general";
        const texto = mensaje.trim();
        const waText = texto
            ? `Hola CRC 👋 Consulto sobre *${servLabel}*: ${texto}`
            : `Hola CRC 👋 Quisiera información sobre *${servLabel}*.`;
        const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        handleClose();
    }

    async function handleCopyTransfer() {
        const text = TRANSFER_DATA.map(([label, value]) => `${label}: ${value}`).join("\n");
        try {
            await navigator.clipboard.writeText(text);
            setCopiedTransfer(true);
            window.setTimeout(() => setCopiedTransfer(false), 1800);
        } catch {
            setCopiedTransfer(false);
        }
    }

    const formattedUfAmount = ufAmount
        ? new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(ufAmount)
        : "2 UF";

    return (
        <>
        <div ref={criticalPanelRef} className="fixed bottom-5 left-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-start gap-3 sm:bottom-6 sm:left-6">
            <div
                className="overflow-y-auto overflow-x-hidden rounded-[12px] shadow-2xl transition-all duration-300"
                style={{
                    width: "340px",
                    maxHeight: criticalOpen ? "calc(100vh - 132px)" : "0px",
                    opacity: criticalOpen ? 1 : 0,
                    pointerEvents: criticalOpen ? "auto" : "none",
                    border: "1px solid #ded5c7",
                    background: "#fffdf8",
                    transformOrigin: "bottom left",
                    transform: criticalOpen ? "scale(1)" : "scale(0.95)",
                }}
            >
                <div className="flex items-start justify-between border-b border-[#2d3029] bg-[#171713] px-5 py-4">
                    <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[#d3976d]/40 bg-[#d3976d]/12 text-[#d3976d]">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d3976d]">Canal crítico CRC</p>
                            <h2 className="mt-1 text-lg font-bold leading-tight text-white font-serif">Orientación inmediata</h2>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="flex h-8 w-8 items-center justify-center rounded-[5px] text-[#b0a898] transition hover:bg-white/10 hover:text-white"
                        aria-label="Cerrar canal crítico"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                </div>

                <div className="px-5 py-5">
                    {!showTransfer ? (
                        <>
                            <p className="text-sm leading-6 text-[#3f423a]">
                                Consulta prioritaria para riesgo suicida, desregulacion grave o episodios criticos con ninos, ninas, adolescentes, familias o comunidades educativas.
                            </p>
                            <div className="mt-4 space-y-2.5 border-y border-[#ded5c7] py-4 text-sm leading-5 text-[#70695f]">
                                <p><strong className="text-[#171713]">Modalidad:</strong> llamada, videollamada o asistencia presencial si se requiere.</p>
                                <p><strong className="text-[#171713]">Duracion:</strong> 40 a 60 minutos.</p>
                                <p><strong className="text-[#171713]">Valor:</strong> 2 UF {ufAmount ? `(${formattedUfAmount})` : "(valor UF del dia)"}.</p>
                                <p><strong className="text-[#171713]">Alcance:</strong> diagnostico inicial, contencion, intervencion critica y plan de trabajo.</p>
                            </div>
                            <a
                                href={MERCADO_PAGO_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#171713] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(23,23,19,0.18)] transition hover:bg-[#2d3029]"
                            >
                                <CreditCard className="h-4 w-4" />
                                Pagar con Mercado Pago
                            </a>
                            <p className="mt-2 text-xs leading-5 text-[#8a8276]">
                                Link de pago abierto: ingresa manualmente el monto indicado, <strong className="text-[#171713]">{formattedUfAmount}</strong>.
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowTransfer(true)}
                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#ded5c7] bg-[#fffdf8] px-4 py-2.5 text-sm font-bold text-[#171713] transition hover:border-[#bd6f3c]/50"
                            >
                                Ver transferencia bancaria
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-sm leading-6 text-[#3f423a]">
                                Para activar la consulta prioritaria, realiza la transferencia por <strong>{formattedUfAmount}</strong>. Confirmado el pago, el especialista toma contacto en un maximo de 20 minutos.
                            </p>
                            <div className="mt-4 overflow-hidden rounded-[8px] border border-[#ded5c7] bg-[#f8f5ee]">
                                {TRANSFER_DATA.map(([label, value]) => (
                                    <div key={label} className="grid grid-cols-[112px_1fr] border-b border-[#ded5c7] px-3 py-2.5 text-sm last:border-b-0">
                                        <span className="font-bold text-[#171713]">{label}</span>
                                        <span className="break-words text-[#55574f]">{value}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleCopyTransfer}
                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#ded5c7] bg-[#fffdf8] px-4 py-2.5 text-sm font-bold text-[#171713] transition hover:border-[#bd6f3c]/50"
                            >
                                {copiedTransfer ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                {copiedTransfer ? "Datos copiados" : "Copiar datos de transferencia"}
                            </button>
                            <a
                                href={`tel:${CALL_NUMBER}`}
                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#171713] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_24px_rgba(23,23,19,0.18)] transition hover:bg-[#2d3029]"
                                onClick={() => setCriticalOpen(false)}
                            >
                                <Phone className="h-4 w-4" />
                                Llamar tras transferir
                            </a>
                        </>
                    )}
                </div>
            </div>

            <button
                onClick={criticalOpen ? handleClose : handleCriticalOpen}
                aria-label="Abrir canal crítico CRC"
                className="group inline-flex min-h-14 items-center gap-3 rounded-[8px] border border-[#d3976d]/35 bg-[#171713] px-4 py-2.5 text-left text-[#fffdf8] shadow-[0_14px_30px_rgba(23,23,19,0.2)] transition hover:-translate-y-0.5 hover:border-[#d3976d]/70 hover:bg-[#22251f] sm:px-5"
                style={{ flexShrink: 0 }}
            >
                <ShieldAlert className="h-4 w-4 text-[#d3976d]" />
                <span className="flex flex-col leading-none">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d3976d]">Canal crítico CRC</span>
                    <span className="mt-1.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-white sm:text-[13px]">¿Necesitas ayuda ahora?</span>
                </span>
            </button>
        </div>

        <div ref={panelRef} className="fixed bottom-5 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">

            {/* Panel del chat */}
            <div
                className="overflow-hidden rounded-[12px] shadow-2xl transition-all duration-300"
                style={{
                    width: "320px",
                    maxHeight: open ? "520px" : "0px",
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none",
                    border: "1px solid #ded5c7",
                    background: "#fffdf8",
                    transformOrigin: "bottom right",
                    transform: open ? "scale(1)" : "scale(0.95)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between bg-[#171713] px-4 py-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]">
                            <WaIcon />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-white leading-none">CRC</p>
                            <p className="text-[10px] text-[#b0a898] mt-0.5">Respondemos en minutos</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[#b0a898] transition hover:bg-white/10 hover:text-white"
                        aria-label="Cerrar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                </div>

                {/* Burbuja de bienvenida */}
                <div className="px-4 pt-4 pb-2">
                    <div className="inline-block rounded-[10px] rounded-tl-none bg-[#f0ece4] px-3.5 py-2.5 text-sm leading-relaxed text-[#171713]">
                        {step === "servicios" && (
                            <>Hola 👋 ¿Sobre qué te podemos orientar?</>
                        )}
                        {step === "mensaje" && (
                            <>Entendido — <strong>{servicio?.label}</strong>.<br />
                            Cuéntanos brevemente tu consulta y te contactamos.</>
                        )}
                    </div>
                </div>

                {/* Paso 1: selección de servicio */}
                {step === "servicios" && (
                    <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
                        {SERVICIOS.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => handleSelectServicio(s)}
                                className="flex items-center gap-2.5 rounded-[8px] border border-[#ded5c7] bg-[#fffdf8] px-3.5 py-2.5 text-left text-sm font-semibold text-[#171713] transition hover:border-[#bd6f3c]/50 hover:bg-[#f8f5ee]"
                            >
                                <span className="text-base">{s.emoji}</span>
                                {s.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Paso 2: mensaje libre */}
                {step === "mensaje" && (
                    <div className="flex flex-col gap-3 px-4 pb-4 pt-2">
                        <button
                            onClick={() => setStep("servicios")}
                            className="self-start text-[11px] font-bold uppercase tracking-wide text-[#bd6f3c] hover:underline"
                        >
                            ← Cambiar servicio
                        </button>
                        <textarea
                            ref={textareaRef}
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleEnviar(); }
                            }}
                            placeholder="Ej: Tengo un hijo de 8 años y..."
                            rows={3}
                            className="w-full resize-none rounded-[8px] border border-[#ded5c7] bg-white px-3 py-2.5 text-sm text-[#171713] placeholder:text-[#b0a898] focus:border-[#bd6f3c]/50 focus:outline-none"
                        />
                        <button
                            onClick={handleEnviar}
                            className="flex items-center justify-center gap-2 rounded-[8px] bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1ebc5a]"
                        >
                            <WaIcon />
                            Abrir en WhatsApp
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-end">
                {/* Botón flotante principal */}
                <button
                    onClick={open ? handleClose : handleOpen}
                    aria-label="Contactar por WhatsApp"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition hover:scale-110 hover:shadow-xl"
                    style={{ flexShrink: 0 }}
                >
                    {open ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    ) : (
                        <WaIcon />
                    )}
                </button>
            </div>
        </div>
        </>
    );
}
