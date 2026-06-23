import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getClientIp } from "@/lib/server/rateLimit";
import { getGeo, recordConversionEvent } from "@/lib/server/siteAnalytics";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
    try {
        const { email, origen } = await req.json();

        if (!email || typeof email !== "string" || !email.includes("@")) {
            return NextResponse.json({ error: "Email inválido" }, { status: 400 });
        }

        const cleanEmail = email.trim().toLowerCase().slice(0, 254);
        const cleanOrigen = typeof origen === "string" ? origen.slice(0, 80) : "articulo";

        const { error } = await supabaseAdmin
            .from("suscriptores")
            .insert({ email: cleanEmail, origen: cleanOrigen });

        if (error) {
            if (error.code === "23505") {
                // Ya suscrito — responder OK igual para no filtrar emails
                return NextResponse.json({ ok: true, existing: true });
            }
            throw error;
        }

        try {
            const { country } = getGeo(req);
            await recordConversionEvent({
                eventName: "newsletter_signup",
                ip: getClientIp(req),
                country,
                metadata: { origen: cleanOrigen },
            });
        } catch {
            // No bloquear la respuesta si falla el registro de analítica.
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[suscribir]", err);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
