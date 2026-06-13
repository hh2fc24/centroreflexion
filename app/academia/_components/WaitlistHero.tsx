"use client";

import { useState } from "react";
import { ArrowRight, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function WaitlistHero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    
    // Simulate API call to save lead
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 py-24 sm:px-10">
      {/* Background Effects */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{ 
          background: "radial-gradient(circle at 50% 50%, rgba(212,168,67,0.15) 0%, transparent 60%)" 
        }}
      />
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-[var(--ac-gold-dim)] bg-black/40 backdrop-blur-sm">
          <svg className="w-4 h-4 text-[var(--ac-gold)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M12 7C10.8954 7 10 7.89543 10 9C10 9.74028 10.4022 10.3866 11 10.7324V14.5L12 15.5L13 14.5V10.7324C13.5978 10.3866 14 9.74028 14 9C14 7.89543 13.1046 7 12 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[var(--ac-gold)]">
            Acceso Anticipado Exclusivo
          </span>
        </div>

        {/* Main Headline */}
        <h1 
          className="text-balance mb-6"
          style={{
            fontFamily: "var(--font-cormorant, Georgia, serif)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: "var(--ac-text)",
          }}
        >
          No buscamos alumnos.<br />
          <span className="italic" style={{ color: "var(--ac-gold)" }}>Buscamos pensadores.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-12 max-w-xl text-base sm:text-lg text-balance leading-relaxed text-[var(--ac-text-2)]">
          El dogma termina aquí. La Academia del Centro de Reflexiones Críticas está forjando su manifiesto. Únete a la lista de espera fundacional y sé de los primeros en cuestionarlo todo.
        </p>

        {/* Lead Capture Form */}
        <div className="mx-auto max-w-md">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center p-6 border border-[var(--ac-gold-dim)] bg-black/30 backdrop-blur-md rounded-lg animate-in fade-in zoom-in duration-500">
              <CheckCircle2 className="w-10 h-10 text-[var(--ac-gold)] mb-4" />
              <h3 className="text-lg font-bold text-[var(--ac-text)] mb-2 font-cormorant">Estás en la lista.</h3>
              <p className="text-sm text-[var(--ac-text-3)] text-center">
                Te notificaremos cuando el acceso esté habilitado. Prepárate para desaprender.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[var(--ac-text-3)]" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  className="w-full pl-11 pr-4 py-4 bg-[var(--ac-surface)] border border-[var(--ac-border-md)] rounded-md text-[var(--ac-text)] placeholder-[var(--ac-text-3)] focus:outline-none focus:border-[var(--ac-gold)] focus:ring-1 focus:ring-[var(--ac-gold)] transition-all"
                  disabled={status === "loading"}
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[0.7rem] font-extrabold uppercase tracking-[0.15em] ac-btn-gold ac-glow-gold rounded-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Procesando..." : "Solicitar Acceso"}
              </button>
            </form>
          )}
          <p className="mt-4 text-xs text-[var(--ac-text-3)] text-center">
            * Cero spam. Solo acceso prioritario y contenido fundacional.
          </p>
        </div>

        {/* Footer Link / Escape Hatch */}
        <div className="mt-20">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--ac-text-3)] hover:text-[var(--ac-gold)] transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
