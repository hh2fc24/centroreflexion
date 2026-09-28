"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { AlertCircle, ArrowRight, Loader2, X } from "lucide-react";
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
        className={BOTON}
      >
        <span className="tabular-nums">{`Pagar ${precioLabel}`}</span> <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    );
  }

  return (
    <form onSubmit={iniciarPago} className="space-y-4">
      <p className={`text-[0.875rem] font-semibold ${dark ? "text-[#e4935d]" : "text-[#9f5528]"}`}>
        Matrícula {tramoNombre} · <span className="tabular-nums">{precioLabel}</span>
      </p>

      <Campo name="nombre" label="Nombre completo" type="text" dark={dark} required />
      <Campo name="email" label="Correo electrónico" type="email" dark={dark} required />
      <Campo name="telefono" label="WhatsApp (opcional)" type="tel" dark={dark} />
      <Campo name="institucion" label="Dónde trabajas (opcional)" type="text" dark={dark} />

      {error ? (
        <p
          role="alert"
          className={`flex items-start gap-2.5 rounded-[6px] border px-3.5 py-2.5 text-[0.9375rem] leading-[1.55] ${
            dark ? "border-[#e4935d] text-[#fbf7ee]" : "border-[#9f5528] bg-[#fffdf8] text-[#171713]"
          }`}
        >
          <AlertCircle
            aria-hidden="true"
            className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-[#e4935d]" : "text-[#9f5528]"}`}
          />
          <span>
            <span className="font-semibold">No se pudo abrir el pago.</span> {error}
          </span>
        </p>
      ) : null}

      <button type="submit" disabled={loading} className={`${BOTON} disabled:cursor-wait disabled:opacity-60`}>
        {loading ? (
          <>
            <Loader2 aria-hidden="true" className="h-4 w-4 motion-safe:animate-spin" /> Abriendo Mercado Pago
          </>
        ) : (
          <>
            Ir a pagar <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </>
        )}
      </button>

      <p className={`text-[0.875rem] leading-[1.6] ${dark ? "text-[#ede7dc]/70" : "text-[#6f675d]"}`}>
        Pago seguro con Mercado Pago. Puedes usar las cuotas de tu tarjeta. Si prefieres transferencia en tres cuotas,
        postula y lo coordinamos.
      </p>
    </form>
  );
}

const BOTON =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bd6f3c]";

function Campo({
  name,
  label,
  type,
  dark,
  required = false,
}: {
  name: string;
  label: string;
  type: string;
  dark: boolean;
  required?: boolean;
}) {
  const id = useId();
  const base =
    "block h-12 w-full rounded-[6px] border px-3.5 text-[1rem] outline-none transition-colors focus:border-[#bd6f3c] focus:ring-1 focus:ring-[#bd6f3c] user-invalid:border-[#9f5528]";
  return (
    <div>
      <label
        htmlFor={id}
        className={`mb-1.5 block text-[0.875rem] font-semibold ${dark ? "text-[#fbf7ee]" : "text-[#171713]"}`}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className={
          dark
            ? `${base} border-[#f1ede4]/25 bg-transparent text-[#fbf7ee]`
            : `${base} border-[#ded5c7] bg-[#fffdf8] text-[#171713]`
        }
      />
    </div>
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
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-[6px] border border-[#bd6f3c] bg-[#171713] px-5 py-5 text-[#fbf7ee] shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
    >
      <button
        type="button"
        onClick={cerrar}
        aria-label="Cerrar aviso"
        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-[6px] text-[#ede7dc]/70 transition-colors hover:bg-[#f1ede4]/10 hover:text-[#fbf7ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e4935d]"
      >
        <X className="h-4 w-4" />
      </button>
      <p
        className="text-[0.8125rem] font-semibold text-[#e4935d]"
      >
        {texto.etiqueta}
      </p>
      <p className="crc-serif mt-2 pr-8 text-[1.2rem] font-medium leading-[1.25]">{texto.titulo}</p>
      <p className="mt-2 text-[0.9375rem] leading-[1.65] text-[#ede7dc]/85">{texto.cuerpo}</p>
    </div>
  );
}
