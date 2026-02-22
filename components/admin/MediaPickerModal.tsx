"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/lib/editor/mediaClient";
import { useMediaLibrary } from "@/lib/editor/useMediaLibrary";

function fmtBytes(n: number) {
  if (!Number.isFinite(n)) return "";
  const units = ["B", "KB", "MB", "GB"] as const;
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function isVisual(it: MediaItem) {
  return it.mime?.startsWith("image/") || it.mime?.startsWith("video/");
}

function VisualThumb({ it, className }: { it: MediaItem; className: string }) {
  if (it.mime?.startsWith("video/")) {
    return (
      <video
        src={it.url}
        className={className}
        muted
        playsInline
        preload="metadata"
      />
    );
  }
  const src = it.variants?.thumb || it.url;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={it.originalName} className={className} loading="lazy" />;
}

export function MediaPickerModal({
  open,
  title = "Elegir media",
  selectedUrl,
  onSelect,
  onClose,
}: {
  open: boolean;
  title?: string;
  selectedUrl?: string | null;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const { items, recent, busy, uploadBusy, error, setError, reload, upload } = useMediaLibrary({ autoLoad: open });
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [activeUrl, setActiveUrl] = useState<string>(() => selectedUrl ?? "");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const base = items.filter((it) => isVisual(it));
    if (!s) return base;
    return base.filter((it) => (it.originalName || it.filename).toLowerCase().includes(s) || it.url.toLowerCase().includes(s));
  }, [items, q]);

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      await upload(file);
    },
    [upload]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-6"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white/90">{title}</div>
            <div className="mt-1 truncate text-[11px] text-white/50">Sube, busca y selecciona una imagen/video.</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
              onClick={() => reload()}
              disabled={busy}
            >
              {busy ? "Cargando…" : "Refrescar"}
            </button>
            <button
              type="button"
              className={cn(
                "rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-xs font-semibold",
                uploadBusy && "opacity-70"
              )}
              onClick={() => inputRef.current?.click()}
              disabled={uploadBusy}
            >
              {uploadBusy ? "Subiendo…" : "Subir"}
            </button>
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
              onClick={() => onClose()}
            >
              Cerrar
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            await upload(f);
            e.currentTarget.value = "";
          }}
        />

        <div className="grid grid-cols-1 gap-0 md:grid-cols-[1fr_340px]">
          <div className="border-b border-white/10 p-5 md:border-b-0 md:border-r">
            <div className="flex items-center gap-2">
              <input
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                placeholder="Buscar por nombre…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button
                type="button"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold hover:bg-white/10 transition"
                onClick={async () => {
                  try {
                    if (!activeUrl) return;
                    await navigator.clipboard.writeText(activeUrl);
                  } catch {
                    // ignore
                  }
                }}
              >
                Copiar URL
              </button>
            </div>

            <div
              className={cn(
                "mt-4 rounded-2xl border border-dashed px-4 py-6 text-center transition",
                "border-white/15 bg-black/20 hover:bg-black/25"
              )}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
              }}
              onDrop={onDrop}
            >
              <div className="text-sm font-semibold text-white/80">Arrastra y suelta para subir</div>
              <div className="mt-1 text-xs text-white/50">o usa “Subir”.</div>
            </div>

            {error ? (
              <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                Error: {error}
              </div>
            ) : null}

            <div className="mt-5">
              <div className="text-xs font-semibold text-white/70">Recientes</div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {busy && !recent.length ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl border border-white/10 bg-white/5 animate-pulse" />
                  ))
                ) : (
                  recent
                    .filter((it) => isVisual(it))
                    .slice(0, 8)
                    .map((it) => (
                      <button
                        key={it.id}
                        type="button"
                        className={cn(
                          "relative aspect-square overflow-hidden rounded-xl border transition",
                          activeUrl === it.url ? "border-cyan-500/40 ring-2 ring-cyan-500/20" : "border-white/10 hover:border-white/20"
                        )}
                        onClick={() => {
                          setError(null);
                          setActiveUrl(it.url);
                        }}
                        title={it.originalName || it.filename}
                      >
                        <VisualThumb it={it} className="h-full w-full object-cover" />
                      </button>
                    ))
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-white/70">Galería</div>
                <div className="text-[11px] text-white/45">{filtered.length} items</div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {busy && !items.length ? (
                  Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-video rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
                  ))
                ) : filtered.length ? (
                  filtered.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      className={cn(
                        "group relative overflow-hidden rounded-2xl border bg-black/20 transition",
                        activeUrl === it.url ? "border-cyan-500/40 ring-2 ring-cyan-500/20" : "border-white/10 hover:border-white/20"
                      )}
                      onClick={() => {
                        setError(null);
                        setActiveUrl(it.url);
                      }}
                      title={it.originalName || it.filename}
                    >
                      <div className="aspect-video bg-black/30">
                        <VisualThumb it={it} className="h-full w-full object-cover" />
                      </div>
                      <div className="p-3 text-left">
                        <div className="truncate text-[11px] font-semibold text-white/80">{it.originalName || it.filename}</div>
                        <div className="mt-1 text-[11px] text-white/45">{fmtBytes(it.size)}</div>
                      </div>
                      {activeUrl === it.url ? (
                        <div className="absolute left-2 top-2 rounded-full bg-cyan-500/20 px-2 py-1 text-[11px] font-semibold text-cyan-100">
                          Seleccionado
                        </div>
                      ) : null}
                    </button>
                  ))
                ) : (
                  <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                    No hay resultados. Prueba otro nombre o sube un archivo.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="text-xs font-semibold text-white/70">Selección</div>
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
              <div className="relative aspect-video bg-black/30">
                {activeUrl ? (
                  (() => {
                    const it = items.find((x) => x.url === activeUrl) ?? null;
                    if (it?.mime?.startsWith("video/")) {
                      return <video src={activeUrl} className="h-full w-full object-cover" muted playsInline controls preload="metadata" />;
                    }
                    // eslint-disable-next-line @next/next/no-img-element
                    return <img src={activeUrl} alt="Selección" className="h-full w-full object-cover" loading="lazy" />;
                  })()
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-white/60">Sin selección</div>
                )}
              </div>
              <div className="p-4">
                <div className="truncate text-[11px] text-white/50">{activeUrl || "—"}</div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    className={cn(
                      "flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3 text-sm font-semibold",
                      !activeUrl && "opacity-70"
                    )}
                    disabled={!activeUrl}
                    onClick={() => {
                      if (!activeUrl) return;
                      onSelect(activeUrl);
                      onClose();
                    }}
                  >
                    Usar este asset
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 transition",
                      !selectedUrl && "opacity-70"
                    )}
                    disabled={!selectedUrl}
                    onClick={() => {
                      onSelect("");
                      onClose();
                    }}
                  >
                    Quitar
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                    onClick={async () => {
                      try {
                        if (!activeUrl) return;
                        await navigator.clipboard.writeText(activeUrl);
                      } catch {
                        // ignore
                      }
                    }}
                    disabled={!activeUrl}
                  >
                    Copiar URL
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                    onClick={() => {
                      if (!activeUrl) return;
                      window.open(activeUrl, "_blank");
                    }}
                    disabled={!activeUrl}
                  >
                    Abrir
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs font-semibold text-white/70">Tip</div>
              <div className="mt-1 text-[11px] text-white/50">
                Si necesitas pegar una URL externa, puedes usar “Copiar URL” como fallback y pegarla en un campo.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
