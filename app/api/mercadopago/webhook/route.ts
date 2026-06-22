import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { appendMercadoPagoPaymentEvent } from "@/lib/server/mercadoPagoPayments";

type MercadoPagoWebhookPayload = {
  action?: string;
  type?: string;
  data?: { id?: string };
  id?: string;
  topic?: string;
};

type MercadoPagoPayment = {
  id?: number | string;
  status?: string;
  status_detail?: string;
  external_reference?: string;
  transaction_amount?: number;
};

function extractPaymentId(payload: MercadoPagoWebhookPayload, request: NextRequest) {
  return (
    payload.data?.id ??
    payload.id ??
    request.nextUrl.searchParams.get("id") ??
    request.nextUrl.searchParams.get("data.id") ??
    undefined
  );
}

async function fetchPayment(paymentId: string) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) return null;

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as MercadoPagoPayment;
}

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => ({}))) as MercadoPagoWebhookPayload;
  const paymentId = extractPaymentId(payload, request);
  const payment = paymentId ? await fetchPayment(paymentId) : null;

  await appendMercadoPagoPaymentEvent({
    id: crypto.randomUUID(),
    receivedAt: Date.now(),
    paymentId,
    topic: payload.topic ?? request.nextUrl.searchParams.get("topic") ?? undefined,
    type: payload.type,
    action: payload.action,
    status: payment?.status,
    statusDetail: payment?.status_detail,
    externalReference: payment?.external_reference,
    amount: payment?.transaction_amount,
    raw: { payload, payment },
  });

  return NextResponse.json({ ok: true });
}
