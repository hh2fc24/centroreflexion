import { NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import type { BlockPreset, BlockType, SiteBlock } from "@/lib/editor/types";
import { roleAtLeast } from "@/lib/server/roles";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import { sanitizePlainText } from "@/lib/server/sanitize";

export const runtime = "nodejs";

type Body = {
  mode: "create_page" | "insert_block" | "improve_text";
  prompt: string;
};

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9/]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/\/{2,}/g, "/")
    .split("/")
    .map((s) => s.replace(/(^-|-$)+/g, ""))
    .filter(Boolean)
    .join("/")
    .slice(0, 120);
}

function defaultStyle() {
  return {
    base: {
      paddingY: 72,
      paddingX: 16,
      maxWidth: 1200,
      background: "transparent",
      textAlign: "left",
      radius: 16,
      shadow: 0.2,
    },
    tablet: { paddingY: 56, paddingX: 16 },
    mobile: { paddingY: 44, paddingX: 16 },
  };
}

function makeBlock(type: BlockType, preset: BlockPreset, data: unknown): SiteBlock {
  return {
    id: newId("blk"),
    type,
    visible: true,
    locked: false,
    preset,
    data,
    style: defaultStyle() as unknown as SiteBlock["style"],
    visibleOn: { desktop: true, tablet: true, mobile: true },
  };
}

export async function POST(req: Request) {
  const session = getAdminSessionFromRequest(req);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  if (!roleAtLeast(session.role, "editor")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const ip = getClientIp(req);
  const rl = checkRateLimit(`ai:${session.user}:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const prompt = sanitizePlainText(body.prompt ?? "", { maxLen: 8000 }).trim();
  if (!prompt) return NextResponse.json({ ok: false, error: "missing_prompt" }, { status: 400 });

  // NOTE: This endpoint supports optional OpenAI later (OPENAI_API_KEY), but ships with a deterministic offline generator.
  if (body.mode === "create_page") {
    const title = prompt.split("\n")[0]?.slice(0, 70) || "Nueva página";
    const slug = slugify(title) || "nueva-pagina";

    const blocks = [
      makeBlock("hero", "premium", {
        eyebrow: "Nuevo",
        title,
        subtitle: "Página creada automáticamente. Ajusta el contenido en el canvas.",
        primaryCtaLabel: "Contactar",
        primaryCtaHref: "/contacto",
        secondaryCtaLabel: "Servicios",
        secondaryCtaHref: "/servicios",
        backgroundImage: "/images/consulting_hero.png",
      }),
      makeBlock("richText", "minimal", { title: "Resumen", body: prompt }),
      makeBlock("faq", "minimal", {
        title: "FAQ",
        items: [
          { id: newId("q"), q: "¿Qué ofrecemos?", a: "Completa esta respuesta con tu propuesta de valor." },
          { id: newId("q"), q: "¿Cómo contactarnos?", a: "Agrega links y canales de contacto." },
        ],
      }),
      makeBlock("cta", "bold", { title: "¿Hablamos?", subtitle: "Agenda o escríbenos para comenzar.", buttonLabel: "Ir a contacto", buttonHref: "/contacto" }),
    ];

    return NextResponse.json({ ok: true, page: { title, slug, blocks } });
  }

  if (body.mode === "insert_block") {
    const block = makeBlock("richText", "minimal", { title: "Nueva sección", body: prompt });
    return NextResponse.json({ ok: true, block });
  }

  if (body.mode === "improve_text") {
    // Simple offline improvement (no external API).
    const improved = prompt
      .replace(/\s+/g, " ")
      .replace(/\.([A-Za-zÁÉÍÓÚÑ])/g, ". $1")
      .trim();
    return NextResponse.json({ ok: true, text: improved });
  }

  return NextResponse.json({ ok: false, error: "invalid_mode" }, { status: 400 });
}
