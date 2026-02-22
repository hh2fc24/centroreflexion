import type { FounderProfile, SiteBlock, SiteContent, SitePage } from "@/lib/editor/types";
import type { PublishedDiskState } from "@/lib/server/publishedDisk";
import { sanitizePlainText, sanitizeUrl } from "@/lib/server/sanitize";
import { migrateBlock } from "@/lib/editor/blockMigrations";

function asRecord(x: unknown): Record<string, unknown> {
  return x && typeof x === "object" && !Array.isArray(x) ? (x as Record<string, unknown>) : {};
}

function asArray(x: unknown): unknown[] {
  return Array.isArray(x) ? x : [];
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

  let next: SiteBlock = b;

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
  const theme = input.theme ?? {};
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
