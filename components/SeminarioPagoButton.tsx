"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowRight, Loader2, X } from "lucide-react";
import { getAttribution } from "@/lib/attribution";

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
          // Viaja al metadata de Mercado Pago para saber qué canal trajo el pago.
          attribution: getAttribution(),
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

// ─────────────────────────────────────────────
// Aviso al volver de Mercado Pago
// ─────────────────────────────────────────────

type RetornoPago = "success" | "pending" | "failure";

// Parámetros que Mercado Pago agrega a la back_url; se limpian al cerrar el
// aviso para que recargar la página no lo vuelva a mostrar.
const PARAMS_RETORNO_MP = [
  "payment",
  "collection_id",
  "collection_status",
  "payment_id",
  "status",
  "external_reference",
  "payment_type",
  "merchant_order_id",
  "preference_id",
  "site_id",
  "processing_mode",
  "merchant_account_id",
];

function leerRetornoPago(): RetornoPago | null {
  try {
    const value = new URLSearchParams(window.location.search).get("payment");
    return value === "success" || value === "pending" || value === "failure" ? value : null;
  } catch {
    return null;
  }
}

const sinSuscripcion = () => () => {};

const TEXTOS_RETORNO: Record<RetornoPago, { etiqueta: string; titulo: string; cuerpo: string }> = {
  success: {
    etiqueta: "Pago aprobado",
    titulo: "Tu matrícula quedó registrada.",
    cuerpo:
      "Te escribimos dentro de las próximas 24 horas hábiles al correo que dejaste, con los pasos para la primera sesión. Revisa también tu carpeta de spam.",
  },
  pending: {
    etiqueta: "Pago pendiente",
    titulo: "Mercado Pago todavía no confirma el pago.",
    cuerpo:
      "Si pagaste en efectivo o por transferencia puede tardar hasta dos días hábiles. El cupo queda tuyo cuando se acredite, y te avisamos por correo.",
  },
  failure: {
    etiqueta: "Pago no completado",
    titulo: "El pago no se pudo completar.",
    cuerpo:
      "Puedes intentarlo de nuevo con otro medio de pago. Si prefieres transferencia en cuotas, postula y lo coordinamos contigo.",
  },
};

/**
 * Aviso de confirmación, pendiente o error cuando Mercado Pago devuelve a la
 * persona a la landing (`?payment=success|pending|failure`). Va fijo abajo en
 * la pantalla, así que se puede montar en cualquier parte de la página, una
 * sola vez.
 */
export function SeminarioPagoAviso() {
  // Se lee la URL solo en el cliente (el servidor devuelve null) para no
  // depender de useSearchParams ni de un límite de Suspense.
  const retorno = useSyncExternalStore(sinSuscripcion, leerRetornoPago, () => null);
  const [cerrado, setCerrado] = useState(false);

  if (!retorno || cerrado) return null;
  const texto = TEXTOS_RETORNO[retorno];
  const error = retorno === "failure";

  function cerrar() {
    setCerrado(true);
    try {
      const url = new URL(window.location.href);
      for (const param of PARAMS_RETORNO_MP) url.searchParams.delete(param);
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // Si no se puede limpiar la URL, el aviso igual se cierra.
    }
  }

  return (
    <div
      role={error ? "alert" : "status"}
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-[5px] border border-[#bd6f3c]/40 bg-[#171713] px-5 py-5 text-[#fbf7ee] shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
    >
      <button
        type="button"
        onClick={cerrar}
        aria-label="Cerrar aviso"
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[4px] text-[#ede7dc]/60 transition hover:bg-[#f1ede4]/10 hover:text-[#fbf7ee]"
      >
        <X className="h-4 w-4" />
      </button>
      <p
        className={`text-[0.6rem] font-extrabold uppercase tracking-[0.2em] ${
          error ? "text-[#f0a58f]" : "text-[#bd6f3c]"
        }`}
      >
        {texto.etiqueta}
      </p>
      <p className="crc-serif mt-2 pr-8 text-[1.2rem] font-medium leading-[1.25]">{texto.titulo}</p>
      <p className="mt-2 text-[0.84rem] leading-[1.7] text-[#ede7dc]/75">{texto.cuerpo}</p>
    </div>
  );
}
