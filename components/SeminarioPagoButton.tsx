"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

/**
 * Botón de pago del seminario.
 *
 * Pide lo mínimo para emitir el comprobante y saber quién compró (Mercado Pago
 * necesita un correo del pagador de todas formas) y de ahí manda al checkout.
 * El monto no se envía: lo resuelve el servidor según el tramo vigente, así que
 * este componente solo muestra el precio, no lo decide.
 */
export function SeminarioPagoButton({
  precioLabel,
  tramoNombre,
  variant = "light",
}: {
  precioLabel: string;
  tramoNombre: string;
  variant?: "light" | "dark";
}) {
  const [abierto, setAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dark = variant === "dark";

  async function iniciarPago(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/mercadopago/seminario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: String(form.get("nombre") ?? ""),
          email: String(form.get("email") ?? ""),
          telefono: String(form.get("telefono") ?? ""),
          institucion: String(form.get("institucion") ?? ""),
        }),
      });

      const data = (await response.json()) as { ok?: boolean; initPoint?: string; error?: string };

      if (!response.ok || !data.ok || !data.initPoint) {
        throw new Error(data.error ?? "No se pudo iniciar el pago");
      }

      window.location.href = data.initPoint;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el pago");
      setLoading(false);
    }
  }

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className={`inline-flex h-11 w-full items-center justify-center gap-3 rounded-[5px] px-6 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] transition duration-200 ${
          dark
            ? "bg-[#bd6f3c] text-white hover:bg-[#a85f31]"
            : "bg-[#bd6f3c] text-white shadow-[0_18px_40px_rgba(90,45,18,0.22)] hover:bg-[#a85f31]"
        }`}
      >
        Pagar {precioLabel} <ArrowRight className="h-4 w-4" />
      </button>
    );
  }

  return (
    <form onSubmit={iniciarPago} className="space-y-3">
      <p className={`text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-[#bd6f3c]`}>
        Matrícula {tramoNombre} · {precioLabel}
      </p>

      <Campo name="nombre" placeholder="Nombre completo" type="text" dark={dark} required />
      <Campo name="email" placeholder="Correo electrónico" type="email" dark={dark} required />
      <Campo name="telefono" placeholder="WhatsApp (opcional)" type="tel" dark={dark} />
      <Campo name="institucion" placeholder="Dónde trabajas (opcional)" type="text" dark={dark} />

      {error ? (
        <p
          className={`rounded-[4px] border px-3 py-2 text-[0.78rem] leading-[1.6] ${
            dark
              ? "border-[#c0553d]/40 bg-[#c0553d]/12 text-[#f0c9bd]"
              : "border-[#c0553d]/35 bg-[#c0553d]/8 text-[#9f3a24]"
          }`}
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-[5px] bg-[#bd6f3c] px-6 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-white transition duration-200 hover:bg-[#a85f31] disabled:opacity-55"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Abriendo Mercado Pago
          </>
        ) : (
          <>
            Ir a pagar <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className={`text-[0.7rem] leading-[1.55] ${dark ? "text-[#ede7dc]/50" : "text-[#8a8276]"}`}>
        Pago seguro con Mercado Pago. Puedes usar las cuotas de tu tarjeta. Si prefieres transferencia en tres cuotas,
        postula y lo coordinamos.
      </p>
    </form>
  );
}

function Campo({
  name,
  placeholder,
  type,
  dark,
  required = false,
}: {
  name: string;
  placeholder: string;
  type: string;
  dark: boolean;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      aria-label={placeholder}
      className={
        dark
          ? "block h-11 w-full rounded-[4px] border border-[#f1ede4]/18 bg-[#f1ede4]/[0.05] px-3.5 text-[0.88rem] text-[#fbf7ee] outline-none transition placeholder:text-[#ede7dc]/35 focus:border-[#bd6f3c]"
          : "block h-11 w-full rounded-[4px] border border-[rgba(101,91,74,0.28)] bg-[#fffdf8] px-3.5 text-[0.88rem] text-[#171713] outline-none transition placeholder:text-[#a9a294] focus:border-[#bd6f3c]"
      }
    />
  );
}
