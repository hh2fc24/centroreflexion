import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

type PageviewInsert = Database["public"]["Tables"]["analytics_pageviews"]["Insert"];
type ConsentInsert = Database["public"]["Tables"]["analytics_consent_events"]["Insert"];

const BOT_UA_PATTERN =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|pingdom|uptime|monitor|headless|phantom|curl|wget|python-requests|go-http-client|scrapy|ahrefs|semrush|mj12bot|petalbot|bytespider/i;

export function detectBot(userAgent: string): boolean {
  if (!userAgent) return true; // sin UA casi siempre es script/bot
  return BOT_UA_PATTERN.test(userAgent);
}

export function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobile|iphone|android/.test(ua)) return "mobile";
  if (!ua) return "unknown";
  return "desktop";
}

export function getGeo(req: Request) {
  return {
    country: req.headers.get("x-vercel-ip-country") || "unknown",
    region: req.headers.get("x-vercel-ip-country-region") || "",
    city: req.headers.get("x-vercel-ip-city") ? decodeURIComponent(req.headers.get("x-vercel-ip-city")!) : "",
  };
}

export type PageviewInput = {
  path: string;
  referrer: string;
  ip: string;
  userAgent: string;
  country: string;
  region: string;
  city: string;
};

export async function recordPageview(input: PageviewInput) {
  const client = createAdminClient();
  if (!client) return; // Supabase no configurado: no romper la request pública.

  const isBot = detectBot(input.userAgent);
  const device = detectDevice(input.userAgent);

  const row: PageviewInsert = {
    path: input.path.slice(0, 300),
    referrer: input.referrer ? input.referrer.slice(0, 300) : null,
    ip: input.ip,
    country: input.country,
    region: input.region || null,
    city: input.city || null,
    user_agent: input.userAgent ? input.userAgent.slice(0, 400) : null,
    device,
    is_bot: isBot,
  };
  const table = client.from("analytics_pageviews") as unknown as {
    insert: (rows: PageviewInsert[]) => PromiseLike<unknown>;
  };
  await table.insert([row]);
}

export type ConsentInput = {
  choice: "accepted" | "rejected";
  path: string;
  ip: string;
  country: string;
};

export async function recordConsentEvent(input: ConsentInput) {
  const client = createAdminClient();
  if (!client) return;

  const row: ConsentInsert = {
    choice: input.choice,
    path: input.path ? input.path.slice(0, 300) : null,
    ip: input.ip,
    country: input.country,
  };
  const table = client.from("analytics_consent_events") as unknown as {
    insert: (rows: ConsentInsert[]) => PromiseLike<unknown>;
  };
  await table.insert([row]);
}

type PageviewRow = {
  id: string;
  created_at: string;
  path: string;
  referrer: string | null;
  ip: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  user_agent: string | null;
  device: string | null;
  is_bot: boolean;
};

function topCounts(items: (string | null | undefined)[], limit: number) {
  const counts = new Map<string, number>();
  for (const raw of items) {
    const key = raw && raw.trim() ? raw.trim() : "(desconocido)";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? null : 0; // sin base de comparación
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

const SANTIAGO_TZ = "America/Santiago";

function hourInSantiago(isoDate: string): number {
  const hourStr = new Intl.DateTimeFormat("en-US", {
    timeZone: SANTIAGO_TZ,
    hour: "2-digit",
    hour12: false,
  }).format(new Date(isoDate));
  // Intl puede devolver "24" para medianoche en algunos entornos; normalizamos a 0.
  const h = parseInt(hourStr, 10);
  return h === 24 ? 0 : h;
}

export async function getAnalyticsSummary(sinceIso: string, rangeMs: number) {
  const client = createAdminClient();
  if (!client) return null;

  const prevSinceIso = new Date(new Date(sinceIso).getTime() - rangeMs).toISOString();

  const [pageviewsRes, consentRes, prevPageviewsRes, prevConsentRes] = await Promise.all([
    client
      .from("analytics_pageviews")
      .select("*")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(5000),
    client.from("analytics_consent_events").select("choice, created_at").gte("created_at", sinceIso).limit(5000),
    client
      .from("analytics_pageviews")
      .select("is_bot")
      .gte("created_at", prevSinceIso)
      .lt("created_at", sinceIso)
      .limit(5000),
    client
      .from("analytics_consent_events")
      .select("choice")
      .gte("created_at", prevSinceIso)
      .lt("created_at", sinceIso)
      .limit(5000),
  ]);

  const rows = (pageviewsRes.data ?? []) as PageviewRow[];
  const consentRows = (consentRes.data ?? []) as { choice: string; created_at: string }[];
  const prevRows = (prevPageviewsRes.data ?? []) as { is_bot: boolean }[];
  const prevConsentRows = (prevConsentRes.data ?? []) as { choice: string }[];

  const humanRows = rows.filter((r) => !r.is_bot);
  const botRows = rows.filter((r) => r.is_bot);
  const uniqueIps = new Set(rows.map((r) => r.ip).filter(Boolean)).size;

  const consentAccepted = consentRows.filter((c) => c.choice === "accepted").length;
  const consentRejected = consentRows.filter((c) => c.choice === "rejected").length;

  const prevHuman = prevRows.filter((r) => !r.is_bot).length;
  const prevConsentAccepted = prevConsentRows.filter((c) => c.choice === "accepted").length;
  const prevConsentTotal = prevConsentRows.length;
  const prevConsentRate = prevConsentTotal ? (prevConsentAccepted / prevConsentTotal) * 100 : null;
  const consentTotal = consentAccepted + consentRejected;
  const consentRate = consentTotal ? (consentAccepted / consentTotal) * 100 : null;

  const nonChileHumanCountries = topCounts(
    humanRows.filter((r) => (r.country || "").toUpperCase() !== "CL").map((r) => r.country),
    10
  );

  const byDay = new Map<string, { human: number; bot: number }>();
  for (const r of rows) {
    const day = r.created_at.slice(0, 10);
    const bucket = byDay.get(day) ?? { human: 0, bot: 0 };
    if (r.is_bot) bucket.bot += 1;
    else bucket.human += 1;
    byDay.set(day, bucket);
  }
  const dailySeries = Array.from(byDay.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([date, v]) => ({ date, human: v.human, bot: v.bot, total: v.human + v.bot }));

  const byHour = new Map<number, number>();
  for (const r of humanRows) {
    const h = hourInSantiago(r.created_at);
    byHour.set(h, (byHour.get(h) ?? 0) + 1);
  }
  const hourlyDistribution = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    count: byHour.get(h) ?? 0,
  }));

  const byConsentDay = new Map<string, { accepted: number; rejected: number }>();
  for (const c of consentRows) {
    const day = c.created_at.slice(0, 10);
    const bucket = byConsentDay.get(day) ?? { accepted: 0, rejected: 0 };
    if (c.choice === "accepted") bucket.accepted += 1;
    else bucket.rejected += 1;
    byConsentDay.set(day, bucket);
  }
  const consentDailySeries = Array.from(byConsentDay.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([date, v]) => {
      const total = v.accepted + v.rejected;
      return {
        date,
        accepted: v.accepted,
        rejected: v.rejected,
        rate: total ? Math.round((v.accepted / total) * 1000) / 10 : 0,
      };
    });

  return {
    range: { since: sinceIso },
    totals: {
      pageviews: rows.length,
      human: humanRows.length,
      bot: botRows.length,
      uniqueIps,
      consentAccepted,
      consentRejected,
    },
    comparison: {
      humanChangePct: pctChange(humanRows.length, prevHuman),
      consentRateChangePct:
        consentRate !== null && prevConsentRate !== null
          ? Math.round((consentRate - prevConsentRate) * 10) / 10
          : null,
      consentRate: consentRate !== null ? Math.round(consentRate * 10) / 10 : null,
      previousHuman: prevHuman,
    },
    topPaths: topCounts(rows.map((r) => r.path), 10),
    topCountries: topCounts(rows.map((r) => r.country), 10),
    topReferrers: topCounts(
      rows.map((r) => r.referrer).filter((r) => r && !r.includes(process.env.NEXT_PUBLIC_SITE_URL ?? "###")),
      10
    ),
    topDevices: topCounts(rows.map((r) => r.device), 6),
    suspiciousNonChileCountries: nonChileHumanCountries,
    dailySeries,
    hourlyDistribution,
    consentDailySeries,
    recent: rows.slice(0, 100).map((r) => ({
      id: r.id,
      createdAt: r.created_at,
      path: r.path,
      referrer: r.referrer,
      ip: r.ip,
      country: r.country,
      region: r.region,
      city: r.city,
      userAgent: r.user_agent,
      device: r.device,
      isBot: r.is_bot,
    })),
  };
}
