"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, Check, MessageCircle, Clock, Building2, ArrowRight } from "lucide-react";
import { PAGO_CONFIG, formatoCLP, whatsappLink } from "@/lib/academia/pago";

interface Props {
  cursoTitulo: string;
  cursoSlug: string;
  precio: number;
  moneda: string;
  estado: string;
  email: string;
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 py-2.5" style={{ borderBottom: "1px solid var(--ac-border)" }}>
      <div className="min-w-0">
        <p className="text-[0.65rem] uppercase tracking-wider" style={{ color: "var(--ac-text-3)" }}>{label}</p>
        <p className="truncate text-sm font-medium" style={{ color: "var(--ac-text)" }}>{value}</p>
      </div>
      <button
        onClick={() => { navigator.clipboard?.writeText(value); setDone(true); setTimeout(() => setDone(false), 1500); }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ border: "1px solid var(--ac-border-md)", color: done ? "var(--ac-gold)" : "var(--ac-text-3)" }}
        aria-label={`Copiar ${label}`}
      >
        {done ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function PagoInstrucciones({ cursoTitulo, cursoSlug, precio, moneda, email }: Props) {
  const t = PAGO_CONFIG.transferencia;
  const mensajeWA =
    `¡Hola! Acabo de solicitar la inscripción al curso "${cursoTitulo}" en la Academia CRC ` +
    `(${moneda} ${formatoCLP(precio)}). Mi correo de cuenta es ${email}. Adjunto el comprobante de transferencia.`;

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Confirmación */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--ac-gold-dim)", border: "1px solid var(--ac-border-gold)" }}>
            <CheckCircle2 className="h-6 w-6" style={{ color: "var(--ac-gold)" }} />
          </div>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>Solicitud recibida</p>
            <h1 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.8rem", fontWeight: 700, color: "var(--ac-text)", lineHeight: 1.1 }}>
              Un paso más para comenzar
            </h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed" style={{ color: "var(--ac-text-2)" }}>
          Registramos tu solicitud para <strong style={{ color: "var(--ac-text)" }}>{cursoTitulo}</strong>. Para activar tu acceso,
          realiza la transferencia por <strong style={{ color: "var(--ac-gold)" }}>{moneda} {formatoCLP(precio)}</strong> y envíanos
          el comprobante por WhatsApp. Activamos tu inscripción apenas confirmemos el pago.
        </p>

        {/* Estado */}
        <div className="mt-6 flex items-center gap-2 rounded-lg px-4 py-3" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)" }}>
          <Clock className="h-4 w-4" style={{ color: "var(--ac-gold)" }} />
          <span className="text-xs" style={{ color: "var(--ac-text-2)" }}>
            Estado actual: <strong style={{ color: "var(--ac-gold-light)" }}>solicitud en revisión</strong>
          </span>
        </div>

        {/* Datos de transferencia */}
        <div className="mt-8 rounded-2xl p-6" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border-md)" }}>
          <div className="mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4" style={{ color: "var(--ac-gold)" }} />
            <h2 className="text-sm font-bold" style={{ color: "var(--ac-text)" }}>Datos para la transferencia</h2>
          </div>
          <CopyRow label="Titular" value={t.titular} />
          <CopyRow label="RUT" value={t.rut} />
          <CopyRow label="Banco" value={t.banco} />
          <CopyRow label="Tipo de cuenta" value={t.tipoCuenta} />
          <CopyRow label="N° de cuenta" value={t.numeroCuenta} />
          <CopyRow label="Monto" value={`${moneda} ${formatoCLP(precio)}`} />
          <CopyRow label="Enviar comprobante a" value={t.correoComprobante} />
        </div>

        {/* WhatsApp */}
        <a
          href={whatsappLink(mensajeWA)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2.5 py-3.5 text-[0.7rem] font-extrabold uppercase tracking-[0.13em] ac-btn-gold ac-glow-gold"
          style={{ borderRadius: "6px" }}
        >
          <MessageCircle className="h-4 w-4" /> Enviar comprobante por WhatsApp
        </a>

        <p className="mt-4 text-center text-xs" style={{ color: "var(--ac-text-3)" }}>
          ¿Dudas? Escríbenos a {PAGO_CONFIG.email}
        </p>

        <div className="mt-8 flex items-center justify-center gap-5 text-xs">
          <Link href={`/academia/cursos/${cursoSlug}`} className="font-semibold" style={{ color: "var(--ac-text-3)" }}>
            ← Volver al curso
          </Link>
          <Link href="/academia/mis-cursos" className="inline-flex items-center gap-1.5 font-semibold" style={{ color: "var(--ac-gold)" }}>
            Mis cursos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
