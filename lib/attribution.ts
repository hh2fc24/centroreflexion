/**
 * Atribución de marketing (primer y último contacto) del lado del navegador.
 *
 * Para qué: saber qué cuenta y qué canal (Instagram del CRC, de Juan Carlos,
 * de Rocío, LinkedIn…) trae a la gente que después postula, paga o se suscribe.
 * El pageview por sí solo no alcanza: la conversión suele ocurrir varias
 * páginas (o días) después de haber llegado desde el link de la bio.
 *
 * Cómo:
 * - `captureAttribution()` se llama en cada vista de página (desde
 *   SiteAnalyticsTracker). Lee utm_*, identificadores de clic (fbclid, gclid)
 *   y el referrer externo, pero este último solo en la primera página de la
 *   sesión: en navegación SPA `document.referrer` no cambia y contaría el mismo
 *   origen externo en cada página.
 * - El primer contacto se guarda una sola vez; el último se reemplaza cada vez
 *   que llega un contacto con campaña o referrer externo.
 * - Se guarda en localStorage y se replica en una cookie propia (`crc_attr`)
 *   que el servidor puede leer cuando un formulario no manda la atribución en
 *   el cuerpo. Solo contiene datos de campaña, nunca datos personales.
 * - `getAttribution()` devuelve el objeto compacto que los formularios mandan
 *   junto a cada conversión.
 *
 * Todo va en try/catch: si el navegador bloquea el almacenamiento, la
 * atribución se pierde pero el sitio y los formularios siguen funcionando.
 */

export type AttributionClickId = "fbclid" | "gclid" | "msclkid" | "ttclid";

export type AttributionTouch = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  /** Solo el host del referrer externo (p. ej. "l.instagram.com"). */
  referrer?: string;
  /** Ruta donde aterrizó la persona en ese contacto, sin query string. */
  landing?: string;
  clickId?: AttributionClickId;
  /** Epoch en milisegundos. */
  ts?: number;
};

export type Attribution = {
  first?: AttributionTouch;
  last?: AttributionTouch;
};

export const ATTRIBUTION_COOKIE = "crc_attr";
const STORAGE_KEY = "crc.attribution.v1";
const SESSION_KEY = "crc.attribution.session";
const COOKIE_MAX_AGE_S = 60 * 60 * 24 * 180; // 180 días
const MAX_VALUE_LEN = 80;
const MAX_LANDING_LEN = 120;

const CLICK_IDS: AttributionClickId[] = ["fbclid", "gclid", "msclkid", "ttclid"];

// Referrers conocidos → fuente/medio legibles, para que una visita sin UTM
// desde Instagram no aparezca solo como "l.instagram.com".
const REFERRER_SOURCES: { pattern: RegExp; source: string; medium: string }[] = [
  { pattern: /(^|\.)instagram\.com$/, source: "instagram", medium: "social" },
  { pattern: /(^|\.)(facebook\.com|fb\.com|fb\.me)$/, source: "facebook", medium: "social" },
  { pattern: /(^|\.)(linkedin\.com|lnkd\.in)$/, source: "linkedin", medium: "social" },
  { pattern: /(^|\.)(t\.co|twitter\.com|x\.com)$/, source: "x", medium: "social" },
  { pattern: /(^|\.)(whatsapp\.com|wa\.me)$/, source: "whatsapp", medium: "social" },
  { pattern: /(^|\.)threads\.net$/, source: "threads", medium: "social" },
  { pattern: /(^|\.)tiktok\.com$/, source: "tiktok", medium: "social" },
  { pattern: /(^|\.)youtube\.com$/, source: "youtube", medium: "social" },
  { pattern: /(^|\.)google\.[a-z.]+$/, source: "google", medium: "organic" },
  { pattern: /(^|\.)bing\.com$/, source: "bing", medium: "organic" },
  { pattern: /(^|\.)duckduckgo\.com$/, source: "duckduckgo", medium: "organic" },
  { pattern: /(^|\.)(mail\.google\.com|outlook\.live\.com|outlook\.office\.com)$/, source: "email", medium: "email" },
];

function clip(value: string | null | undefined, max = MAX_VALUE_LEN): string | undefined {
  if (!value) return undefined;
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return cleaned ? cleaned.slice(0, max) : undefined;
}

function compact(touch: AttributionTouch): AttributionTouch {
  const out: AttributionTouch = {};
  for (const [key, value] of Object.entries(touch) as [keyof AttributionTouch, unknown][]) {
    if (value === undefined || value === null || value === "") continue;
    (out as Record<string, unknown>)[key] = value;
  }
  return out;
}

function hasCampaignData(touch: AttributionTouch | undefined): boolean {
  return !!touch && !!(touch.source || touch.medium || touch.campaign || touch.clickId || touch.referrer);
}

function readCookie(): Attribution | null {
  try {
    const match = document.cookie.split("; ").find((c) => c.startsWith(`${ATTRIBUTION_COOKIE}=`));
    if (!match) return null;
    return JSON.parse(decodeURIComponent(match.slice(ATTRIBUTION_COOKIE.length + 1))) as Attribution;
  } catch {
    return null;
  }
}

function writeCookie(attribution: Attribution) {
  try {
    const value = encodeURIComponent(JSON.stringify(attribution));
    if (value.length > 3000) return; // nunca acercarse al límite de 4 KB por cookie
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${ATTRIBUTION_COOKIE}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE_S}; SameSite=Lax${secure}`;
  } catch {
    // Sin cookie: el formulario igual manda la atribución en el cuerpo.
  }
}

function readStored(): Attribution {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Attribution;
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    // localStorage bloqueado (modo privado, políticas del navegador): usar la cookie.
  }
  return readCookie() ?? {};
}

function writeStored(attribution: Attribution) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Sin localStorage queda la cookie.
  }
  writeCookie(attribution);
}

// Sesión = pestaña abierta. Si sessionStorage no está disponible, se cae a una
// marca en memoria que al menos cubre la navegación SPA dentro de la carga.
let sessionStartedInMemory = false;

function consumeSessionStart(): boolean {
  try {
    if (window.sessionStorage.getItem(SESSION_KEY)) return false;
    window.sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  } catch {
    if (sessionStartedInMemory) return false;
    sessionStartedInMemory = true;
    return true;
  }
}

function externalReferrerHost(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const host = new URL(document.referrer).hostname.toLowerCase();
    if (!host || host === window.location.hostname.toLowerCase()) return undefined;
    return clip(host);
  } catch {
    return undefined;
  }
}

function sourceFromReferrer(host: string): { source: string; medium: string } {
  const known = REFERRER_SOURCES.find((r) => r.pattern.test(host));
  if (known) return { source: known.source, medium: known.medium };
  return { source: host.replace(/^www\./, ""), medium: "referral" };
}

export type CaptureResult = {
  attribution: Attribution;
  /** Primera vista de página de esta sesión (pestaña). */
  isSessionStart: boolean;
  /** Referrer completo solo si es la primera página de la sesión; si no, "". */
  sessionReferrer: string;
  /** Contacto nuevo con campaña o referrer externo detectado en esta vista. */
  newTouch?: AttributionTouch;
};

/**
 * Registra el contacto actual. Llamar en cada vista de página del lado del
 * cliente. Nunca lanza: ante cualquier error devuelve lo que haya guardado.
 */
export function captureAttribution(): CaptureResult {
  const empty: CaptureResult = { attribution: {}, isSessionStart: false, sessionReferrer: "" };
  if (typeof window === "undefined") return empty;

  try {
    const params = new URLSearchParams(window.location.search);
    const isSessionStart = consumeSessionStart();
    const refHost = isSessionStart ? externalReferrerHost() : undefined;
    const clickId = CLICK_IDS.find((id) => params.get(id));

    const utm: AttributionTouch = {
      source: clip(params.get("utm_source")?.toLowerCase()),
      medium: clip(params.get("utm_medium")?.toLowerCase()),
      campaign: clip(params.get("utm_campaign")?.toLowerCase()),
      content: clip(params.get("utm_content")?.toLowerCase()),
      term: clip(params.get("utm_term")),
    };
    const hasUtm = !!(utm.source || utm.medium || utm.campaign || utm.content);

    let touch: AttributionTouch | undefined;
    if (hasUtm || clickId || refHost) {
      const inferred = refHost ? sourceFromReferrer(refHost) : undefined;
      touch = compact({
        ...utm,
        source: utm.source ?? inferred?.source ?? (clickId === "fbclid" ? "facebook" : clickId === "gclid" ? "google" : undefined),
        medium: utm.medium ?? (hasUtm ? undefined : inferred?.medium ?? (clickId ? "cpc" : undefined)),
        referrer: refHost,
        clickId,
        landing: clip(window.location.pathname, MAX_LANDING_LEN),
        ts: Date.now(),
      });
    }

    const stored = readStored();
    const next: Attribution = { ...stored };
    let changed = false;

    if (!next.first) {
      // El primer contacto se fija en la primera visita, aunque sea directa:
      // "llegó directo" también es un dato.
      next.first =
        touch ??
        compact({ source: "(direct)", landing: clip(window.location.pathname, MAX_LANDING_LEN), ts: Date.now() });
      changed = true;
    }
    if (touch) {
      next.last = touch;
      changed = true;
    }
    if (changed) writeStored(next);

    return {
      attribution: next,
      isSessionStart,
      sessionReferrer: isSessionStart ? (document.referrer || "").slice(0, 300) : "",
      newTouch: touch,
    };
  } catch {
    return empty;
  }
}

/**
 * Atribución guardada, lista para adjuntar a una conversión. Si no hay nada
 * devuelve un objeto vacío (el servidor lo trata como "sin atribución").
 */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const stored = readStored();
    const out: Attribution = {};
    if (stored.first && typeof stored.first === "object") out.first = compact(stored.first);
    if (stored.last && typeof stored.last === "object" && hasCampaignData(stored.last)) out.last = compact(stored.last);
    return out;
  } catch {
    return {};
  }
}
