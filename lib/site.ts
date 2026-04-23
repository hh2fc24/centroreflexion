export const DEFAULT_SITE_URL = "https://centrodereflexionescriticas.com";
export const DEFAULT_GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzvGEHqK9-RRqRZ99uXZrjS5tmAumFmGI3X8D2LKxWZ53T4U4xFP0k4qUrywPAd4kZs/exec";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export function getGoogleAppsScriptUrl() {
  return process.env.CRC_GOOGLE_APPS_SCRIPT_URL || DEFAULT_GOOGLE_APPS_SCRIPT_URL;
}
