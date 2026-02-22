import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getPersistStorage } from "@/lib/editor/persistStorage";
import { DEFAULT_PAGES } from "@/lib/editor/defaults";
import type { BlockPreset, BlockStyle, BlockType, ResponsiveValue, SiteBlock, SitePage } from "@/lib/editor/types";
import { getByPath, setByPath } from "@/lib/editor/path";
import { useUndoStore } from "@/lib/editor/undoStore";
import { LATEST_BLOCK_SCHEMA_VERSION, migrateBlock } from "@/lib/editor/blockMigrations";

const storage = createJSONStorage(() => getPersistStorage());

type PagesState = {
  pages: SitePage[];
  lastChangedAt: number;

  get: <T = unknown>(path: string) => T | undefined;
  set: (path: string, value: unknown) => void;

  findById: (id: string) => SitePage | null;
  findBySlug: (slug: string) => SitePage | null;
  findGlobalById: (id: string) => SitePage | null;

  addPage: () => string;
  duplicatePage: (id: string) => string | null;
  deletePage: (id: string) => void;
  updatePage: (id: string, partial: Partial<Omit<SitePage, "id" | "blocks">>) => void;
  renameSlug: (id: string, nextSlug: string) => void;

  addGlobalSection: (name?: string) => string;
  deleteGlobalSection: (id: string) => void;

  addBlock: (pageId: string, type: BlockType, preset?: BlockPreset) => string | null;
  insertBlock: (pageId: string, block: SiteBlock, afterBlockId?: string | null) => string | null;
  duplicateBlock: (pageId: string, blockId: string) => string | null;
  deleteBlock: (pageId: string, blockId: string) => void;
  reorderBlocks: (pageId: string, next: SiteBlock[]) => void;
  replaceBlocks: (pageId: string, next: SiteBlock[]) => void;
  toggleBlockVisible: (pageId: string, blockId: string) => void;
  setBlockLocked: (pageId: string, blockId: string, locked: boolean) => void;
  updateBlock: (pageId: string, blockId: string, partial: Partial<Omit<SiteBlock, "id">>) => void;
  updateBlockData: (pageId: string, blockId: string, data: unknown) => void;
  setBlockPreset: (pageId: string, blockId: string, preset: BlockPreset) => void;
  updateBlockStyle: (pageId: string, blockId: string, style: ResponsiveValue<BlockStyle>) => void;

  insertGlobalRef: (pageId: string, globalPageId: string, afterBlockId?: string | null) => string | null;
  makeBlockGlobal: (pageId: string, blockId: string, name?: string) => string | null;
  detachGlobalRef: (pageId: string, blockId: string) => void;

  reset: () => void;
};

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9/]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .replace(/\/{2,}/g, "/")
    .split("/")
    .map((s) => s.replace(/(^-|-$)+/g, ""))
    .filter(Boolean)
    .join("/")
    .slice(0, 120);
}

const DEFAULT_BLOCK_STYLE: ResponsiveValue<BlockStyle> = {
  base: {
    paddingY: 72,
    paddingX: 16,
    maxWidth: 1200,
    background: "transparent",
    textAlign: "left",
    radius: 16,
    shadow: 0.2,
  },
  tablet: { paddingY: 56, paddingX: 16 },
  mobile: { paddingY: 44, paddingX: 16 },
};

const DEFAULT_GLOBAL_REF_STYLE: ResponsiveValue<BlockStyle> = {
  base: {
    paddingY: 0,
    paddingX: 0,
    maxWidth: 9999,
    background: "transparent",
    textAlign: "left",
    radius: 0,
    shadow: 0,
  },
  tablet: { paddingY: 0, paddingX: 0 },
  mobile: { paddingY: 0, paddingX: 0 },
};

function defaultVariantFor(type: BlockType): string | undefined {
  switch (type) {
    case "hero":
      return "centered";
    case "pricing":
      return "cards";
    case "faq":
      return "accordion";
    case "cta":
      return "banner";
    default:
      return undefined;
  }
}

function normalizePreset(preset: unknown): BlockPreset {
  return preset === "minimal" || preset === "corporate" || preset === "premium" || preset === "bold" ? preset : "minimal";
}

function normalizeBlockStyle(type: BlockType, style: unknown): ResponsiveValue<BlockStyle> {
  if (type === "globalRef") return structuredClone(DEFAULT_GLOBAL_REF_STYLE);
  if (!style || typeof style !== "object") return structuredClone(DEFAULT_BLOCK_STYLE);
  const s = style as Partial<ResponsiveValue<BlockStyle>>;
  const baseRec: Record<string, unknown> = s.base && typeof s.base === "object" ? (s.base as unknown as Record<string, unknown>) : {};
  const textAlignRaw = baseRec.textAlign;
  const textAlign: BlockStyle["textAlign"] =
    textAlignRaw === "left" || textAlignRaw === "center" || textAlignRaw === "right" ? textAlignRaw : DEFAULT_BLOCK_STYLE.base.textAlign;
  return {
    base: {
      paddingY: Number(baseRec.paddingY ?? DEFAULT_BLOCK_STYLE.base.paddingY),
      paddingX: Number(baseRec.paddingX ?? DEFAULT_BLOCK_STYLE.base.paddingX),
      maxWidth: Number(baseRec.maxWidth ?? DEFAULT_BLOCK_STYLE.base.maxWidth),
      background: String(baseRec.background ?? DEFAULT_BLOCK_STYLE.base.background),
      textAlign,
      radius: Number(baseRec.radius ?? DEFAULT_BLOCK_STYLE.base.radius),
      shadow: Number(baseRec.shadow ?? DEFAULT_BLOCK_STYLE.base.shadow),
    },
    tablet: s.tablet && typeof s.tablet === "object" ? (s.tablet as Partial<BlockStyle>) : structuredClone(DEFAULT_BLOCK_STYLE.tablet),
    mobile: s.mobile && typeof s.mobile === "object" ? (s.mobile as Partial<BlockStyle>) : structuredClone(DEFAULT_BLOCK_STYLE.mobile),
  };
}

function reorderBlocksById(blocks: SiteBlock[], order: string[]) {
  const byId = new Map(blocks.map((b) => [b.id, b] as const));
  const next: SiteBlock[] = [];
  const wanted = new Set(order);
  for (const id of order) {
    const b = byId.get(id);
    if (b) next.push(b);
  }
  for (const b of blocks) {
    if (!wanted.has(b.id)) next.push(b);
  }
  return next;
}

function normalizePageForStore(x: SitePage): SitePage {
  const kind = x.kind ?? "page";
  const chrome = x.chrome ?? { useGlobalNavigation: true, useGlobalFooter: true };
  const seo = {
    title: x.seo?.title ?? x.title ?? "",
    description: x.seo?.description ?? "",
    ogTitle: x.seo?.ogTitle ?? x.seo?.title ?? x.title ?? "",
    ogDescription: x.seo?.ogDescription ?? x.seo?.description ?? "",
    ogImage: x.seo?.ogImage ?? "",
    noIndex: x.seo?.noIndex ?? false,
    canonical: x.seo?.canonical ?? "",
  };
  const blocks = Array.isArray(x.blocks)
    ? (x.blocks as SiteBlock[]).map((b) => {
        const raw = b as unknown as Partial<SiteBlock> & Record<string, unknown>;
        const preset = normalizePreset(raw.preset);
        const style = normalizeBlockStyle(b.type, raw.style);
        const vo = raw.visibleOn && typeof raw.visibleOn === "object" ? (raw.visibleOn as Record<string, unknown>) : null;
        const visibleOn = vo
          ? { desktop: vo.desktop !== false, tablet: vo.tablet !== false, mobile: vo.mobile !== false }
          : { desktop: true, tablet: true, mobile: true };
        return migrateBlock({
          ...b,
          preset,
          style,
          visible: raw.visible !== false,
          locked: !!raw.locked,
          visibleOn,
        });
      })
    : [];
  return { ...x, kind, chrome, seo, blocks };
}

export function normalizePagesForStore(incoming: SitePage[]): SitePage[] {
  const ensured: SitePage[] = incoming.map((x) => normalizePageForStore(x));
  if (!ensured.some((x) => x.slug === "")) {
    const home = DEFAULT_PAGES.find((x) => x.slug === "");
    if (home) ensured.unshift(normalizePageForStore(home));
  }
  return ensured;
}

function blankBlock(type: BlockType, preset: BlockPreset): SiteBlock {
  const id = newId("blk");
  const common: Omit<SiteBlock, "data"> = {
    id,
    type,
    schemaVersion: LATEST_BLOCK_SCHEMA_VERSION,
    variant: defaultVariantFor(type),
    visible: true,
    locked: false,
    preset: normalizePreset(preset),
    style: structuredClone(DEFAULT_BLOCK_STYLE),
    visibleOn: { desktop: true, tablet: true, mobile: true },
  };

  switch (type) {
    case "globalRef":
      return { ...common, style: structuredClone(DEFAULT_GLOBAL_REF_STYLE), data: { globalPageId: "" } };
    case "richText":
      return { ...common, data: { title: "Título", body: "Escribe aquí…" } };
    case "form":
      return {
        ...common,
        data: {
          title: "Formulario",
          subtitle: "Cuéntanos qué necesitas y te contactamos.",
          submitLabel: "Enviar",
          successMessage: "¡Listo! Te respondemos pronto.",
          fields: [
            { id: newId("fld"), type: "text", label: "Nombre", key: "name", required: true, placeholder: "Tu nombre" },
            { id: newId("fld"), type: "email", label: "Email", key: "email", required: true, placeholder: "tu@email.com" },
            { id: newId("fld"), type: "tel", label: "Teléfono", key: "phone", required: false, placeholder: "+56…" },
            { id: newId("fld"), type: "textarea", label: "Mensaje", key: "message", required: true, placeholder: "Escribe tu mensaje…" },
          ],
        },
      };
    case "cta":
      return { ...common, data: { title: "Llamado a la acción", subtitle: "Un subtítulo convincente.", buttonLabel: "Agendar", buttonHref: "/contacto" } };
    case "features":
      return {
        ...common,
        data: {
          title: "Características",
          items: [
            { id: newId("f"), title: "Rápido", description: "Describe el beneficio en 1 línea." },
            { id: newId("f"), title: "Claro", description: "Sin tecnicismos." },
            { id: newId("f"), title: "Confiable", description: "Basado en evidencia." },
          ],
        },
      };
    case "faq":
      return {
        ...common,
        data: {
          title: "Preguntas frecuentes",
          items: [
            { id: newId("q"), q: "¿Cómo funciona?", a: "Explica el flujo en pocas líneas." },
            { id: newId("q"), q: "¿Cuánto tarda?", a: "Indica tiempos realistas." },
          ],
        },
      };
    case "pricing":
      return {
        ...common,
        data: {
          title: "Planes",
          plans: [
            { id: newId("p"), name: "Inicial", price: "$", note: "Ideal para empezar", features: ["Feature 1", "Feature 2"], ctaLabel: "Elegir", ctaHref: "/contacto" },
            { id: newId("p"), name: "Pro", price: "$$", note: "Para equipos", features: ["Feature 1", "Feature 2", "Feature 3"], ctaLabel: "Elegir", ctaHref: "/contacto" },
          ],
        },
      };
    case "logos":
      return {
        ...common,
        data: { title: "Confían en nosotros", logos: [{ id: newId("l"), src: "/images/logo_placeholder.png", alt: "Logo" }] },
      };
    case "spacer":
      return { ...common, data: { height: 48 } };
    case "embed":
      return { ...common, data: { title: "Embed", src: "https://www.youtube.com/embed/QvJ5Y3pJyrY?controls=1&rel=0" } };
    case "hero":
      return {
        ...common,
        data: {
          eyebrow: "Nuevo",
          title: "Titular principal",
          subtitle: "Subtítulo claro y directo.",
          primaryCtaLabel: "Empezar",
          primaryCtaHref: "/contacto",
          secondaryCtaLabel: "Saber más",
          secondaryCtaHref: "/servicios",
          backgroundImage: "/images/library_bg.jpg",
        },
      };
    default:
      return { ...common, data: {} };
  }
}

export const usePagesStore = create<PagesState>()(
  persist(
    (set, get) => ({
      pages: normalizePagesForStore(DEFAULT_PAGES),
      lastChangedAt: 0,

      get: (path) => getByPath({ pages: get().pages }, path),
      set: (path, value) =>
        set((state) => {
          const history = useUndoStore.getState();
          if (!history.isApplying) {
            const before = getByPath({ pages: state.pages }, path);
            const after = value;
            history.record(
              {
                label: "Editar",
                undo: () => {
                  usePagesStore.setState((s) => {
                    const next = setByPath({ pages: s.pages }, path, before) as unknown as { pages: SitePage[] };
                    return { pages: next.pages, lastChangedAt: Date.now() };
                  });
                },
                redo: () => {
                  usePagesStore.setState((s) => {
                    const next = setByPath({ pages: s.pages }, path, after) as unknown as { pages: SitePage[] };
                    return { pages: next.pages, lastChangedAt: Date.now() };
                  });
                },
              },
              { mergeKey: `pages:${path}` }
            );
          }
          const next = setByPath({ pages: state.pages }, path, value) as unknown as { pages: SitePage[] };
          return { pages: next.pages, lastChangedAt: Date.now() };
        }),

      findById: (id) => get().pages.find((p) => p.id === id) ?? null,
      findBySlug: (slug) => {
        const normalized = slugify(slug);
        return get().pages.find((p) => (p.kind ?? "page") === "page" && slugify(p.slug) === normalized) ?? null;
      },
      findGlobalById: (id) => get().pages.find((p) => p.id === id && (p.kind ?? "page") === "global") ?? null,

      addPage: () => {
        const id = newId("page");
        const baseSlug = "nueva-pagina";
        const taken = new Set(get().pages.map((p) => p.slug));
        let slug = baseSlug;
        let n = 2;
        while (taken.has(slug)) {
          slug = `${baseSlug}-${n++}`;
        }
        const insertAt = get().pages.length;
        const page: SitePage = {
          id,
          slug,
          title: "Nueva página",
          visible: true,
          kind: "page",
          chrome: { useGlobalNavigation: true, useGlobalFooter: true },
          seo: { title: "Nueva página", description: "", ogTitle: "Nueva página", ogDescription: "", ogImage: "", noIndex: false, canonical: "" },
          blocks: [blankBlock("hero", "premium"), blankBlock("richText", "minimal"), blankBlock("cta", "corporate")],
          updatedAt: Date.now(),
        };
        set((state) => ({ pages: [...state.pages, page], lastChangedAt: Date.now() }));
        const history = useUndoStore.getState();
        if (!history.isApplying) {
          const snapshot = structuredClone(page);
          history.record({
            label: "Agregar página",
            undo: () => {
              usePagesStore.setState((s) => ({ pages: s.pages.filter((p) => p.id !== id), lastChangedAt: Date.now() }));
            },
            redo: () => {
              usePagesStore.setState((s) => {
                if (s.pages.some((p) => p.id === id)) return { lastChangedAt: Date.now() };
                const next = [...s.pages];
                next.splice(Math.min(insertAt, next.length), 0, structuredClone(snapshot));
                return { pages: next, lastChangedAt: Date.now() };
              });
            },
          });
        }
        return id;
      },

      duplicatePage: (id) => {
        const p = get().pages.find((x) => x.id === id);
        if (!p) return null;
        if ((p.kind ?? "page") !== "page") return null;
        const nextId = newId("page");
        const baseSlug = slugify(`${p.slug || "home"}-copia`) || "pagina-copia";
        const taken = new Set(get().pages.map((x) => x.slug));
        let slug = baseSlug;
        let n = 2;
        while (taken.has(slug)) slug = `${baseSlug}-${n++}`;
        const copy: SitePage = {
          ...structuredClone(p),
          id: nextId,
          slug,
          title: `${p.title} (copia)`,
          kind: "page",
          updatedAt: Date.now(),
        };
        const insertAt = get().pages.length;
        set((state) => ({ pages: [...state.pages, copy], lastChangedAt: Date.now() }));
        const history = useUndoStore.getState();
        if (!history.isApplying) {
          const snapshot = structuredClone(copy);
          history.record({
            label: "Duplicar página",
            undo: () => {
              usePagesStore.setState((s) => ({ pages: s.pages.filter((x) => x.id !== nextId), lastChangedAt: Date.now() }));
            },
            redo: () => {
              usePagesStore.setState((s) => {
                if (s.pages.some((x) => x.id === nextId)) return { lastChangedAt: Date.now() };
                const next = [...s.pages];
                next.splice(Math.min(insertAt, next.length), 0, structuredClone(snapshot));
                return { pages: next, lastChangedAt: Date.now() };
              });
            },
          });
        }
        return nextId;
      },

      deletePage: (id) =>
        set((state) => {
          const idx = state.pages.findIndex((p) => p.id === id);
          const target = idx >= 0 ? state.pages[idx]! : null;
          if (!target) return { lastChangedAt: Date.now() };
          if ((target.kind ?? "page") !== "page") return { lastChangedAt: Date.now() };
          if (target.slug === "") return { lastChangedAt: Date.now() };

          const nextPages = state.pages.filter((p) => {
            if ((p.kind ?? "page") !== "page") return true;
            if (p.slug === "") return true;
            return p.id !== id;
          });

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            const snapshot = structuredClone(target);
            history.record({
              label: "Eliminar página",
              undo: () => {
                usePagesStore.setState((s) => {
                  if (s.pages.some((p) => p.id === id)) return { lastChangedAt: Date.now() };
                  const next = [...s.pages];
                  next.splice(Math.min(idx, next.length), 0, structuredClone(snapshot));
                  return { pages: next, lastChangedAt: Date.now() };
                });
              },
              redo: () => {
                usePagesStore.setState((s) => ({
                  pages: s.pages.filter((p) => {
                    if ((p.kind ?? "page") !== "page") return true;
                    if (p.slug === "") return true;
                    return p.id !== id;
                  }),
                  lastChangedAt: Date.now(),
                }));
              },
            });
          }

          return { pages: nextPages, lastChangedAt: Date.now() };
        }),

      updatePage: (id, partial) =>
        set((state) => {
          const prev = state.pages.find((p) => p.id === id) ?? null;
          if (!prev) return { lastChangedAt: Date.now() };
          const next = { ...prev, ...partial, updatedAt: Date.now() } as SitePage;

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            type UpdatableKey = Exclude<keyof SitePage, "id" | "blocks">;
            const keys = Object.keys(partial ?? {}) as UpdatableKey[];
            const beforeUpdatedAt = prev.updatedAt;
            const afterUpdatedAt = next.updatedAt;
            const beforePatch: Partial<Record<UpdatableKey, SitePage[UpdatableKey]>> = {};
            const afterPatch: Partial<Record<UpdatableKey, SitePage[UpdatableKey]>> = {};
            for (const k of keys) {
              beforePatch[k] = structuredClone(prev[k]);
              afterPatch[k] = structuredClone(next[k]);
            }
            history.record(
              {
                label: "Editar página",
                undo: () => {
                  usePagesStore.setState((s) => ({
                    pages: s.pages.map((p) =>
                      p.id === id ? { ...p, ...(beforePatch as Partial<SitePage>), updatedAt: beforeUpdatedAt } : p
                    ),
                    lastChangedAt: Date.now(),
                  }));
                },
                redo: () => {
                  usePagesStore.setState((s) => ({
                    pages: s.pages.map((p) =>
                      p.id === id ? { ...p, ...(afterPatch as Partial<SitePage>), updatedAt: afterUpdatedAt } : p
                    ),
                    lastChangedAt: Date.now(),
                  }));
                },
              },
              { mergeKey: `page:${id}` }
            );
          }

          return { pages: state.pages.map((p) => (p.id === id ? next : p)), lastChangedAt: Date.now() };
        }),

      renameSlug: (id, nextSlug) =>
        set((state) => {
          const p = state.pages.find((x) => x.id === id);
          if (!p) return { lastChangedAt: Date.now() };
          if ((p.kind ?? "page") !== "page") return { lastChangedAt: Date.now() };
          const cleaned = slugify(nextSlug);
          if (state.pages.some((p) => p.id !== id && slugify(p.slug) === cleaned)) return { lastChangedAt: Date.now() };
          const history = useUndoStore.getState();
          if (!history.isApplying) {
            const beforeSlug = p.slug;
            const beforeUpdatedAt = p.updatedAt;
            history.record(
              {
                label: "Cambiar slug",
                undo: () => {
                  usePagesStore.setState((s) => ({
                    pages: s.pages.map((x) => (x.id === id ? { ...x, slug: beforeSlug, updatedAt: beforeUpdatedAt } : x)),
                    lastChangedAt: Date.now(),
                  }));
                },
                redo: () => {
                  usePagesStore.setState((s) => ({
                    pages: s.pages.map((x) => (x.id === id ? { ...x, slug: cleaned, updatedAt: Date.now() } : x)),
                    lastChangedAt: Date.now(),
                  }));
                },
              },
              { mergeKey: `slug:${id}`, mergeMs: 1500 }
            );
          }
          return {
            pages: state.pages.map((p) => (p.id === id ? { ...p, slug: cleaned, updatedAt: Date.now() } : p)),
            lastChangedAt: Date.now(),
          };
        }),

      addGlobalSection: (name = "Sección global") => {
        const id = newId("global");
        const slug = `_global/${id}`;
        const insertAt = get().pages.length;
        const page: SitePage = {
          id,
          kind: "global",
          slug,
          title: name.trim() || "Sección global",
          visible: false,
          chrome: { useGlobalNavigation: true, useGlobalFooter: true },
          seo: { title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "", noIndex: true, canonical: "" },
          blocks: [blankBlock("cta", "corporate")],
          updatedAt: Date.now(),
        };
        set((s) => ({ pages: [...s.pages, page], lastChangedAt: Date.now() }));
        const history = useUndoStore.getState();
        if (!history.isApplying) {
          const snapshot = structuredClone(page);
          history.record({
            label: "Agregar sección global",
            undo: () => {
              usePagesStore.setState((s) => ({ pages: s.pages.filter((p) => p.id !== id), lastChangedAt: Date.now() }));
            },
            redo: () => {
              usePagesStore.setState((s) => {
                if (s.pages.some((p) => p.id === id)) return { lastChangedAt: Date.now() };
                const next = [...s.pages];
                next.splice(Math.min(insertAt, next.length), 0, structuredClone(snapshot));
                return { pages: next, lastChangedAt: Date.now() };
              });
            },
          });
        }
        return id;
      },

      deleteGlobalSection: (id) =>
        set((state) => {
          const idx = state.pages.findIndex((p) => p.id === id && (p.kind ?? "page") === "global");
          const target = idx >= 0 ? state.pages[idx]! : null;
          if (!target) return { lastChangedAt: Date.now() };
          const nextPages = state.pages.filter((p) => !(p.id === id && (p.kind ?? "page") === "global"));

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            const snapshot = structuredClone(target);
            history.record({
              label: "Eliminar sección global",
              undo: () => {
                usePagesStore.setState((s) => {
                  if (s.pages.some((p) => p.id === id)) return { lastChangedAt: Date.now() };
                  const next = [...s.pages];
                  next.splice(Math.min(idx, next.length), 0, structuredClone(snapshot));
                  return { pages: next, lastChangedAt: Date.now() };
                });
              },
              redo: () => {
                usePagesStore.setState((s) => ({
                  pages: s.pages.filter((p) => !(p.id === id && (p.kind ?? "page") === "global")),
                  lastChangedAt: Date.now(),
                }));
              },
            });
          }

          return { pages: nextPages, lastChangedAt: Date.now() };
        }),

      addBlock: (pageId, type, preset = "minimal") => {
        const p = get().pages.find((x) => x.id === pageId);
        if (!p) return null;
        const b = blankBlock(type, preset);
        const insertAt = p.blocks.length;
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId ? { ...page, blocks: [...page.blocks, b], updatedAt: Date.now() } : page
          ),
          lastChangedAt: Date.now(),
        }));
        const history = useUndoStore.getState();
        if (!history.isApplying) {
          const snapshot = structuredClone(b);
          history.record({
            label: "Agregar bloque",
            undo: () => {
              usePagesStore.setState((s) => ({
                pages: s.pages.map((page) =>
                  page.id === pageId ? { ...page, blocks: page.blocks.filter((x) => x.id !== b.id), updatedAt: Date.now() } : page
                ),
                lastChangedAt: Date.now(),
              }));
            },
            redo: () => {
              usePagesStore.setState((s) => ({
                pages: s.pages.map((page) => {
                  if (page.id !== pageId) return page;
                  if (page.blocks.some((x) => x.id === snapshot.id)) return { ...page, updatedAt: Date.now() };
                  const next = [...page.blocks];
                  next.splice(Math.min(insertAt, next.length), 0, structuredClone(snapshot));
                  return { ...page, blocks: next, updatedAt: Date.now() };
                }),
                lastChangedAt: Date.now(),
              }));
            },
          });
        }
        return b.id;
      },

      insertBlock: (pageId, block, afterBlockId = null) => {
        const p = get().pages.find((x) => x.id === pageId);
        if (!p) return null;
        const copy: SiteBlock = migrateBlock({ ...structuredClone(block), id: newId("blk"), locked: false, visible: true } as SiteBlock);
        const idx = afterBlockId ? p.blocks.findIndex((b) => b.id === afterBlockId) : -1;
        const insertAt = idx >= 0 ? idx + 1 : p.blocks.length;
        set((state) => ({
          pages: state.pages.map((page) => {
            if (page.id !== pageId) return page;
            const next = [...page.blocks.slice(0, insertAt), copy, ...page.blocks.slice(insertAt)];
            return { ...page, blocks: next, updatedAt: Date.now() };
          }),
          lastChangedAt: Date.now(),
        }));
        const history = useUndoStore.getState();
        if (!history.isApplying) {
          const snapshot = structuredClone(copy);
          history.record({
            label: "Insertar bloque",
            undo: () => {
              usePagesStore.setState((s) => ({
                pages: s.pages.map((page) =>
                  page.id === pageId ? { ...page, blocks: page.blocks.filter((x) => x.id !== snapshot.id), updatedAt: Date.now() } : page
                ),
                lastChangedAt: Date.now(),
              }));
            },
            redo: () => {
              usePagesStore.setState((s) => ({
                pages: s.pages.map((page) => {
                  if (page.id !== pageId) return page;
                  if (page.blocks.some((x) => x.id === snapshot.id)) return { ...page, updatedAt: Date.now() };
                  const next = [...page.blocks];
                  next.splice(Math.min(insertAt, next.length), 0, structuredClone(snapshot));
                  return { ...page, blocks: next, updatedAt: Date.now() };
                }),
                lastChangedAt: Date.now(),
              }));
            },
          });
        }
        return copy.id;
      },

      duplicateBlock: (pageId, blockId) => {
        const p = get().pages.find((x) => x.id === pageId);
        if (!p) return null;
        const idx = p.blocks.findIndex((b) => b.id === blockId);
        if (idx < 0) return null;
        const orig = p.blocks[idx]!;
        const copy: SiteBlock = { ...structuredClone(orig), id: newId("blk"), locked: false, visible: true };
        const insertAt = idx + 1;
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === pageId
              ? { ...page, blocks: [...page.blocks.slice(0, idx + 1), copy, ...page.blocks.slice(idx + 1)], updatedAt: Date.now() }
              : page
          ),
          lastChangedAt: Date.now(),
        }));
        const history = useUndoStore.getState();
        if (!history.isApplying) {
          const snapshot = structuredClone(copy);
          history.record({
            label: "Duplicar bloque",
            undo: () => {
              usePagesStore.setState((s) => ({
                pages: s.pages.map((page) =>
                  page.id === pageId ? { ...page, blocks: page.blocks.filter((x) => x.id !== snapshot.id), updatedAt: Date.now() } : page
                ),
                lastChangedAt: Date.now(),
              }));
            },
            redo: () => {
              usePagesStore.setState((s) => ({
                pages: s.pages.map((page) => {
                  if (page.id !== pageId) return page;
                  if (page.blocks.some((x) => x.id === snapshot.id)) return { ...page, updatedAt: Date.now() };
                  const next = [...page.blocks];
                  next.splice(Math.min(insertAt, next.length), 0, structuredClone(snapshot));
                  return { ...page, blocks: next, updatedAt: Date.now() };
                }),
                lastChangedAt: Date.now(),
              }));
            },
          });
        }
        return copy.id;
      },

      deleteBlock: (pageId, blockId) =>
        set((state) => {
          const page = state.pages.find((p) => p.id === pageId) ?? null;
          if (!page) return { lastChangedAt: Date.now() };
          const idx = page.blocks.findIndex((b) => b.id === blockId);
          if (idx < 0) return { lastChangedAt: Date.now() };
          const removed = page.blocks[idx]!;
          const nextBlocks = page.blocks.filter((b) => b.id !== blockId);

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            const snapshot = structuredClone(removed);
            history.record({
              label: "Eliminar bloque",
              undo: () => {
                usePagesStore.setState((s) => ({
                  pages: s.pages.map((p) => {
                    if (p.id !== pageId) return p;
                    if (p.blocks.some((b) => b.id === snapshot.id)) return { ...p, updatedAt: Date.now() };
                    const blocks = [...p.blocks];
                    blocks.splice(Math.min(idx, blocks.length), 0, structuredClone(snapshot));
                    return { ...p, blocks, updatedAt: Date.now() };
                  }),
                  lastChangedAt: Date.now(),
                }));
              },
              redo: () => {
                usePagesStore.setState((s) => ({
                  pages: s.pages.map((p) =>
                    p.id === pageId ? { ...p, blocks: p.blocks.filter((b) => b.id !== blockId), updatedAt: Date.now() } : p
                  ),
                  lastChangedAt: Date.now(),
                }));
              },
            });
          }

          return {
            pages: state.pages.map((p) => (p.id === pageId ? { ...p, blocks: nextBlocks, updatedAt: Date.now() } : p)),
            lastChangedAt: Date.now(),
          };
        }),

      reorderBlocks: (pageId, next) =>
        set((state) => {
          const page = state.pages.find((p) => p.id === pageId) ?? null;
          if (!page) return { lastChangedAt: Date.now() };
          const beforeOrder = page.blocks.map((b) => b.id);
          const afterOrder = (next ?? []).map((b) => b.id);

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            history.record(
              {
                label: "Reordenar bloques",
                undo: () => {
                  usePagesStore.setState((s) => ({
                    pages: s.pages.map((p) =>
                      p.id === pageId ? { ...p, blocks: reorderBlocksById(p.blocks, beforeOrder), updatedAt: Date.now() } : p
                    ),
                    lastChangedAt: Date.now(),
                  }));
                },
                redo: () => {
                  usePagesStore.setState((s) => ({
                    pages: s.pages.map((p) =>
                      p.id === pageId ? { ...p, blocks: reorderBlocksById(p.blocks, afterOrder), updatedAt: Date.now() } : p
                    ),
                    lastChangedAt: Date.now(),
                  }));
                },
              },
              { mergeKey: `reorder:${pageId}`, mergeMs: 600 }
            );
          }

          return {
            pages: state.pages.map((p) => (p.id === pageId ? { ...p, blocks: next, updatedAt: Date.now() } : p)),
            lastChangedAt: Date.now(),
          };
        }),

      replaceBlocks: (pageId, next) =>
        set((state) => {
          const page = state.pages.find((p) => p.id === pageId) ?? null;
          if (!page) return { lastChangedAt: Date.now() };
          const before = structuredClone(page.blocks);
          const migratedNext = Array.isArray(next) ? next.map((b) => migrateBlock(b as SiteBlock)) : [];
          const after = structuredClone(migratedNext);

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            history.record({
              label: "Reemplazar bloques",
              undo: () => {
                usePagesStore.setState((s) => ({
                  pages: s.pages.map((p) => (p.id === pageId ? { ...p, blocks: structuredClone(before), updatedAt: Date.now() } : p)),
                  lastChangedAt: Date.now(),
                }));
              },
              redo: () => {
                usePagesStore.setState((s) => ({
                  pages: s.pages.map((p) => (p.id === pageId ? { ...p, blocks: structuredClone(after), updatedAt: Date.now() } : p)),
                  lastChangedAt: Date.now(),
                }));
              },
            });
          }

          return {
            pages: state.pages.map((p) => (p.id === pageId ? { ...p, blocks: migratedNext, updatedAt: Date.now() } : p)),
            lastChangedAt: Date.now(),
          };
        }),

      toggleBlockVisible: (pageId, blockId) =>
        set((state) => {
          const page = state.pages.find((p) => p.id === pageId) ?? null;
          const block = page?.blocks.find((b) => b.id === blockId) ?? null;
          if (!page || !block) return { lastChangedAt: Date.now() };
          const before = block.visible !== false;
          const after = !before;

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            history.record({
              label: before ? "Ocultar bloque" : "Mostrar bloque",
              undo: () => {
                usePagesStore.setState((s) => ({
                  pages: s.pages.map((p) =>
                    p.id === pageId ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, visible: before } : b)), updatedAt: Date.now() } : p
                  ),
                  lastChangedAt: Date.now(),
                }));
              },
              redo: () => {
                usePagesStore.setState((s) => ({
                  pages: s.pages.map((p) =>
                    p.id === pageId ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, visible: after } : b)), updatedAt: Date.now() } : p
                  ),
                  lastChangedAt: Date.now(),
                }));
              },
            });
          }

          return {
            pages: state.pages.map((p) =>
              p.id === pageId
                ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, visible: after } : b)), updatedAt: Date.now() }
                : p
            ),
            lastChangedAt: Date.now(),
          };
        }),

      setBlockLocked: (pageId, blockId, locked) =>
        set((state) => {
          const page = state.pages.find((p) => p.id === pageId) ?? null;
          const block = page?.blocks.find((b) => b.id === blockId) ?? null;
          if (!page || !block) return { lastChangedAt: Date.now() };
          const before = !!block.locked;
          const after = !!locked;

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            history.record({
              label: after ? "Bloquear bloque" : "Desbloquear bloque",
              undo: () => {
                usePagesStore.setState((s) => ({
                  pages: s.pages.map((p) =>
                    p.id === pageId ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, locked: before } : b)), updatedAt: Date.now() } : p
                  ),
                  lastChangedAt: Date.now(),
                }));
              },
              redo: () => {
                usePagesStore.setState((s) => ({
                  pages: s.pages.map((p) =>
                    p.id === pageId ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, locked: after } : b)), updatedAt: Date.now() } : p
                  ),
                  lastChangedAt: Date.now(),
                }));
              },
            });
          }

          return {
            pages: state.pages.map((p) =>
              p.id === pageId ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, locked: after } : b)), updatedAt: Date.now() } : p
            ),
            lastChangedAt: Date.now(),
          };
        }),

      updateBlock: (pageId, blockId, partial) =>
        set((state) => {
          const page = state.pages.find((p) => p.id === pageId) ?? null;
          const prev = page?.blocks.find((b) => b.id === blockId) ?? null;
          if (!page || !prev) return { lastChangedAt: Date.now() };
          const next = { ...prev, ...partial } as SiteBlock;

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            type UpdatableKey = Exclude<keyof SiteBlock, "id">;
            const keys = Object.keys(partial ?? {}) as UpdatableKey[];
            const beforePatch: Partial<Record<UpdatableKey, SiteBlock[UpdatableKey]>> = {};
            const afterPatch: Partial<Record<UpdatableKey, SiteBlock[UpdatableKey]>> = {};
            for (const k of keys) {
              beforePatch[k] = structuredClone(prev[k]);
              afterPatch[k] = structuredClone(next[k]);
            }
            history.record(
              {
                label: "Editar bloque",
                undo: () => {
                  usePagesStore.setState((s) => ({
                    pages: s.pages.map((p) =>
                      p.id === pageId
                        ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, ...(beforePatch as Partial<SiteBlock>) } : b)), updatedAt: Date.now() }
                        : p
                    ),
                    lastChangedAt: Date.now(),
                  }));
                },
                redo: () => {
                  usePagesStore.setState((s) => ({
                    pages: s.pages.map((p) =>
                      p.id === pageId
                        ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, ...(afterPatch as Partial<SiteBlock>) } : b)), updatedAt: Date.now() }
                        : p
                    ),
                    lastChangedAt: Date.now(),
                  }));
                },
              },
              { mergeKey: `block:${pageId}:${blockId}`, mergeMs: 800 }
            );
          }

          return {
            pages: state.pages.map((p) =>
              p.id === pageId ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? next : b)), updatedAt: Date.now() } : p
            ),
            lastChangedAt: Date.now(),
          };
        }),

      updateBlockData: (pageId, blockId, data) =>
        set((state) => {
          const page = state.pages.find((p) => p.id === pageId) ?? null;
          const prev = page?.blocks.find((b) => b.id === blockId) ?? null;
          if (!page || !prev) return { lastChangedAt: Date.now() };
          const before = structuredClone(prev.data);
          const after = structuredClone(data);

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            history.record(
              {
                label: "Editar contenido",
                undo: () => {
                  usePagesStore.setState((s) => ({
                    pages: s.pages.map((p) =>
                      p.id === pageId
                        ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, data: structuredClone(before) } : b)), updatedAt: Date.now() }
                        : p
                    ),
                    lastChangedAt: Date.now(),
                  }));
                },
                redo: () => {
                  usePagesStore.setState((s) => ({
                    pages: s.pages.map((p) =>
                      p.id === pageId
                        ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, data: structuredClone(after) } : b)), updatedAt: Date.now() }
                        : p
                    ),
                    lastChangedAt: Date.now(),
                  }));
                },
              },
              { mergeKey: `blockdata:${pageId}:${blockId}`, mergeMs: 1000 }
            );
          }

          return {
            pages: state.pages.map((p) =>
              p.id === pageId
                ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, data } : b)), updatedAt: Date.now() }
                : p
            ),
            lastChangedAt: Date.now(),
          };
        }),

      setBlockPreset: (pageId, blockId, preset) =>
        set((state) => {
          const page = state.pages.find((p) => p.id === pageId) ?? null;
          const prev = page?.blocks.find((b) => b.id === blockId) ?? null;
          if (!page || !prev) return { lastChangedAt: Date.now() };
          const before = prev.preset;
          const after = preset;

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            history.record({
              label: "Cambiar preset",
              undo: () => {
                usePagesStore.setState((s) => ({
                  pages: s.pages.map((p) =>
                    p.id === pageId ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, preset: before } : b)), updatedAt: Date.now() } : p
                  ),
                  lastChangedAt: Date.now(),
                }));
              },
              redo: () => {
                usePagesStore.setState((s) => ({
                  pages: s.pages.map((p) =>
                    p.id === pageId ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, preset: after } : b)), updatedAt: Date.now() } : p
                  ),
                  lastChangedAt: Date.now(),
                }));
              },
            });
          }

          return {
            pages: state.pages.map((p) =>
              p.id === pageId ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, preset: after } : b)), updatedAt: Date.now() } : p
            ),
            lastChangedAt: Date.now(),
          };
        }),

      updateBlockStyle: (pageId, blockId, style) =>
        set((state) => {
          const page = state.pages.find((p) => p.id === pageId) ?? null;
          const prev = page?.blocks.find((b) => b.id === blockId) ?? null;
          if (!page || !prev) return { lastChangedAt: Date.now() };
          const before = structuredClone(prev.style);
          const after = structuredClone(style);

          const history = useUndoStore.getState();
          if (!history.isApplying) {
            history.record(
              {
                label: "Editar estilo",
                undo: () => {
                  usePagesStore.setState((s) => ({
                    pages: s.pages.map((p) =>
                      p.id === pageId
                        ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, style: structuredClone(before) } : b)), updatedAt: Date.now() }
                        : p
                    ),
                    lastChangedAt: Date.now(),
                  }));
                },
                redo: () => {
                  usePagesStore.setState((s) => ({
                    pages: s.pages.map((p) =>
                      p.id === pageId
                        ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, style: structuredClone(after) } : b)), updatedAt: Date.now() }
                        : p
                    ),
                    lastChangedAt: Date.now(),
                  }));
                },
              },
              { mergeKey: `blockstyle:${pageId}:${blockId}`, mergeMs: 900 }
            );
          }

          return {
            pages: state.pages.map((p) =>
              p.id === pageId
                ? { ...p, blocks: p.blocks.map((b) => (b.id === blockId ? { ...b, style } : b)), updatedAt: Date.now() }
                : p
            ),
            lastChangedAt: Date.now(),
          };
        }),

      insertGlobalRef: (pageId, globalPageId, afterBlockId = null) => {
        const global = get().pages.find((p) => p.id === globalPageId && (p.kind ?? "page") === "global");
        if (!global) return null;
        const b: SiteBlock = {
          id: newId("blk"),
          type: "globalRef",
          schemaVersion: LATEST_BLOCK_SCHEMA_VERSION,
          visible: true,
          locked: false,
          preset: "minimal",
          style: structuredClone(DEFAULT_GLOBAL_REF_STYLE),
          visibleOn: { desktop: true, tablet: true, mobile: true },
          data: { globalPageId },
        };
        return get().insertBlock(pageId, b, afterBlockId);
      },

      makeBlockGlobal: (pageId, blockId, name) => {
        const page = get().pages.find((p) => p.id === pageId) ?? null;
        if (!page) return null;
        const block = page.blocks.find((b) => b.id === blockId) ?? null;
        if (!block) return null;
        const globalId = get().addGlobalSection(name || `Global: ${block.type}`);
        // Replace default CTA with the selected block.
        set((state) => ({
          pages: state.pages.map((p) => {
            if (p.id === globalId) {
              return { ...p, blocks: [structuredClone(block)], updatedAt: Date.now() };
            }
            if (p.id === pageId) {
              const nextBlocks: SiteBlock[] = p.blocks.map((b) => {
                if (b.id !== blockId) return b;
                const ref: SiteBlock = {
                  id: newId("blk"),
                  type: "globalRef",
                  schemaVersion: LATEST_BLOCK_SCHEMA_VERSION,
                  visible: true,
                  locked: false,
                  preset: "minimal",
                  style: structuredClone(DEFAULT_GLOBAL_REF_STYLE),
                  visibleOn: { desktop: true, tablet: true, mobile: true },
                  data: { globalPageId: globalId },
                };
                return ref;
              });
              return { ...p, blocks: nextBlocks, updatedAt: Date.now() };
            }
            return p;
          }),
          lastChangedAt: Date.now(),
        }));
        return globalId;
      },

      detachGlobalRef: (pageId, blockId) =>
        set((state) => {
          const page = state.pages.find((p) => p.id === pageId);
          if (!page) return { lastChangedAt: Date.now() };
          const ref = page.blocks.find((b) => b.id === blockId);
          if (!ref || ref.type !== "globalRef") return { lastChangedAt: Date.now() };
          const data = ref.data as unknown as { globalPageId?: unknown } | null;
          const globalPageId = typeof data?.globalPageId === "string" ? data.globalPageId : "";
          const global = state.pages.find((p) => p.id === globalPageId && (p.kind ?? "page") === "global");
          if (!global) return { lastChangedAt: Date.now() };
          const idx = page.blocks.findIndex((b) => b.id === blockId);
          if (idx < 0) return { lastChangedAt: Date.now() };
          const copies = global.blocks.map((b) => ({ ...structuredClone(b), id: newId("blk"), locked: false, visible: true }));
          const next = [...page.blocks.slice(0, idx), ...copies, ...page.blocks.slice(idx + 1)];
          return {
            pages: state.pages.map((p) => (p.id === pageId ? { ...p, blocks: next, updatedAt: Date.now() } : p)),
            lastChangedAt: Date.now(),
          };
        }),

      reset: () => set({ pages: normalizePagesForStore(DEFAULT_PAGES), lastChangedAt: Date.now() }),
    }),
    {
      name: "crc.pages.v1",
      version: 2,
      storage,
      partialize: (s) => ({ pages: s.pages }),
      skipHydration: true,
      migrate: (persisted) => {
        const p = persisted as unknown as { pages?: SitePage[] };
        const incoming = Array.isArray(p.pages) ? p.pages : DEFAULT_PAGES;
        return { pages: normalizePagesForStore(incoming as SitePage[]) };
      },
    }
  )
);
