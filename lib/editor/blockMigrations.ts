import type { BlockType, SiteBlock } from "@/lib/editor/types";

export const LATEST_BLOCK_SCHEMA_VERSION = 2 as const;

function newId(prefix: string) {
  // Works in both browser and Node.
  const c = (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c && typeof c.randomUUID === "function") return `${prefix}-${c.randomUUID()}`;
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function defaultVariantFor(type: BlockType): string | undefined {
  switch (type) {
    case "hero":
      return "centered";
    case "pricing":
      return "cards";
    case "faq":
      return "accordion";
    case "cta":
      return "banner";
    default:
      return undefined;
  }
}

function asRecord(x: unknown): Record<string, unknown> {
  return x && typeof x === "object" && !Array.isArray(x) ? (x as Record<string, unknown>) : {};
}

function asArray(x: unknown): unknown[] {
  return Array.isArray(x) ? x : [];
}

function migrateToV2(block: SiteBlock): SiteBlock {
  const data = asRecord(block.data);
  switch (block.type) {
    case "logos": {
      const logos = asArray(data.logos).map((l) => asRecord(l));
      const next = logos.map((l) => ({
        ...l,
        id: typeof l.id === "string" && l.id ? l.id : newId("l"),
        alt: typeof l.alt === "string" ? l.alt : "",
        src: typeof l.src === "string" ? l.src : "",
      }));
      return { ...block, data: { ...data, logos: next } as Record<string, unknown> };
    }
    case "faq": {
      const items = asArray(data.items).map((it) => asRecord(it));
      const next = items.map((it) => ({
        ...it,
        id: typeof it.id === "string" && it.id ? it.id : newId("q"),
        q: typeof it.q === "string" ? it.q : "",
        a: typeof it.a === "string" ? it.a : "",
      }));
      return { ...block, data: { ...data, items: next } as Record<string, unknown> };
    }
    case "pricing": {
      const plans = asArray(data.plans).map((p) => asRecord(p));
      const next = plans.map((p) => ({
        ...p,
        id: typeof p.id === "string" && p.id ? p.id : newId("p"),
        features: Array.isArray(p.features) ? (p.features as unknown[]).map((f) => String(f)) : [],
      }));
      return { ...block, data: { ...data, plans: next } as Record<string, unknown> };
    }
    case "features": {
      const items = asArray(data.items).map((it) => asRecord(it));
      const next = items.map((it) => ({
        ...it,
        id: typeof it.id === "string" && it.id ? it.id : newId("f"),
        title: typeof it.title === "string" ? it.title : "",
        description: typeof it.description === "string" ? it.description : "",
      }));
      return { ...block, data: { ...data, items: next } as Record<string, unknown> };
    }
    case "form": {
      const fields = asArray(data.fields).map((f) => asRecord(f));
      const next = fields.map((f) => ({
        ...f,
        id: typeof f.id === "string" && f.id ? f.id : newId("fld"),
        type: typeof f.type === "string" ? f.type : "text",
        key: typeof f.key === "string" ? f.key : "",
        label: typeof f.label === "string" ? f.label : "",
      }));
      return { ...block, data: { ...data, fields: next } as Record<string, unknown> };
    }
    default:
      return block;
  }
}

export function migrateBlock(block: SiteBlock): SiteBlock {
  const rawVersion = block.schemaVersion;
  let schemaVersion = typeof rawVersion === "number" && Number.isFinite(rawVersion) ? rawVersion : 1;

  let b: SiteBlock = block;
  const variant = typeof b.variant === "string" && b.variant ? b.variant : defaultVariantFor(b.type);
  if (variant !== b.variant) {
    b = { ...b, variant };
  }

  if (schemaVersion < 2) {
    b = migrateToV2(b);
    schemaVersion = 2;
  }

  if (schemaVersion > LATEST_BLOCK_SCHEMA_VERSION) {
    // Forward-compat: keep as-is but clamp to latest known.
    schemaVersion = LATEST_BLOCK_SCHEMA_VERSION;
  }

  return { ...b, schemaVersion };
}
