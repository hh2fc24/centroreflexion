"use client";

import { useMemo, useState } from "react";
import type { BlockAnimationDirection, BlockAnimationType, BlockStyle, DeviceKind, SiteBlock } from "@/lib/editor/types";
import { cn } from "@/lib/utils";
import { useEditor, usePages, useTemplates } from "@/lib/editor/hooks";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { getBlockDefinition } from "@/components/site/blocks/blockRegistry";

type Tab = "content" | "style" | "layout" | "responsive";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function mergeStyle(base: BlockStyle, partial: Partial<BlockStyle>) {
  return { ...base, ...partial };
}

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

export function BlockInspector() {
  const [tab, setTab] = useState<Tab>("content");
  const [tplName, setTplName] = useState("");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTitle, setMediaTitle] = useState("Elegir media");
  const [mediaSelected, setMediaSelected] = useState<string | null>(null);
  const [mediaTarget, setMediaTarget] = useState<
    | null
    | { kind: "hero.backgroundImage" }
    | { kind: "hero.backgroundVideo" }
    | { kind: "hero.backgroundVideoPoster" }
    | { kind: "logos.logo"; index: number }
  >(null);
  const { selectedBlockId, selectedBlockPageId, selectedPage, selectBlock } = useEditor();
  const { pages, updateBlockStyle, setBlockPreset, updateBlock, updateBlockData, insertBlock } = usePages();
  const { blocks: templates, addBlockTemplate, deleteBlockTemplate } = useTemplates();

  const ctx = useMemo(() => {
    if (!selectedBlockId) return null;
    const pageId = selectedBlockPageId ?? selectedPage;
    const page = pages.find((p) => p.id === pageId) ?? null;
    const block = page?.blocks.find((b) => b.id === selectedBlockId) ?? null;
    if (!page || !block) return null;
    return { pageId, block };
  }, [pages, selectedBlockId, selectedBlockPageId, selectedPage]);

  if (!ctx) return null;

  const b = ctx.block;
  const openPicker = (target: NonNullable<typeof mediaTarget>, title: string, current: string | null) => {
    setMediaTarget(target);
    setMediaTitle(title);
    setMediaSelected(current);
    setMediaOpen(true);
  };

  const base: BlockStyle =
    b.style?.base ?? ({
      paddingY: 72,
      paddingX: 16,
      maxWidth: 1200,
      background: "transparent",
      textAlign: "left",
      radius: 16,
      shadow: 0.2,
    } as BlockStyle);
  const tablet = b.style?.tablet ?? {};
  const mobile = b.style?.mobile ?? {};

  const setBase = (partial: Partial<BlockStyle>) =>
    updateBlockStyle(ctx.pageId, b.id, { ...b.style, base: mergeStyle(base, partial) });

  const setResponsive = (device: Exclude<DeviceKind, "desktop">, partial: Partial<BlockStyle>) => {
    const next = device === "tablet" ? { ...tablet, ...partial } : { ...mobile, ...partial };
    if (device === "tablet") updateBlockStyle(ctx.pageId, b.id, { ...b.style, tablet: next });
    else updateBlockStyle(ctx.pageId, b.id, { ...b.style, mobile: next });
  };

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold">Inspector</div>
          <div className="mt-1 text-xs text-white/60 break-all">
            {ctx.pageId} · {b.type} · {b.id}
          </div>
        </div>
        <button
          type="button"
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
          onClick={() => selectBlock(null, null)}
        >
          Cerrar
        </button>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {(["content", "style", "layout", "responsive"] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={cn(
              "rounded-xl px-3 py-2 text-[11px] font-semibold border transition",
              tab === t ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-100" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            )}
            onClick={() => setTab(t)}
          >
            {t === "content" ? "Contenido" : t === "style" ? "Estilo" : t === "layout" ? "Layout" : "Responsive"}
          </button>
        ))}
      </div>

      {tab === "content" ? (
        <div className="mt-4 space-y-3">
          {mediaOpen ? (
            <MediaPickerModal
              open={mediaOpen}
              title={mediaTitle}
              selectedUrl={mediaSelected}
              onClose={() => setMediaOpen(false)}
              onSelect={(url) => {
                const target = mediaTarget;
                if (!target) return;
                if (target.kind === "hero.backgroundImage") {
                  const prev = (b.data ?? {}) as Record<string, unknown>;
                  updateBlockData(ctx.pageId, b.id, { ...prev, backgroundImage: url || "" });
                }
                if (target.kind === "hero.backgroundVideo") {
                  const prev = (b.data ?? {}) as Record<string, unknown>;
                  updateBlockData(ctx.pageId, b.id, { ...prev, backgroundVideo: url || "" });
                }
                if (target.kind === "hero.backgroundVideoPoster") {
                  const prev = (b.data ?? {}) as Record<string, unknown>;
                  updateBlockData(ctx.pageId, b.id, { ...prev, backgroundVideoPoster: url || "" });
                }
                if (target.kind === "logos.logo") {
                  const data = (b.data ?? {}) as { title?: string; logos?: { id?: string; src?: string; alt?: string }[] };
                  const logos = Array.isArray(data.logos) ? [...data.logos] : [];
                  if (logos[target.index]) logos[target.index] = { ...logos[target.index], src: url || "" };
                  updateBlockData(ctx.pageId, b.id, { ...(data as Record<string, unknown>), logos });
                }
              }}
            />
          ) : null}

          <label className="block text-xs text-white/60">
            Preset
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              value={b.preset}
              onChange={(e) => setBlockPreset(ctx.pageId, b.id, e.target.value as SiteBlock["preset"])}
            >
              <option value="minimal">Minimal</option>
              <option value="corporate">Corporate</option>
              <option value="premium">Premium</option>
              <option value="bold">Bold</option>
            </select>
          </label>

	          {(() => {
	            const def = getBlockDefinition(b.type);
	            const options = def?.variants ?? null;
	            if (!options) return null;
	            const current = typeof b.variant === "string" && b.variant ? b.variant : options[0];
	            return (
	              <label className="block text-xs text-white/60">
	                Variante (layout)
                <select
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                  value={current}
                  onChange={(e) => updateBlock(ctx.pageId, b.id, { variant: e.target.value })}
                >
                  {options.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-[11px] text-white/45">Cambia el layout sin tocar tu contenido.</div>
              </label>
            );
          })()}

          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Visible</div>
              <div className="text-xs text-white/50">Oculta o muestra este bloque.</div>
            </div>
            <input
              type="checkbox"
              checked={b.visible}
              onChange={(e) => updateBlock(ctx.pageId, b.id, { visible: e.target.checked })}
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Bloqueado</div>
              <div className="text-xs text-white/50">Evita mover/duplicar/borrar accidentalmente.</div>
            </div>
            <input
              type="checkbox"
              checked={b.locked}
              onChange={(e) => updateBlock(ctx.pageId, b.id, { locked: e.target.checked })}
            />
          </label>

          {b.type === "hero" ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
	              <div className="text-sm font-semibold">Media</div>
	              <div className="mt-1 text-xs text-white/50">Elige imagen (y opcionalmente video) desde tu librería.</div>
	              {(() => {
	                const data = (b.data ?? {}) as { backgroundImage?: string; backgroundVideo?: string; backgroundVideoPoster?: string };
	                const url = typeof data.backgroundImage === "string" ? data.backgroundImage : "";
	                const vurl = typeof data.backgroundVideo === "string" ? data.backgroundVideo : "";
	                const purl = typeof data.backgroundVideoPoster === "string" ? data.backgroundVideoPoster : "";
	                const isVideo = (b.variant ?? "") === "video-bg";
	                return (
                  <div className="mt-3">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                      <div className="relative aspect-video">
                        {url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={url} alt="" className="h-full w-full object-cover opacity-95" loading="lazy" />
                        ) : (
                          <div className="grid h-full place-items-center text-sm text-white/60">Sin imagen</div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="truncate text-[11px] text-white/50">{url || "—"}</div>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-[11px] font-semibold"
                            onClick={() => openPicker({ kind: "hero.backgroundImage" }, "Hero · Imagen de fondo", url || null)}
                          >
                            Elegir / Reemplazar
                          </button>
                          <button
                            type="button"
                            className={cn(
                              "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition",
                              !url && "opacity-70"
                            )}
                            disabled={!url}
                            onClick={() => {
                              const prev = (b.data ?? {}) as Record<string, unknown>;
                              updateBlockData(ctx.pageId, b.id, { ...prev, backgroundImage: "" });
                            }}
                          >
                            Quitar
                          </button>
                        </div>

	                        {isVideo ? (
	                          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
	                            <div className="relative aspect-video bg-black/30">
	                              {vurl ? (
	                                <video
	                                  src={vurl}
	                                  poster={purl || undefined}
	                                  className="h-full w-full object-cover"
	                                  muted
	                                  playsInline
	                                  controls
	                                  preload="metadata"
	                                />
	                              ) : (
	                                <div className="grid h-full place-items-center text-sm text-white/60">Sin video</div>
	                              )}
	                            </div>
	                            <div className="p-3">
	                              <div className="truncate text-[11px] text-white/50">{vurl || "—"}</div>
	                              <div className="mt-3 flex items-center gap-2">
                                <button
                                  type="button"
                                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-[11px] font-semibold"
                                  onClick={() => openPicker({ kind: "hero.backgroundVideo" }, "Hero · Video de fondo", vurl || null)}
                                >
                                  Elegir / Reemplazar
	                                </button>
	                                <button
	                                  type="button"
	                                  className={cn(
	                                    "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition",
	                                    !vurl && "opacity-70"
	                                  )}
	                                  disabled={!vurl}
	                                  onClick={() => {
	                                    const prev = (b.data ?? {}) as Record<string, unknown>;
	                                    updateBlockData(ctx.pageId, b.id, { ...prev, backgroundVideo: "" });
	                                  }}
	                                >
	                                  Quitar
	                                </button>
	                              </div>

	                              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
	                                <div className="text-[11px] font-semibold text-white/80">Poster (opcional)</div>
	                                <div className="mt-1 truncate text-[11px] text-white/45">{purl || "—"}</div>
	                                <div className="mt-3 flex items-center gap-2">
	                                  <button
	                                    type="button"
	                                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition"
	                                    onClick={() => openPicker({ kind: "hero.backgroundVideoPoster" }, "Hero · Poster de video", purl || null)}
	                                  >
	                                    Elegir / Reemplazar
	                                  </button>
	                                  <button
	                                    type="button"
	                                    className={cn(
	                                      "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition",
	                                      !purl && "opacity-70"
	                                    )}
	                                    disabled={!purl}
	                                    onClick={() => {
	                                      const prev = (b.data ?? {}) as Record<string, unknown>;
	                                      updateBlockData(ctx.pageId, b.id, { ...prev, backgroundVideoPoster: "" });
	                                    }}
	                                  >
	                                    Quitar
	                                  </button>
	                                </div>
	                              </div>
	                            </div>
	                          </div>
	                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : null}

          {b.type === "logos" ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Logos · Media</div>
              <div className="mt-1 text-xs text-white/50">Reemplaza logos con un picker visual.</div>
              {(() => {
                const data = (b.data ?? {}) as { logos?: { id?: string; src?: string; alt?: string }[] };
                const logos = Array.isArray(data.logos) ? data.logos : [];
                return logos.length ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {logos.map((l, idx) => {
                      const url = typeof l.src === "string" ? l.src : "";
                      return (
                        <div key={l.id || idx} className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                          <div className="relative aspect-video bg-black/30">
                            {url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={url} alt={l.alt || ""} className="h-full w-full object-contain p-4" loading="lazy" />
                            ) : (
                              <div className="grid h-full place-items-center text-[11px] text-white/60">Sin logo</div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="truncate text-[11px] text-white/50">{url || "—"}</div>
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                type="button"
                                className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-[11px] font-semibold"
                                onClick={() => openPicker({ kind: "logos.logo", index: idx }, `Logos · Logo ${idx + 1}`, url || null)}
                              >
                                Elegir
                              </button>
                              <button
                                type="button"
                                className={cn(
                                  "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold hover:bg-white/10 transition",
                                  !url && "opacity-70"
                                )}
                                disabled={!url}
                                onClick={() => {
                                  const next = [...logos];
                                  next[idx] = { ...l, src: "" };
                                  updateBlockData(ctx.pageId, b.id, { ...(data as Record<string, unknown>), logos: next });
                                }}
                              >
                                Quitar
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-white/50">Agrega logos desde el bloque en el canvas y vuelve aquí para reemplazarlos.</div>
                );
              })()}
            </div>
          ) : null}

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">Animación</div>
            <div className="mt-1 text-xs text-white/50">Se aplica al publicar (en el sitio público).</div>
            {(() => {
              const a = b.animation ?? { type: "none" as const };
              return (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label className="text-xs text-white/60">
                    Tipo
                    <select
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                      value={a.type}
                      onChange={(e) => {
                        const type = e.target.value as BlockAnimationType;
                        const next = type === "none" ? undefined : { ...a, type };
                        updateBlock(ctx.pageId, b.id, { animation: next });
                      }}
                    >
                      <option value="none">None</option>
                      <option value="fade">Fade</option>
                      <option value="slide">Slide</option>
                      <option value="zoom">Zoom</option>
                    </select>
                  </label>
                  <label className="text-xs text-white/60">
                    Dirección
                    <select
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                      value={a.direction ?? "up"}
                      onChange={(e) =>
                        updateBlock(ctx.pageId, b.id, { animation: { ...a, direction: e.target.value as BlockAnimationDirection } })
                      }
                      disabled={!b.animation || b.animation.type === "none" || b.animation.type === "fade" || b.animation.type === "zoom"}
                    >
                      <option value="up">Up</option>
                      <option value="down">Down</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </label>
                  <label className="text-xs text-white/60">
                    Delay (ms)
                    <input
                      type="number"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                      value={a.delayMs ?? 0}
                      onChange={(e) => updateBlock(ctx.pageId, b.id, { animation: { ...a, delayMs: Number(e.target.value) } })}
                      disabled={!b.animation || b.animation.type === "none"}
                    />
                  </label>
                  <label className="text-xs text-white/60">
                    Duración (ms)
                    <input
                      type="number"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                      value={a.durationMs ?? 500}
                      onChange={(e) => updateBlock(ctx.pageId, b.id, { animation: { ...a, durationMs: Number(e.target.value) } })}
                      disabled={!b.animation || b.animation.type === "none"}
                    />
                  </label>
                </div>
              );
            })()}
          </div>

          {b.type === "embed" ? (
            <label className="block text-xs text-white/60">
              URL embed
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                value={((b.data as unknown as { src?: string })?.src ?? "")}
                onChange={(e) =>
                  updateBlockData(ctx.pageId, b.id, { ...(b.data as unknown as Record<string, unknown>), src: e.target.value })
                }
              />
            </label>
          ) : null}

          {b.type === "form" ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold">Form Builder</div>
              <div className="mt-1 text-xs text-white/50">Configura campos, validación y textos.</div>

              {(() => {
                type FieldType = "text" | "email" | "tel" | "textarea" | "select" | "checkbox";
                type Field = {
                  id: string;
                  type: FieldType;
                  label: string;
                  key: string;
                  required: boolean;
                  placeholder?: string;
                  options?: string[];
                };
                type FormData = {
                  title?: string;
                  subtitle?: string;
                  submitLabel?: string;
                  successMessage?: string;
                  fields?: Field[];
                };

                const data = (b.data ?? {}) as FormData;
                const fields = Array.isArray(data.fields) ? (data.fields as Field[]) : [];

                const commit = (next: FormData) => updateBlockData(ctx.pageId, b.id, next);

                const move = (from: number, to: number) => {
                  if (from === to) return;
                  const next = [...fields];
                  const [item] = next.splice(from, 1);
                  if (!item) return;
                  next.splice(Math.max(0, Math.min(next.length, to)), 0, item);
                  commit({ ...data, fields: next });
                };

                return (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="block text-xs text-white/60">
                        Texto botón
                        <input
                          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                          value={data.submitLabel ?? "Enviar"}
                          onChange={(e) => commit({ ...data, submitLabel: e.target.value })}
                        />
                      </label>
                      <label className="block text-xs text-white/60">
                        Mensaje éxito
                        <input
                          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
                          value={data.successMessage ?? "¡Listo!"}
                          onChange={(e) => commit({ ...data, successMessage: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-white/70">Campos</div>
                      <button
                        type="button"
                        className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-[11px] font-semibold"
                        onClick={() => {
                          const id = newId("fld");
                          const next: Field = {
                            id,
                            type: "text",
                            label: "Nuevo campo",
                            key: "field",
                            required: false,
                            placeholder: "",
                          };
                          commit({ ...data, fields: [...fields, next] });
                        }}
                      >
                        + Campo
                      </button>
                    </div>

                    {fields.length ? (
                      <div className="space-y-2">
                        {fields.map((f, idx) => (
                          <div key={f.id || idx} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-xs font-semibold text-white/75 truncate">
                                {idx + 1}. {f.label || "(sin label)"}{" "}
                                <span className="text-white/40">· {f.type}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/10 transition"
                                  onClick={() => move(idx, idx - 1)}
                                  disabled={idx === 0}
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/10 transition"
                                  onClick={() => move(idx, idx + 1)}
                                  disabled={idx === fields.length - 1}
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg px-2 py-1 text-[11px] font-semibold text-white/60 hover:text-red-200 hover:bg-white/10 transition"
                                  onClick={() => commit({ ...data, fields: fields.filter((_, i) => i !== idx) })}
                                  aria-label="Eliminar campo"
                                >
                                  ⌫
                                </button>
                              </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3">
                              <label className="block text-[11px] text-white/60">
                                Label
                                <input
                                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-xs outline-none"
                                  value={f.label ?? ""}
                                  onChange={(e) => {
                                    const next = [...fields];
                                    next[idx] = { ...f, label: e.target.value };
                                    commit({ ...data, fields: next });
                                  }}
                                />
                              </label>
                              <label className="block text-[11px] text-white/60">
                                Key (name/email/phone/message)
                                <input
                                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-xs outline-none"
                                  value={f.key ?? ""}
                                  onChange={(e) => {
                                    const next = [...fields];
                                    next[idx] = { ...f, key: e.target.value };
                                    commit({ ...data, fields: next });
                                  }}
                                />
                              </label>
                              <label className="block text-[11px] text-white/60">
                                Tipo
                                <select
                                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-xs outline-none"
                                  value={f.type}
                                  onChange={(e) => {
                                    const next = [...fields];
                                    next[idx] = { ...f, type: e.target.value as FieldType };
                                    commit({ ...data, fields: next });
                                  }}
                                >
                                  <option value="text">Text</option>
                                  <option value="email">Email</option>
                                  <option value="tel">Tel</option>
                                  <option value="textarea">Textarea</option>
                                  <option value="select">Select</option>
                                  <option value="checkbox">Checkbox</option>
                                </select>
                              </label>
                              <label className="block text-[11px] text-white/60">
                                Placeholder
                                <input
                                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-xs outline-none"
                                  value={f.placeholder ?? ""}
                                  onChange={(e) => {
                                    const next = [...fields];
                                    next[idx] = { ...f, placeholder: e.target.value };
                                    commit({ ...data, fields: next });
                                  }}
                                />
                              </label>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <label className="inline-flex items-center gap-2 text-xs text-white/60">
                                <input
                                  type="checkbox"
                                  checked={!!f.required}
                                  onChange={(e) => {
                                    const next = [...fields];
                                    next[idx] = { ...f, required: e.target.checked };
                                    commit({ ...data, fields: next });
                                  }}
                                />
                                Requerido
                              </label>
                            </div>

                            {f.type === "select" ? (
                              <div className="mt-3">
                                <label className="block text-[11px] text-white/60">
                                  Opciones (una por línea)
                                  <textarea
                                    className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-2 py-2 text-xs outline-none"
                                    rows={3}
                                    value={(f.options ?? []).join("\n")}
                                    onChange={(e) => {
                                      const opts = e.target.value
                                        .split("\n")
                                        .map((x) => x.trim())
                                        .filter(Boolean);
                                      const next = [...fields];
                                      next[idx] = { ...f, options: opts };
                                      commit({ ...data, fields: next });
                                    }}
                                  />
                                </label>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-white/50">Sin campos aún.</div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : null}

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold">Plantillas</div>
            <div className="mt-1 text-xs text-white/50">Guarda este bloque y reutilízalo.</div>

            <div className="mt-3 flex items-center gap-2">
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                placeholder="Nombre de plantilla (ej: Hero Premium)"
                value={tplName}
                onChange={(e) => setTplName(e.target.value)}
              />
              <button
                type="button"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-xs font-semibold"
                onClick={() => {
                  addBlockTemplate(tplName || `${b.type} (${b.preset})`, b);
                  setTplName("");
                }}
              >
                Guardar
              </button>
            </div>

            {templates.length ? (
              <div className="mt-3 space-y-2">
                {templates.slice().reverse().slice(0, 6).map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-white/80">{t.name}</div>
                      <div className="truncate text-[11px] text-white/50">{t.block.type}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/80 hover:bg-white/10 transition"
                        onClick={() => insertBlock(ctx.pageId, t.block, b.id)}
                      >
                        Insertar
                      </button>
                      <button
                        type="button"
                        className="rounded-lg px-2 py-1 text-[11px] font-semibold text-white/60 hover:text-red-200 hover:bg-white/10 transition"
                        onClick={() => deleteBlockTemplate(t.id)}
                        aria-label="Eliminar plantilla"
                      >
                        ⌫
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "style" ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-xs text-white/60">
            Fondo
            <input
              type="color"
              className="mt-2 h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
              value={base.background}
              onChange={(e) => setBase({ background: e.target.value })}
            />
          </label>
          <label className="text-xs text-white/60">
            Alineación
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              value={base.textAlign}
              onChange={(e) => setBase({ textAlign: e.target.value as BlockStyle["textAlign"] })}
            >
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
            </select>
          </label>
          <label className="text-xs text-white/60">
            Radio
            <input
              type="range"
              min={0}
              max={48}
              step={1}
              value={base.radius}
              onChange={(e) => setBase({ radius: Number(e.target.value) })}
              className="mt-2 w-full"
            />
          </label>
          <label className="text-xs text-white/60">
            Sombra
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={clamp(base.shadow, 0, 1)}
              onChange={(e) => setBase({ shadow: Number(e.target.value) })}
              className="mt-2 w-full"
            />
          </label>
        </div>
      ) : null}

      {tab === "layout" ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-xs text-white/60">
            Padding Y
            <input
              type="number"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              value={base.paddingY}
              onChange={(e) => setBase({ paddingY: Number(e.target.value) })}
            />
          </label>
          <label className="text-xs text-white/60">
            Padding X
            <input
              type="number"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              value={base.paddingX}
              onChange={(e) => setBase({ paddingX: Number(e.target.value) })}
            />
          </label>
          <label className="text-xs text-white/60">
            Max width
            <input
              type="number"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
              value={base.maxWidth}
              onChange={(e) => setBase({ maxWidth: Number(e.target.value) })}
            />
          </label>
        </div>
      ) : null}

      {tab === "responsive" ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs font-semibold text-white/70">Visibilidad por dispositivo</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="inline-flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70">
                Tablet
                <input
                  type="checkbox"
                  checked={b.visibleOn?.tablet !== false}
                  onChange={(e) =>
                    updateBlock(ctx.pageId, b.id, { visibleOn: { ...(b.visibleOn ?? {}), tablet: e.target.checked } })
                  }
                />
              </label>
              <label className="inline-flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70">
                Mobile
                <input
                  type="checkbox"
                  checked={b.visibleOn?.mobile !== false}
                  onChange={(e) =>
                    updateBlock(ctx.pageId, b.id, { visibleOn: { ...(b.visibleOn ?? {}), mobile: e.target.checked } })
                  }
                />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs font-semibold text-white/70">Tablet (≤ 1024px)</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="text-xs text-white/60">
                Padding Y
                <input
                  type="number"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                  value={tablet.paddingY ?? base.paddingY}
                  onChange={(e) => setResponsive("tablet", { paddingY: Number(e.target.value) })}
                />
              </label>
              <label className="text-xs text-white/60">
                Padding X
                <input
                  type="number"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                  value={tablet.paddingX ?? base.paddingX}
                  onChange={(e) => setResponsive("tablet", { paddingX: Number(e.target.value) })}
                />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs font-semibold text-white/70">Mobile (≤ 640px)</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="text-xs text-white/60">
                Padding Y
                <input
                  type="number"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                  value={mobile.paddingY ?? base.paddingY}
                  onChange={(e) => setResponsive("mobile", { paddingY: Number(e.target.value) })}
                />
              </label>
              <label className="text-xs text-white/60">
                Padding X
                <input
                  type="number"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                  value={mobile.paddingX ?? base.paddingX}
                  onChange={(e) => setResponsive("mobile", { paddingX: Number(e.target.value) })}
                />
              </label>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
