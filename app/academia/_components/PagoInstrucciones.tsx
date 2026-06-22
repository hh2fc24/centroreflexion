"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { formatoCLP } from "@/lib/academia/pago";
import { AcademiaCoursePaymentButton } from "./AcademiaCoursePaymentButton";

interface Props {
  cursoTitulo: string;
  cursoId: string;
  cursoSlug: string;
  precio: number;
  moneda: string;
  estado: string;
  email: string;
}

export function PagoInstrucciones({ cursoTitulo, cursoId, cursoSlug, precio, moneda, estado, email }: Props) {
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
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em]" style={{ color: "var(--ac-gold)" }}>Inscripción reservada</p>
            <h1 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "1.8rem", fontWeight: 700, color: "var(--ac-text)", lineHeight: 1.1 }}>
              Finaliza tu acceso
            </h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed" style={{ color: "var(--ac-text-2)" }}>
          Ya tenemos tu inscripción para <strong style={{ color: "var(--ac-text)" }}>{cursoTitulo}</strong>. El acceso se activa
          automáticamente cuando el pago online por <strong style={{ color: "var(--ac-gold)" }}>{moneda} {formatoCLP(precio)}</strong> quede confirmado.
        </p>

        {/* Estado */}
        <div className="mt-6 flex items-center gap-2 rounded-lg px-4 py-3" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border)" }}>
          <Clock className="h-4 w-4" style={{ color: "var(--ac-gold)" }} />
          <span className="text-xs" style={{ color: "var(--ac-text-2)" }}>
            Estado actual: <strong style={{ color: "var(--ac-gold-light)" }}>{estado === "pendiente" ? "pago pendiente" : estado}</strong>
          </span>
        </div>

        <div className="mt-8 rounded-lg p-6" style={{ background: "var(--ac-surface)", border: "1px solid var(--ac-border-md)" }}>
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" style={{ color: "var(--ac-gold)" }} />
            <h2 className="text-sm font-bold" style={{ color: "var(--ac-text)" }}>Pago online</h2>
          </div>
          <p className="mb-5 text-sm leading-relaxed" style={{ color: "var(--ac-text-2)" }}>
            Continúa con el pago del curso. Al aprobarse, {email ? (
              <>tu cuenta <strong style={{ color: "var(--ac-text)" }}>{email}</strong></>
            ) : "tu cuenta"} queda habilitada para entrar al aula.
          </p>
          <AcademiaCoursePaymentButton
            cursoId={cursoId}
            slug={cursoSlug}
            label="Pagar online"
            className="flex w-full items-center justify-center gap-2.5 py-3.5 text-[0.7rem] font-extrabold uppercase tracking-[0.13em] ac-btn-gold ac-glow-gold disabled:opacity-70"
            style={{ borderRadius: "6px" }}
          />
        </div>

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
