import type { StateStorage } from "zustand/middleware";
import { memoryStorage } from "@/lib/editor/storage";

function sanitizeScope(input: string | null) {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (!/^[a-zA-Z0-9_-]{1,48}$/.test(trimmed)) return null;
  return trimmed;
}

function prefixedStorage(base: Storage, prefix: string): StateStorage {
  return {
    getItem: (name) => base.getItem(`${prefix}${name}`),
    setItem: (name, value) => base.setItem(`${prefix}${name}`, value),
    removeItem: (name) => base.removeItem(`${prefix}${name}`),
  };
}

export function getPersistStorage(): StateStorage {
  if (typeof window === "undefined") return memoryStorage;
  try {
    const url = new URL(window.location.href);
    const scope = sanitizeScope(url.searchParams.get("storageScope"));
    const isPreview = url.pathname.startsWith("/admin/preview");
    if (isPreview && scope) return prefixedStorage(window.localStorage, `crc.scope.${scope}.`);
  } catch {
    // ignore
  }
  return window.localStorage;
}

