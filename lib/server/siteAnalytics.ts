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

export async function getAnalyticsSummary(sinceIso: string) {
  const client = createAdminClient();
  if (!client) return null;

  const [pageviewsRes, consentRes] = await Promise.all([
    client
      .from("analytics_pageviews")
      .select("*")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(5000),
    client.from("analytics_consent_events").select("choice").gte("created_at", sinceIso).limit(5000),
  ]);

  const rows = (pageviewsRes.data ?? []) as PageviewRow[];
  const consentRows = (consentRes.data ?? []) as { choice: string }[];

  const humanRows = rows.filter((r) => !r.is_bot);
  const botRows = rows.filter((r) => r.is_bot);
  const uniqueIps = new Set(rows.map((r) => r.ip).filter(Boolean)).size;

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

  return {
    range: { since: sinceIso },
    totals: {
      pageviews: rows.length,
      human: humanRows.length,
      bot: botRows.length,
      uniqueIps,
      consentAccepted: consentRows.filter((c) => c.choice === "accepted").length,
      consentRejected: consentRows.filter((c) => c.choice === "rejected").length,
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
