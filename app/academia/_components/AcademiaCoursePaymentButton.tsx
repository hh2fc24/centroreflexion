"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

interface Props {
  cursoId: string;
  slug: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function AcademiaCoursePaymentButton({
  cursoId,
  slug,
  label = "Pagar online",
  className,
  style,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startPayment() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/mercadopago/academia-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cursoId, slug }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        initPoint?: string;
        redirectUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "No se pudo iniciar el pago");
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      if (!data.initPoint) {
        throw new Error("No se recibió el enlace de pago");
      }

      window.location.href = data.initPoint;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={startPayment}
        disabled={loading}
        className={className}
        style={style}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Preparando pago
          </>
        ) : (
          <>
            {label} <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
      {error && (
        <p className="mt-3 text-center text-xs" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}
    </div>
  );
}
