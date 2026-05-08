import type { FounderProfile, SiteBlock, SiteContent, SitePage } from "@/lib/editor/types";
import type { PublishedDiskState } from "@/lib/server/publishedDisk";
import { sanitizePlainText, sanitizeUrl } from "@/lib/server/sanitize";
import { migrateBlock } from "@/lib/editor/blockMigrations";
import { DEFAULT_THEME } from "@/lib/editor/defaults";

function asRecord(x: unknown): Record<string, unknown> {
  return x && typeof x === "object" && !Array.isArray(x) ? (x as Record<string, unknown>) : {};
}

function asArray(x: unknown): unknown[] {
  return Array.isArray(x) ? x : [];
}

function sanitizeIdentifier(input: unknown, { maxLen = 80, allowSlash = false }: { maxLen?: number; allowSlash?: boolean } = {}) {
  const raw = sanitizePlainText(input, { maxLen }).trim();
  const pattern = allowSlash ? /[^A-Za-z0-9:._/-]+/g : /[^A-Za-z0-9:_-]+/g;
  return raw.replace(pattern, "-").replace(/^-+|-+$/g, "").slice(0, maxLen);
}

function sanitizeCssValue(input: unknown, { maxLen = 160 }: { maxLen?: number } = {}) {
  const raw = sanitizePlainText(input, { maxLen }).trim();
  if (!raw) return "";
  const lower = raw.toLowerCase();
  if (
    lower.includes("expression") ||
    lower.includes("url(") ||
    lower.includes("@import") ||
    /[<>{};\\/]/.test(raw) ||
    !/^[#(),.%\-\sA-Za-z0-9]+$/.test(raw)
  ) {
    return "";
  }
  return raw;
}

function sanitizeTextAlign(input: unknown, fallback: "left" | "center" | "right" = "left") {
  return input === "center" || input === "right" || input === "left" ? input : fallback;
}

function sanitizeNumber(input: unknown, { min, max, fallback }: { min: number; max: number; fallback: number }) {
  if (typeof input !== "number" || !Number.isFinite(input)) return fallback;
  return Math.min(max, Math.max(min, input));
}

function sanitizeTheme(input: unknown) {
  const theme = asRecord(input);
  const spacingScale = asRecord(theme.spacingScale);
  const radiusScale = asRecord(theme.radiusScale);
  const shadowScale = asRecord(theme.shadowScale);
  const textStylesRec = asRecord(theme.textStyles);

  const textStyles = Object.fromEntries(
    Object.entries(textStylesRec).flatMap(([path, override]) => {
      const safePath = sanitizeIdentifier(path, { maxLen: 120, allowSlash: true });
      if (!safePath) return [];
      const rec = asRecord(override);
      const tablet = asRecord(rec.responsive ? asRecord(rec.responsive).tablet : null);
      const mobile = asRecord(rec.responsive ? asRecord(rec.responsive).mobile : null);
      return [
        [
          safePath,
          {
            color: sanitizeCssValue(rec.color) || undefined,
            font:
              rec.font === "inter" || rec.font === "geist" || rec.font === "merriweather" ? rec.font : undefined,
            fontSizePx:
              typeof rec.fontSizePx === "number" && Number.isFinite(rec.fontSizePx)
                ? sanitizeNumber(rec.fontSizePx, { min: 10, max: 120, fallback: 16 })
                : undefined,
            fontWeight:
              typeof rec.fontWeight === "number" && Number.isFinite(rec.fontWeight)
                ? sanitizeNumber(rec.fontWeight, { min: 100, max: 900, fallback: 400 })
                : undefined,
            responsive: {
              tablet: Object.keys(tablet).length
                ? {
                    color: sanitizeCssValue(tablet.color) || undefined,
                    fontSizePx:
                      typeof tablet.fontSizePx === "number" && Number.isFinite(tablet.fontSizePx)
                        ? sanitizeNumber(tablet.fontSizePx, { min: 10, max: 120, fallback: 16 })
                        : undefined,
                    fontWeight:
                      typeof tablet.fontWeight === "number" && Number.isFinite(tablet.fontWeight)
                        ? sanitizeNumber(tablet.fontWeight, { min: 100, max: 900, fallback: 400 })
                        : undefined,
                  }
                : undefined,
              mobile: Object.keys(mobile).length
                ? {
                    color: sanitizeCssValue(mobile.color) || undefined,
                    fontSizePx:
                      typeof mobile.fontSizePx === "number" && Number.isFinite(mobile.fontSizePx)
                        ? sanitizeNumber(mobile.fontSizePx, { min: 10, max: 120, fallback: 16 })
                        : undefined,
                    fontWeight:
                      typeof mobile.fontWeight === "number" && Number.isFinite(mobile.fontWeight)
                        ? sanitizeNumber(mobile.fontWeight, { min: 100, max: 900, fallback: 400 })
                        : undefined,
                  }
                : undefined,
            },
          },
        ],
      ];
    })
  );

  return {
    ...DEFAULT_THEME,
    mode: theme.mode === "dark" ? "dark" : "light",
    primary: sanitizeCssValue(theme.primary) || DEFAULT_THEME.primary,
    secondary: sanitizeCssValue(theme.secondary) || DEFAULT_THEME.secondary,
    accent: sanitizeCssValue(theme.accent) || DEFAULT_THEME.accent,
    background: sanitizeCssValue(theme.background) || DEFAULT_THEME.background,
    surface: sanitizeCssValue(theme.surface) || DEFAULT_THEME.surface,
    foreground: sanitizeCssValue(theme.foreground) || DEFAULT_THEME.foreground,
    mutedForeground: sanitizeCssValue(theme.mutedForeground) || DEFAULT_THEME.mutedForeground,
    border: sanitizeCssValue(theme.border) || DEFAULT_THEME.border,
    font: theme.font === "inter" || theme.font === "geist" || theme.font === "merriweather" ? theme.font : DEFAULT_THEME.font,
    textScale: sanitizeNumber(theme.textScale, { min: 0.9, max: 1.15, fallback: DEFAULT_THEME.textScale }),
    radius: sanitizeNumber(theme.radius, { min: 0, max: 64, fallback: DEFAULT_THEME.radius }),
    shadow: sanitizeNumber(theme.shadow, { min: 0, max: 1, fallback: DEFAULT_THEME.shadow }),
    designPreset:
      theme.designPreset === "custom" ||
      theme.designPreset === "minimal" ||
      theme.designPreset === "corporate" ||
      theme.designPreset === "premium"
        ? theme.designPreset
        : DEFAULT_THEME.designPreset,
    spacingScale: {
      xs: sanitizeNumber(spacingScale.xs, { min: 0, max: 120, fallback: DEFAULT_THEME.spacingScale.xs }),
      sm: sanitizeNumber(spacingScale.sm, { min: 0, max: 160, fallback: DEFAULT_THEME.spacingScale.sm }),
      md: sanitizeNumber(spacingScale.md, { min: 0, max: 220, fallback: DEFAULT_THEME.spacingScale.md }),
      lg: sanitizeNumber(spacingScale.lg, { min: 0, max: 280, fallback: DEFAULT_THEME.spacingScale.lg }),
      xl: sanitizeNumber(spacingScale.xl, { min: 0, max: 360, fallback: DEFAULT_THEME.spacingScale.xl }),
      "2xl": sanitizeNumber(spacingScale["2xl"], { min: 0, max: 420, fallback: DEFAULT_THEME.spacingScale["2xl"] }),
    },
    radiusScale: {
      sm: sanitizeNumber(radiusScale.sm, { min: 0, max: 48, fallback: DEFAULT_THEME.radiusScale.sm }),
      md: sanitizeNumber(radiusScale.md, { min: 0, max: 64, fallback: DEFAULT_THEME.radiusScale.md }),
      lg: sanitizeNumber(radiusScale.lg, { min: 0, max: 80, fallback: DEFAULT_THEME.radiusScale.lg }),
      xl: sanitizeNumber(radiusScale.xl, { min: 0, max: 96, fallback: DEFAULT_THEME.radiusScale.xl }),
      pill: sanitizeNumber(radiusScale.pill, { min: 0, max: 999, fallback: DEFAULT_THEME.radiusScale.pill }),
    },
    shadowScale: {
      sm: sanitizeNumber(shadowScale.sm, { min: 0, max: 1, fallback: DEFAULT_THEME.shadowScale.sm }),
      md: sanitizeNumber(shadowScale.md, { min: 0, max: 1, fallback: DEFAULT_THEME.shadowScale.md }),
      lg: sanitizeNumber(shadowScale.lg, { min: 0, max: 1, fallback: DEFAULT_THEME.shadowScale.lg }),
    },
    textStyles,
  };
}

function sanitizeBlockStyleOverride(input: unknown) {
  const style = asRecord(input);
  const next: Record<string, unknown> = {};
  if (typeof style.paddingY === "number" && Number.isFinite(style.paddingY)) {
    next.paddingY = sanitizeNumber(style.paddingY, { min: 0, max: 480, fallback: 72 });
  }
  if (typeof style.paddingX === "number" && Number.isFinite(style.paddingX)) {
    next.paddingX = sanitizeNumber(style.paddingX, { min: 0, max: 240, fallback: 16 });
  }
  if (typeof style.maxWidth === "number" && Number.isFinite(style.maxWidth)) {
    next.maxWidth = sanitizeNumber(style.maxWidth, { min: 320, max: 2400, fallback: 1200 });
  }
  if (typeof style.radius === "number" && Number.isFinite(style.radius)) {
    next.radius = sanitizeNumber(style.radius, { min: 0, max: 96, fallback: 16 });
  }
  if (typeof style.shadow === "number" && Number.isFinite(style.shadow)) {
    next.shadow = sanitizeNumber(style.shadow, { min: 0, max: 1, fallback: 0.2 });
  }
  const background = sanitizeCssValue(style.background);
  if (background) next.background = background;
  if (typeof style.textAlign === "string") next.textAlign = sanitizeTextAlign(style.textAlign);
  return next;
}

function sanitizeFounderProfiles(input: unknown): FounderProfile[] {
  if (!Array.isArray(input)) return [];
  return asArray(input).map((p, idx) => {
    const pr = asRecord(p);
    const idRaw = sanitizePlainText(pr.id, { maxLen: 80 });
    return {
      id: idRaw || `founder-${idx + 1}`,
      name: sanitizePlainText(pr.name, { maxLen: 80 }),
      role: sanitizePlainText(pr.role, { maxLen: 80 }),
      description: sanitizePlainText(pr.description, { maxLen: 1200 }),
      imageSrc: sanitizeUrl(pr.imageSrc, { allowRelative: true }),
      href: sanitizeUrl(pr.href, { allowRelative: true }),
    };
  });
}

function sanitizeNavItems(items: unknown): unknown[] {
  return asArray(items).map((it) => {
    const rec = asRecord(it);
    return {
      ...rec,
      label: sanitizePlainText(rec.label, { maxLen: 80 }),
      href: sanitizeUrl(rec.href, { allowRelative: true }),
      visible: rec.visible !== false,
      children: sanitizeNavItems(rec.children),
    };
  });
}

function sanitizeFooterColumns(cols: unknown): unknown[] {
  return asArray(cols).map((c) => {
    const col = asRecord(c);
    const links = asArray(col.links).map((l) => {
      const link = asRecord(l);
      return {
        ...link,
        label: sanitizePlainText(link.label, { maxLen: 80 }),
        href: sanitizeUrl(link.href, { allowRelative: true }),
        visible: link.visible !== false,
      };
    });
    return {
      ...col,
      title: sanitizePlainText(col.title, { maxLen: 80 }),
      visible: col.visible !== false,
      links,
    };
  });
}

function sanitizeBlock(block: unknown): SiteBlock {
  const b = (block ?? {}) as SiteBlock;
  const type = b.type;
  const data = asRecord(b.data);

  let next: SiteBlock = {
    ...b,
    id: sanitizeIdentifier(b.id, { maxLen: 80 }) || "blk",
    style: {
      base: {
        paddingY: sanitizeNumber(asRecord(b.style?.base).paddingY, { min: 0, max: 480, fallback: 72 }),
        paddingX: sanitizeNumber(asRecord(b.style?.base).paddingX, { min: 0, max: 240, fallback: 16 }),
        maxWidth: sanitizeNumber(asRecord(b.style?.base).maxWidth, { min: 320, max: 2400, fallback: 1200 }),
        background: sanitizeCssValue(asRecord(b.style?.base).background) || "transparent",
        textAlign: sanitizeTextAlign(asRecord(b.style?.base).textAlign),
        radius: sanitizeNumber(asRecord(b.style?.base).radius, { min: 0, max: 96, fallback: 16 }),
        shadow: sanitizeNumber(asRecord(b.style?.base).shadow, { min: 0, max: 1, fallback: 0.2 }),
      },
      tablet: sanitizeBlockStyleOverride(b.style?.tablet),
      mobile: sanitizeBlockStyleOverride(b.style?.mobile),
    },
  };

  if (type === "embed") {
    next = { ...next, data: { ...data, src: sanitizeUrl(data.src, { allowRelative: false }) } };
  } else if (type === "hero") {
    next = {
      ...next,
      data: {
        ...data,
        primaryCtaHref: sanitizeUrl(data.primaryCtaHref, { allowRelative: true }),
        secondaryCtaHref: sanitizeUrl(data.secondaryCtaHref, { allowRelative: true }),
        backgroundImage: sanitizeUrl(data.backgroundImage, { allowRelative: true }),
        backgroundVideo: sanitizeUrl(data.backgroundVideo, { allowRelative: true }),
        backgroundVideoPoster: sanitizeUrl(data.backgroundVideoPoster, { allowRelative: true }),
      },
    };
  } else if (type === "cta") {
    next = { ...next, data: { ...data, buttonHref: sanitizeUrl(data.buttonHref, { allowRelative: true }) } };
  } else if (type === "pricing") {
    const plans = asArray(data.plans).map((p) => asRecord(p));
    next = {
      ...next,
      data: {
        ...data,
        plans: plans.map((p) => ({ ...p, ctaHref: sanitizeUrl(p.ctaHref, { allowRelative: true }) })),
      },
    };
  } else if (type === "logos") {
    const logos = asArray(data.logos).map((l) => asRecord(l));
    next = {
      ...next,
      data: {
        ...data,
        logos: logos.map((l) => ({ ...l, src: sanitizeUrl(l.src, { allowRelative: true }) })),
      },
    };
  } else if (type === "form") {
    // Fields are used as plain text only; just clamp sizes.
    const fields = asArray(data.fields).map((f) => asRecord(f));
    next = {
      ...next,
      data: {
        ...data,
        title: sanitizePlainText(data.title, { maxLen: 120 }),
        subtitle: sanitizePlainText(data.subtitle, { maxLen: 400 }),
        submitLabel: sanitizePlainText(data.submitLabel, { maxLen: 80 }),
        successMessage: sanitizePlainText(data.successMessage, { maxLen: 200 }),
        fields: fields.map((f) => ({
          ...f,
          label: sanitizePlainText(f.label, { maxLen: 80 }),
          key: sanitizePlainText(f.key, { maxLen: 40 }),
          placeholder: sanitizePlainText(f.placeholder, { maxLen: 120 }),
          options: Array.isArray(f.options) ? (f.options as unknown[]).map((o) => sanitizePlainText(o, { maxLen: 80 })) : undefined,
        })),
      },
    };
  } else if (type === "richText") {
    next = {
      ...next,
      data: {
        ...data,
        title: sanitizePlainText(data.title, { maxLen: 120 }),
        body: sanitizePlainText(data.body, { maxLen: 20_000 }),
      },
    };
  }

  return migrateBlock(next);
}

export function sanitizePublishedState(input: PublishedDiskState): PublishedDiskState {
  const theme = sanitizeTheme(input.theme);
  const contentRaw = input.content ?? {};
  const pagesRaw = input.pages ?? [];
  const articlesRaw = input.articles ?? {};

  const content = (contentRaw as Partial<SiteContent>) ?? {};
  const navRec = asRecord(content.navigation);
  const footerRec = asRecord(content.footer);
  const integrationsRec = asRecord(content.integrations);
  const foundersRec = asRecord(content.homeFounders);
  const safeContent: Partial<SiteContent> = {
    ...content,
    navigation: content.navigation
      ? {
          ...content.navigation,
          items: sanitizeNavItems(navRec.items) as unknown as SiteContent["navigation"]["items"],
        }
      : content.navigation,
    footer: content.footer
      ? {
          ...content.footer,
          instagramHref: sanitizeUrl(footerRec.instagramHref, { allowRelative: false }),
          linkedinHref: sanitizeUrl(footerRec.linkedinHref, { allowRelative: false }),
          whatsappHref: sanitizeUrl(footerRec.whatsappHref, { allowRelative: false }),
          columns: sanitizeFooterColumns(footerRec.columns) as unknown as SiteContent["footer"]["columns"],
        }
      : content.footer,
    integrations: content.integrations
      ? {
          ...content.integrations,
          calLink: sanitizeUrl(integrationsRec.calLink, { allowRelative: false }),
          googleAnalyticsId: sanitizePlainText(integrationsRec.googleAnalyticsId, { maxLen: 40 }),
          googleTagId: sanitizePlainText(integrationsRec.googleTagId, { maxLen: 40 }),
          metaPixelId: sanitizePlainText(integrationsRec.metaPixelId, { maxLen: 40 }),
        }
      : content.integrations,
    redirects: Array.isArray(content.redirects)
      ? content.redirects.map((r) => ({
          ...r,
          from: sanitizeUrl(asRecord(r).from, { allowRelative: true, maxLen: 200 }),
          to: sanitizeUrl(asRecord(r).to, { allowRelative: true, maxLen: 200 }),
        }))
      : content.redirects,
    homeFounders: content.homeFounders
      ? {
          title: sanitizePlainText(foundersRec.title, { maxLen: 120 }),
          profiles: sanitizeFounderProfiles(foundersRec.profiles),
        }
      : content.homeFounders,
  };

  const pages: SitePage[] = Array.isArray(pagesRaw) ? (pagesRaw as SitePage[]) : [];
		  const safePages = pages.map((p) => ({
		    ...p,
		    seo: p.seo
		      ? {
		          ...p.seo,
		          ogImage: sanitizeUrl(asRecord(p.seo).ogImage, { allowRelative: true }),
		          canonical: sanitizeUrl(asRecord(p.seo).canonical, { allowRelative: false }),
		          title: sanitizePlainText(asRecord(p.seo).title, { maxLen: 80 }),
		          description: sanitizePlainText(asRecord(p.seo).description, { maxLen: 200 }),
		          ogTitle: sanitizePlainText(asRecord(p.seo).ogTitle, { maxLen: 80 }),
		          ogDescription: sanitizePlainText(asRecord(p.seo).ogDescription, { maxLen: 200 }),
		        }
		      : p.seo,
		    blocks: Array.isArray(p.blocks) ? p.blocks.map((b) => sanitizeBlock(b)) : p.blocks,
		  }));

  // Articles: minimal URL sanitize for images and plain text for strings.
	  const articles = (() => {
	    if (!articlesRaw || typeof articlesRaw !== "object") return articlesRaw;
	    const a = asRecord(articlesRaw);
	    const sanitizeList = (list: unknown) =>
	      asArray(list).map((it) => {
	        const rec = asRecord(it);
	        return {
	          ...rec,
	          title: sanitizePlainText(rec.title, { maxLen: 160 }),
	          excerpt: sanitizePlainText(rec.excerpt, { maxLen: 400 }),
	          author: sanitizePlainText(rec.author, { maxLen: 120 }),
	          category: sanitizePlainText(rec.category, { maxLen: 80 }),
	          image: sanitizeUrl(rec.image, { allowRelative: true }),
	          content: Array.isArray(rec.content)
	            ? (rec.content as unknown[]).map((p) => sanitizePlainText(p, { maxLen: 20_000 }))
	            : rec.content,
	        };
	      });
	    return {
	      ...a,
	      columns: sanitizeList(a.columns),
	      reviews: sanitizeList(a.reviews),
	    };
	  })();

  return { theme, content: safeContent, pages: safePages, articles };
}
