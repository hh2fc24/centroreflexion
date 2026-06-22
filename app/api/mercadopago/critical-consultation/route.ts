import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site";
import {
  CRITICAL_CONSULTATION_UF_QUANTITY,
  getCriticalConsultationUfQuote,
} from "@/lib/server/uf";

type MercadoPagoPreferenceResponse = {
  id?: string;
  init_point?: string;
  message?: string;
};

export async function POST() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Mercado Pago no configurado" },
      { status: 501 }
    );
  }

  try {
    const siteUrl = getSiteUrl();
    const quote = await getCriticalConsultationUfQuote();
    const externalReference = `crc-critical-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const preference = {
      items: [
        {
          id: "consulta-prioritaria-crc",
          title: "Consulta prioritaria CRC",
          description:
            "Orientacion inmediata por situacion critica en infancia, familia o comunidad educativa.",
          quantity: 1,
          currency_id: "CLP",
          unit_price: quote.amount,
        },
      ],
      external_reference: externalReference,
      metadata: {
        service: "critical_consultation",
        uf_quantity: CRITICAL_CONSULTATION_UF_QUANTITY,
        uf_value: quote.value,
        uf_source: quote.source,
        uf_fallback: quote.fallback,
        amount_clp: quote.amount,
      },
      back_urls: {
        success: `${siteUrl}/contacto?servicio=canal-critico&payment=success`,
        pending: `${siteUrl}/contacto?servicio=canal-critico&payment=pending`,
        failure: `${siteUrl}/contacto?servicio=canal-critico&payment=failure`,
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
        { ok: false, error: data.message ?? "No se pudo crear el pago Mercado Pago" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      initPoint: data.init_point,
      preferenceId: data.id,
      externalReference,
      amount: quote.amount,
      ufValue: quote.value,
      fallback: quote.fallback,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error creando pago";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
