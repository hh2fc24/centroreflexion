"use client";

import type { SiteBlock } from "@/lib/editor/types";
import type { CSSProperties } from "react";
import { Hero } from "@/components/Hero";
import { FoundersSection } from "@/components/site/FoundersSection";
import { PublicationsSection } from "@/components/PublicationsSection";
import { InterviewsSection } from "@/components/InterviewsSection";
import { ArrowRight } from "lucide-react";
import { TypographicCover } from "@/components/TypographicCover";
import { useMemo, useState } from "react";
import { MotionDiv, MotionItem, MotionList } from "@/components/ui/Motion";
import { EditorLink } from "@/components/editor/EditorLink";
import { EditableText } from "@/components/editor/EditableText";
import { EditableAtom } from "@/components/editor/EditableAtom";
import { useArticles, useContent, useEditor } from "@/lib/editor/hooks";
import { parseDisplayDate } from "@/lib/articles/date";

function wrapLegacySection(kind: string, node: React.ReactNode, eager = false) {
  return (
    <div
      data-crc-legacy={kind}
      style={
        eager
          ? undefined
          : ({
              contentVisibility: "auto",
              containIntrinsicSize: "900px",
            } as CSSProperties)
      }
    >
      {node}
    </div>
  );
}

export function LegacyBlock({ block }: { pageId: string; block: SiteBlock; editable: boolean }) {
  // This is a compatibility layer so the new Pages system can render existing sections without breaking.
  // Home still uses the legacy HomeCanvas end-to-end; pages can optionally embed these sections.
  switch (block.type) {
    case "legacy.hero":
      return wrapLegacySection("hero", <Hero />, true);
    case "legacy.founders":
      return wrapLegacySection("founders", <FoundersSection />);
    case "legacy.servicesPreview":
      return wrapLegacySection("servicesPreview", <LegacyServicesPreview />);
    case "legacy.latestArticles":
      return wrapLegacySection("latestArticles", <LegacyLatestArticles />);
    case "legacy.publications":
      return wrapLegacySection("publications", <PublicationsSection />);
    case "legacy.interviews":
      return wrapLegacySection("interviews", <InterviewsSection />);
    case "legacy.testimonials":
      return wrapLegacySection("testimonials", <LegacyTestimonials />);
    default:
      return (
        <div className="mx-auto max-w-4xl px-4 py-10 text-sm text-[#6f675d]">
          Bloque legacy no disponible en esta página.
        </div>
      );
  }
}

function LegacyServicesPreview() {
  const { content } = useContent();
  const cards = content.homeServices.cards;

  return (
    <section className="border-b border-[#d8cfc0] bg-[#f8f5ee] px-5 sm:px-8 lg:px-14 xl:px-20">
      <MotionDiv className="mx-auto max-w-[1640px]">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {cards.map((card, cardPos) => {
            const idx = cards.findIndex((c) => c.id === card.id);
            return (
              <EditorLink
                key={card.id}
                href={card.href}
                className={
                  "group block border-b border-[#d8cfc0] py-8 transition-colors md:border-b-0 md:px-8 md:first:pl-0 " +
                  (cardPos === cards.length - 1 ? "" : "md:border-r")
                }
              >
                <p className="text-[0.875rem] font-semibold tabular-nums text-[#6f675d]">
                  {String(cardPos + 1).padStart(2, "0")}
                </p>
                <h3 className="crc-serif mt-2 text-[1.35rem] font-medium leading-[1.15] text-[#171713] transition-colors group-hover:text-[#9f5528]">
                  <EditableText path={`homeServices.cards.${idx}.title`} ariaLabel="Servicio título" />
                </h3>
                <p className="mt-3 max-w-[40ch] text-[1rem] leading-[1.7] text-[#55574f]">
                  <EditableText
                    path={`homeServices.cards.${idx}.description`}
                    ariaLabel="Servicio descripción"
                    multiline
                  />
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[#9f5528]">
                  <EditableText path={`homeServices.cards.${idx}.ctaLabel`} ariaLabel="Servicio CTA" />
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </EditorLink>
            );
          })}
        </div>
      </MotionDiv>
    </section>
  );
}

function LegacyLatestArticles() {
  const { content } = useContent();
  const { columns, reviews } = useArticles();

  const latestArticles = useMemo(
    () =>
      [
        ...columns.map((article) => ({ ...article, link: `/pensamiento-critico/${article.id}`, kind: "column" as const })),
        ...reviews.map((article) => ({ ...article, link: `/critica/${article.id}`, kind: "review" as const })),
      ]
        .sort((a, b) => {
          const tb = parseDisplayDate(b.date);
          const ta = parseDisplayDate(a.date);
          if (Number.isFinite(tb) && Number.isFinite(ta)) return tb - ta;
          return b.date.localeCompare(a.date);
        })
        .slice(0, 4),
    [columns, reviews]
  );

  return (
    <section className="border-b border-[#d8cfc0] bg-[#fffdf8] py-16 sm:py-20">
      <div className="mx-auto max-w-[1640px] px-5 sm:px-8 lg:px-14 xl:px-20">
        <MotionDiv className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Columnas y crítica</p>
            <h2 className="crc-serif mt-3 text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713] text-balance">
              <EditableText path="homeLatest.title" ariaLabel="Últimos artículos título" />
            </h2>
          </div>
          <EditorLink
            href={content.homeLatest.linkHref}
            className="group inline-flex items-center gap-2 self-start border-b border-[#bd6f3c] py-1 text-[0.9375rem] font-semibold text-[#171713] transition-colors hover:text-[#9f5528] sm:self-end"
          >
            <EditableText path="homeLatest.linkLabel" ariaLabel="Últimos artículos link" />
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </EditorLink>
        </MotionDiv>

        <MotionList className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {latestArticles.map((post) => (
            <MotionItem key={post.id}>
              <EditorLink
                href={post.link}
                className="group flex h-full flex-col rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fffdf8]"
              >
                <TypographicCover
                  category={post.category}
                  title={post.title}
                  date={post.date}
                  titleAs="h3"
                  className="transition-transform duration-200 group-hover:-translate-y-px"
                />
                <p className="mt-4 line-clamp-3 text-[0.9375rem] leading-[1.7] text-[#55574f]">{post.excerpt}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-[#9f5528]">
                  {post.kind === "review" ? "Leer reseña" : "Leer columna"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </EditorLink>
            </MotionItem>
          ))}
        </MotionList>
      </div>
    </section>
  );
}

// Categorías de testimonios que vienen de atención directa a personas. Se
// muestran aparte de los institucionales y con el nombre abreviado.
const CLINICAL_CATEGORIES = /cl[ií]nic|terapia|psicoterapia|orientaci[oó]n/i;

function LegacyTestimonials() {
  const INITIAL_PER_GROUP = 3;
  const { content, updateTestimonial, deleteTestimonial } = useContent();
  const { adminEnabled } = useEditor();
  const [expanded, setExpanded] = useState(false);

  const groups = useMemo(() => {
    const personas = content.testimonials.filter((t) => CLINICAL_CATEGORIES.test(t.category));
    const instituciones = content.testimonials.filter((t) => !CLINICAL_CATEGORIES.test(t.category));
    return [
      { id: "instituciones", title: "Instituciones y equipos", items: instituciones },
      { id: "personas", title: "Personas y familias", items: personas },
    ].filter((g) => g.items.length > 0);
  }, [content.testimonials]);

  const hiddenCount = groups.reduce((n, g) => n + Math.max(0, g.items.length - INITIAL_PER_GROUP), 0);

  const renderQuote = (t: typeof content.testimonials[number]) => (
    <figure key={t.id} className="border-t border-[#d8cfc0] pt-5">
      <blockquote className="crc-serif text-[1.125rem] leading-[1.55] text-[#171713]">
        <EditableAtom value={t.text} ariaLabel="Testimonio texto" multiline onCommit={(next) => updateTestimonial(t.id, { text: next })} />
      </blockquote>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-[0.875rem]">
        <span>
          <span className="font-semibold text-[#171713]">
            <EditableAtom value={t.name} ariaLabel="Testimonio nombre" onCommit={(next) => updateTestimonial(t.id, { name: next })} />
          </span>
          <span className="text-[#6f675d]"> · </span>
          <span className="text-[#9f5528]">
            <EditableAtom value={t.category} ariaLabel="Testimonio categoría" onCommit={(next) => updateTestimonial(t.id, { category: next })} />
          </span>
        </span>
        {adminEnabled ? (
          <button
            type="button"
            className="text-[#6f675d] transition-colors hover:text-[#9f5528]"
            aria-label="Eliminar testimonio"
            onClick={() => {
              const ok = window.confirm("¿Eliminar este testimonio?");
              if (!ok) return;
              deleteTestimonial(t.id);
            }}
          >
            ×
          </button>
        ) : null}
      </figcaption>
    </figure>
  );

  return (
    <section aria-labelledby="home-testimonios-title" className="border-t border-[#d8cfc0] bg-[#fffdf8] py-16 text-[#171713] sm:py-24">
      <div className="mx-auto max-w-[1640px] px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Testimonios</p>
            <h2 id="home-testimonios-title" className="crc-serif mt-3 text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-balance">
              <EditableText path="homeTestimonials.title" ariaLabel="Opiniones título" />
            </h2>
            <p className="mt-4 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
              <EditableText path="homeTestimonials.subtitle" ariaLabel="Opiniones subtítulo" multiline />
            </p>
          </div>
          <p className="max-w-[52ch] text-[0.875rem] leading-[1.6] text-[#6f675d] lg:justify-self-end">
            Los nombres de las personas que consultan van abreviados para proteger su privacidad. Las instituciones aparecen por su tipo de organización.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {groups.map((group) => (
            <div key={group.id}>
              <h3 className="text-[0.9375rem] font-semibold text-[#171713]">
                {group.title} <span className="font-normal text-[#6f675d]">({group.items.length})</span>
              </h3>
              <div className="mt-5 grid gap-8">
                {(expanded || adminEnabled ? group.items : group.items.slice(0, INITIAL_PER_GROUP)).map(renderQuote)}
              </div>
            </div>
          ))}
        </div>

        {hiddenCount > 0 && !adminEnabled ? (
          <div className="mt-12">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="inline-flex items-center rounded-[6px] border border-[#171713] px-5 py-2.5 text-[0.9375rem] font-semibold text-[#171713] transition-colors hover:bg-[#171713] hover:text-[#fffdf8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd6f3c] focus-visible:ring-offset-2"
            >
              {expanded ? "Ver menos" : `Ver los ${content.testimonials.length} testimonios`}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
