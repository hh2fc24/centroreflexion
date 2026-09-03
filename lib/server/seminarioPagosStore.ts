/**
 * Registro de pagos del seminario "Desprotección de la Infancia" en Supabase.
 *
 * Es lo que hace verificable la escasez: los cupos vendidos se cuentan desde
 * los pagos aprobados de esta tabla, y de ahí sale el tramo de precio vigente.
 * Sin esto, "quedan 8 de 15" sería una frase escrita a mano y el tramo de
 * Fundadores seguiría cobrándose después de agotado.
 *
 * Mismo motivo que en los otros stores: en Vercel el filesystem es efímero, así
 * que el estado compartido tiene que vivir en la base.
 */
import { createClient } from "@supabase/supabase-js";
import { resolverEstadoVenta, type EstadoVenta, type TramoId } from "@/lib/seminario/tramos";

const TABLE = "seminario_pagos";

export type SeminarioPagoEstado = "pendiente" | "aprobado" | "rechazado";

export interface SeminarioPagoRow {
  id: string;
  created_at: string;
  estado: SeminarioPagoEstado;
  tramo: TramoId;
  monto: number;
  name: string;
  email: string;
  phone: string | null;
  institucion: string | null;
  external_reference: string;
  preference_id: string | null;
  payment_id: string | null;
  aprobado_at: string | null;
}

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/** Cupos tomados: solo pagos aprobados. Un pago pendiente no reserva cupo. */
export async function contarCuposVendidos(): Promise<number> {
  const supabase = getClient();
  if (!supabase) throw new Error("supabase_not_configured");

  const { count, error } = await supabase
    .from(TABLE)
    .select("id", { count: "exact", head: true })
    .eq("estado", "aprobado");

  if (error) throw new Error(error.message);
  return count ?? 0;
}

/**
 * Estado de venta para pintar la landing y para cotizar un pago.
 *
 * Si la base no responde, se asume cero vendidos: la página se cae al tramo
 * más barato en vez de quedar en blanco. Es el error menos malo de los dos —
 * cobrar de menos se arregla conversando, una landing rota no vende nada.
 */
export async function leerEstadoVenta(): Promise<EstadoVenta> {
  try {
    return resolverEstadoVenta(await contarCuposVendidos());
  } catch {
    return resolverEstadoVenta(0);
  }
}

export async function registrarPagoPendiente(row: {
  id: string;
  tramo: TramoId;
  monto: number;
  name: string;
  email: string;
  phone?: string | null;
  institucion?: string | null;
  externalReference: string;
  preferenceId?: string | null;
}): Promise<void> {
  const supabase = getClient();
  if (!supabase) throw new Error("supabase_not_configured");

  const { error } = await supabase.from(TABLE).insert({
    id: row.id,
    estado: "pendiente",
    tramo: row.tramo,
    monto: row.monto,
    name: row.name,
    email: row.email,
    phone: row.phone ?? null,
    institucion: row.institucion ?? null,
    external_reference: row.externalReference,
    preference_id: row.preferenceId ?? null,
  });

  if (error) throw new Error(error.message);
}

export async function marcarPagoAprobado(
  externalReference: string,
  paymentId: string | null,
  monto: number | null
): Promise<void> {
  const supabase = getClient();
  if (!supabase) return;

  await supabase
    .from(TABLE)
    .update({
      estado: "aprobado",
      payment_id: paymentId,
      ...(monto != null ? { monto } : {}),
      aprobado_at: new Date().toISOString(),
    })
    .eq("external_reference", externalReference);
}

export async function listarPagos(): Promise<SeminarioPagoRow[]> {
  const supabase = getClient();
  if (!supabase) throw new Error("supabase_not_configured");

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw new Error(error.message);
  return (data ?? []) as SeminarioPagoRow[];
}
