export type MediaItem = {
  id: string;
  createdAt: number;
  url: string;
  variants?: { webp?: string; avif?: string; thumb?: string };
  width?: number;
  height?: number;
  filename: string;
  originalName: string;
  mime: string;
  size: number;
};

export async function listMedia() {
  const r = await fetch("/api/media", { cache: "no-store" });
  const json = (await r.json()) as { ok?: boolean; items?: unknown; error?: string };
  if (!json.ok) throw new Error(json.error || "fetch_failed");
  const items = Array.isArray(json.items) ? (json.items as MediaItem[]) : [];
  return items;
}

export async function uploadMedia(file: File) {
  const fd = new FormData();
  fd.set("file", file);
  const r = await fetch("/api/media/upload", { method: "POST", body: fd });
  const json = (await r.json()) as { ok?: boolean; item?: unknown; error?: string; detail?: string };
  if (!json.ok) throw new Error(json.detail || json.error || "upload_failed");
  return json.item as MediaItem;
}

export async function deleteMedia(id: string) {
  const r = await fetch(`/api/media?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  const json = (await r.json()) as { ok?: boolean; error?: string; detail?: string };
  if (!json.ok) throw new Error(json.detail || json.error || "delete_failed");
  return true;
}
