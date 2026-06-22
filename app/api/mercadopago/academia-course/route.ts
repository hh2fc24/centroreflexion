import { NextRequest, NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Curso, Inscripcion } from "@/lib/supabase/database.types";

type MercadoPagoPreferenceResponse = {
  id?: string;
  init_point?: string;
  message?: string;
};

type CoursePaymentBody = {
  cursoId?: string;
  slug?: string;
};

function sanitizePrice(price: number | string | null) {
  const amount = Math.round(Number(price));
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

export async function POST(request: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Pago online no configurado" },
      { status: 501 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Academia no configurada" },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Academia no disponible" },
      { status: 503 }
    );
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Debes iniciar sesión para comprar el curso" },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as CoursePaymentBody;
  const cursoId = typeof body.cursoId === "string" ? body.cursoId : "";
  const slug = typeof body.slug === "string" ? body.slug : "";

  if (!cursoId && !slug) {
    return NextResponse.json(
      { ok: false, error: "Curso requerido" },
      { status: 400 }
    );
  }

  const query = supabase
    .from("cursos")
    .select("id, slug, titulo, precio, moneda")
    .eq("estado", "publicado");

  const { data: cursoRaw } = cursoId
    ? await query.eq("id", cursoId).single()
    : await query.eq("slug", slug).single();

  const curso = cursoRaw as Pick<Curso, "id" | "slug" | "titulo" | "precio" | "moneda"> | null;
  if (!curso) {
    return NextResponse.json(
      { ok: false, error: "Curso no encontrado" },
      { status: 404 }
    );
  }

  const amount = sanitizePrice(curso.precio);
  if (amount === 0) {
    return NextResponse.json({
      ok: true,
      redirectUrl: "/academia/mis-cursos",
      amount: 0,
    });
  }

  const { data: existingRaw } = await supabase
    .from("inscripciones")
    .select("id, estado")
    .eq("alumno_id", user.id)
    .eq("curso_id", curso.id)
    .maybeSingle();
  const existing = existingRaw as (Pick<Inscripcion, "id"> & { estado: string }) | null;

  if (existing?.estado === "activa") {
    return NextResponse.json({
      ok: true,
      redirectUrl: "/academia/mis-cursos",
      amount,
    });
  }

  let inscripcionId = existing?.id ?? null;
  if (!inscripcionId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: insertedRaw, error } = await (supabase as any)
      .from("inscripciones")
      .insert({
        alumno_id: user.id,
        curso_id: curso.id,
        estado: "pendiente",
        metodo_pago: "mercadopago",
        monto_pagado: null,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    inscripcionId = (insertedRaw as { id: string } | null)?.id ?? null;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("inscripciones")
      .update({ metodo_pago: "mercadopago" })
      .eq("id", inscripcionId);
  }

  if (!inscripcionId) {
    return NextResponse.json(
      { ok: false, error: "No se pudo preparar la inscripción" },
      { status: 500 }
    );
  }

  try {
    const siteUrl = getSiteUrl();
    const externalReference = `crc-academia:${inscripcionId}:${Date.now()}`;

    const preference = {
      items: [
        {
          id: `curso-${curso.slug}`,
          title: curso.titulo,
          description: "Inscripcion Academia CRC",
          quantity: 1,
          currency_id: curso.moneda || "CLP",
          unit_price: amount,
        },
      ],
      payer: {
        email: user.email,
      },
      external_reference: externalReference,
      metadata: {
        service: "academia_course",
        course_id: curso.id,
        course_slug: curso.slug,
        enrollment_id: inscripcionId,
        amount_clp: amount,
      },
      back_urls: {
        success: `${siteUrl}/academia/cursos/${curso.slug}/inscripcion?payment=success`,
        pending: `${siteUrl}/academia/cursos/${curso.slug}/inscripcion?payment=pending`,
        failure: `${siteUrl}/academia/cursos/${curso.slug}/inscripcion?payment=failure`,
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
        { ok: false, error: data.message ?? "No se pudo crear el pago online" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      initPoint: data.init_point,
      preferenceId: data.id,
      externalReference,
      amount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error creando pago online";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
