export const DEFAULT_SITE_URL = "https://centrodereflexionescriticas.com";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}
