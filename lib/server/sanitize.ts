function clampLen(s: string, maxLen: number) {
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen);
}

export function sanitizePlainText(input: unknown, { maxLen = 2000 }: { maxLen?: number } = {}) {
  const s = typeof input === "string" ? input : input == null ? "" : String(input);
  // Remove ASCII control chars except \n and \t
  const cleaned = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  return clampLen(cleaned, maxLen);
}

export function sanitizeUrl(input: unknown, { allowRelative = true, maxLen = 2048 }: { allowRelative?: boolean; maxLen?: number } = {}) {
  const raw = sanitizePlainText(input, { maxLen }).trim();
  if (!raw) return "";
  const lower = raw.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) return "";
  if (allowRelative && raw.startsWith("/")) return raw;
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return u.toString();
  } catch {
    return "";
  }
}

