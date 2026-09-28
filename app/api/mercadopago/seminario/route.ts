/**
 * Checkout de Mercado Pago para el seminario "Desprotección de la Infancia".
 *
 * A diferencia de `academia-course`, no exige sesión iniciada: el seminario se
 * vende desde una landing pública y pedir registro antes de pagar bota
 * compras. Y a diferencia de `critical-consultation`, el monto no es fijo:
 * depende del tramo vigente, que se resuelve AQUÍ contando cupos vendidos.
 * El navegador solo manda los datos de contacto; el precio nunca.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import { requireTrustedOrigin } from "@/lib/server/requestSecurity";
import { sanitizePlainText } from "@/lib/server/sanitize";
import { leerEstadoVenta, registrarPagoPendiente } from "@/lib/server/seminarioPagosStore";
import { formatoCLP } from "@/lib/seminario/tramos";
import {
  attributionToFlatMetadata,
  getGeo,
  recordConversionEvent,
  resolveAttribution,
  type AttributionData,
} from "@/lib/server/siteAnalytics";

export const runtime = "nodejs";

type MercadoPagoPreferenceResponse = {
  id?: string;
  init_point?: string;
  message?: string;
};

type Body = {
  nombre?: unknown;
  email?: unknown;
  telefono?: unknown;
  institucion?: unknown;
  attribution?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const invalidOrigin = requireTrustedOrigin(request);
  if (invalidOrigin) return invalidOrigin;

  const ip = getClientIp(request);
  const rl = checkRateLimit(`seminario:pago:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Demasiados intentos. Espera un momento." }, { status: 429 });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ ok: false, error: "Pago online no configurado" }, { status: 501 });
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  const nombre = sanitizePlainText(typeof body.nombre === "string" ? body.nombre : "", { maxLen: 140 });
  const email = sanitizePlainText(typeof body.email === "string" ? body.email : "", { maxLen: 140 });
  const telefono = sanitizePlainText(typeof body.telefono === "string" ? body.telefono : "", { maxLen: 40 });
  const institucion = sanitizePlainText(typeof body.institucion === "string" ? body.institucion : "", { maxLen: 180 });

  if (!nombre || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Necesitamos tu nombre y un correo válido." }, { status: 400 });
  }

  // El tramo —y por lo tanto el precio— se decide en el servidor.
  const estado = await leerEstadoVenta();
  const tramo = estado.vigente;

  if (!tramo) {
    return NextResponse.json(
      {
        ok: false,
        error:
          estado.motivo === "sin_cupos"
            ? "La cohorte 1 está completa. Escríbenos y quedas primero en la lista de la cohorte 2."
            : "La matrícula de la cohorte 1 está cerrada.",
        motivo: estado.motivo,
      },
      { status: 409 }
    );
  }

  // Atribución de marketing. seminario_pagos no tiene columna para esto: viaja
  // en el `metadata` de la preferencia (Mercado Pago lo devuelve en el pago y
  // el webhook lo copia al evento payment_approved) y en el evento
  // seminario_checkout_started, que se une al pago por external_reference.
  let attribution: AttributionData | null = null;
  try {
    attribution = resolveAttribution(request, body.attribution);
  } catch {
    attribution = null;
  }

  const id = `sem-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  const externalReference = `crc-seminario:${id}:${Date.now()}`;

  try {
    await registrarPagoPendiente({
      id,
      tramo: tramo.id,
      monto: tramo.precio,
      name: nombre,
      email,
      phone: telefono || null,
      institucion: institucion || null,
      externalReference,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "error";
    return NextResponse.json({ ok: false, error: "No pudimos preparar el pago", detail }, { status: 500 });
  }

  try {
    const siteUrl = getSiteUrl();
    const back = `${siteUrl}/seminarios/desproteccion-infancia`;

    const preference = {
      items: [
        {
          id: `seminario-desproteccion-${tramo.id}`,
          title: "Seminario Desprotección de la Infancia · Cohorte 1 · CRC",
          description: `Matrícula ${tramo.nombre}. Ocho sesiones en vivo, del 15 de octubre al 3 de diciembre de 2026. Centro de Reflexiones Críticas.`,
          quantity: 1,
          currency_id: "CLP",
          unit_price: tramo.precio,
        },
      ],
      payer: { name: nombre, email },
      external_reference: externalReference,
      metadata: {
        service: "seminario_desproteccion",
        tramo: tramo.id,
        amount_clp: tramo.precio,
        cupo: estado.vendidos + 1,
        institucion: institucion || null,
        telefono: telefono || null,
        ...attributionToFlatMetadata(attribution),
      },
      back_urls: {
        success: `${back}?payment=success`,
        pending: `${back}?payment=pending`,
        failure: `${back}?payment=failure`,
      },
      notification_url: `${siteUrl}/api/mercadopago/webhook`,
      statement_descriptor: "CRC",
      auto_return: "approved",
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    const data = (await response.json()) as MercadoPagoPreferenceResponse;
    if (!response.ok || !data.init_point) {
      return NextResponse.json(
        { ok: false, error: data.message ?? "No se pudo crear el pago" },
        { status: 502 }
      );
    }

    try {
      const { country } = getGeo(request);
      await recordConversionEvent({
        eventName: "seminario_checkout_started",
        path: "/seminarios/desproteccion-infancia",
        ip,
        country,
        metadata: {
          externalReference,
          tramo: tramo.id,
          amount: tramo.precio,
          ...(attribution ? { attribution } : {}),
        },
      });
    } catch {
      // Analítica best-effort: no bloquear el paso a Mercado Pago.
    }

    return NextResponse.json({
      ok: true,
      initPoint: data.init_point,
      preferenceId: data.id,
      externalReference,
      tramo: tramo.id,
      tramoNombre: tramo.nombre,
      amount: tramo.precio,
      amountLabel: formatoCLP(tramo.precio),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error creando pago";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
