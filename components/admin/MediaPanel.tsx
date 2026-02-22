"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
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

export function MediaPanel() {
  const { items, busy, uploadBusy, error, setError, reload, upload, remove } = useMediaLibrary();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => (it.originalName || it.filename).toLowerCase().includes(s) || it.url.toLowerCase().includes(s));
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

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Media Library</div>
            <div className="mt-1 text-xs text-white/50">Sube imágenes/archivos y reutilízalos en bloques.</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
              disabled={busy}
              onClick={() => reload()}
            >
              {busy ? "Cargando…" : "Refrescar"}
            </button>
            <button
              type="button"
              className={cn(
                "rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-xs font-semibold",
                uploadBusy && "opacity-70"
              )}
              disabled={uploadBusy}
              onClick={() => inputRef.current?.click()}
            >
              {uploadBusy ? "Subiendo…" : "Subir"}
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
          <div className="text-sm font-semibold text-white/80">Arrastra y suelta aquí</div>
          <div className="mt-1 text-xs text-white/50">o usa el botón “Subir”. (máx 20MB)</div>
        </div>

        <div className="mt-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
            placeholder="Buscar (nombre o URL)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {error ? <div className="mt-3 text-xs text-red-200">Error: {error}</div> : null}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-xs font-semibold text-white/70">Items ({filtered.length})</div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {filtered.map((it) => {
            const isImage = it.mime?.startsWith("image/");
            const previewUrl = isImage ? (it.variants?.thumb || it.url) : it.url;
            return (
              <div key={it.id} className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                <div className="relative aspect-video bg-black/30">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt={it.originalName} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-white/60">{it.mime || "file"}</div>
                  )}
                </div>
                <div className="p-3">
                  <div className="truncate text-xs font-semibold text-white/80">{it.originalName || it.filename}</div>
                  <div className="mt-1 truncate text-[11px] text-white/50">{it.url}</div>
                  <div className="mt-1 text-[11px] text-white/50">
                    {fmtBytes(it.size)} · {new Date(it.createdAt).toLocaleString()}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(it.url);
                        } catch {
                          // ignore
                        }
                      }}
                    >
                      Copiar URL
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
                      onClick={() => window.open(it.url, "_blank")}
                    >
                      Abrir
                    </button>
                    <button
                      type="button"
                      className="ml-auto rounded-xl px-3 py-2 text-[11px] font-semibold text-white/60 hover:text-red-200 hover:bg-white/10 transition"
                      onClick={async () => {
                        const ok = window.confirm("¿Eliminar este archivo?");
                        if (!ok) return;
                        try {
                          await remove(it.id);
                        } catch (e: unknown) {
                          const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
                          setError(message);
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!filtered.length ? <div className="mt-3 text-xs text-white/50">No hay archivos aún.</div> : null}
      </div>
    </div>
  );
}
