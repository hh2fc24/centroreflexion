"use client";

import type { SiteBlock } from "@/lib/editor/types";
import type { CSSProperties } from "react";
import { Hero } from "@/components/Hero";
import { FoundersSection } from "@/components/site/FoundersSection";
import { PublicationsSection } from "@/components/PublicationsSection";
import { InterviewsSection } from "@/components/InterviewsSection";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { FeaturedColumnBanner } from "@/components/site/FeaturedColumnBanner";
import { ArrowRight, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
      return (
        <>
          {wrapLegacySection("hero", <Hero />, true)}
          <FeaturedColumnBanner />
        </>
      );
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
        <div className="mx-auto max-w-4xl px-4 py-10 text-sm text-slate-500">
          Bloque legacy no disponible en esta página.
        </div>
      );
  }
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function normalizeVisibleIds(ids: string[], current: string[], maxVisible: number): string[] {
  if (ids.length <= maxVisible) return ids;
  const next = current.filter((id) => ids.includes(id));
  for (const id of ids) {
    if (next.length >= maxVisible) break;
    if (!next.includes(id)) next.push(id);
  }
  return next;
}

function LegacyServicesPreview() {
  const { content } = useContent();
  const cards = content.homeServices.cards;

  return (
    <section
      className="relative z-20 border-b border-[#ded5c7] px-5 py-0 sm:px-8 lg:px-14"
      style={{ background: "#f8f5ee" }}
    >
      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="mx-auto max-w-[1640px]"
      >
        <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
          {cards.map((card, cardPos) => {
            const idx = cards.findIndex((c) => c.id === card.id);
            return (
              <EditorLink key={card.id} href={card.href} className="group relative">
                <div
                  className="relative grid h-full grid-cols-[84px_1fr] items-center gap-6 border-b border-[#ded5c7] py-8 transition-all duration-300 hover:bg-[#f1eadf] md:border-b-0 md:border-r md:px-8 lg:grid-cols-[104px_1fr] lg:px-12"
                  style={cardPos === cards.length - 1 ? { borderRight: "none" } : {}}
                >
                  <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-[#bd6f3c] transition-transform duration-300 group-hover:scale-x-100" />

                  <div className="flex h-20 w-20 items-center justify-center lg:h-24 lg:w-24">
                    {cardPos === 0 && (
                      <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                        <path d="M21 72V35C21 20.64 30.16 11 42 11C53.84 11 63 20.64 63 35V72H21Z" stroke="#737d69" strokeWidth="1.8"/>
                        <path d="M42 68V30" stroke="#172017" strokeWidth="1.6" strokeLinecap="round"/>
                        <path d="M42 55C31 51 29 43 30 36C38 37 42 44 42 55Z" fill="#737d69"/>
                        <path d="M42 48C53 44 55 35 54 29C46 30 42 38 42 48Z" fill="#9aa58f"/>
                        <path d="M33 72H51" stroke="#737d69" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    )}
                    {cardPos === 1 && (
                      <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                        <path d="M14 21C14 15.5 18.5 11 24 11H47C52.5 11 57 15.5 57 21V41C57 46.5 52.5 51 47 51H34L23 61V51C18 50.5 14 46.2 14 41V21Z" fill="#737d69"/>
                        <path d="M33 31C33 25.5 37.5 21 43 21H61C66.5 21 71 25.5 71 31V48C71 53.5 66.5 58 61 58H54L45 68V58H43C37.5 58 33 53.5 33 48V31Z" fill="#bd6f3c"/>
                      </svg>
                    )}
                    {cardPos >= 2 && (
                      <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                        <circle cx="42" cy="24" r="9" fill="#bd6f3c"/>
                        <circle cx="23" cy="31" r="7" fill="#172017"/>
                        <circle cx="61" cy="31" r="7" fill="#5c665b"/>
                        <path d="M25 70V56C25 46.6 32.6 39 42 39C51.4 39 59 46.6 59 56V70H25Z" fill="#172017"/>
                        <path d="M8 70V58C8 50.2 14.2 44 22 44C25.9 44 29.4 45.6 32 48.2C27.7 52 25 57.6 25 64V70H8Z" fill="#7d836f"/>
                        <path d="M59 70V64C59 57.6 56.3 52 52 48.2C54.6 45.6 58.1 44 62 44C69.8 44 76 50.2 76 58V70H59Z" fill="#5c665b"/>
                      </svg>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-3 text-[0.92rem] font-extrabold uppercase tracking-[0.18em] text-[#2b2d28]">
                      <EditableText path={`homeServices.cards.${idx}.title`} ariaLabel="Servicio título" />
                    </h3>
                    <p className="mb-5 max-w-[34ch] text-[0.92rem] font-semibold leading-relaxed text-[#4f5149]">
                      <EditableText
                        path={`homeServices.cards.${idx}.description`}
                        ariaLabel="Servicio descripción"
                        multiline
                      />
                    </p>
                    <div className="flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.13em] text-[#bd6f3c] transition-all duration-200 group-hover:gap-3">
                      <EditableText path={`homeServices.cards.${idx}.ctaLabel`} ariaLabel="Servicio CTA" />
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
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
    <section className="py-16 sm:py-20" style={{ background: "#fbfaf6" }}>
      <div className="mx-auto max-w-[1640px] px-5 sm:px-8 lg:px-14">
        <MotionDiv className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[1.05rem] font-extrabold uppercase tracking-[0.14em] text-[#343631]">
              <EditableText path="homeLatest.title" ariaLabel="Últimos artículos título" />
            </h2>
          </div>
          <EditorLink
            href={content.homeLatest.linkHref}
            className="group flex items-center gap-3 self-start text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[#bd6f3c] transition-colors hover:text-[#9f5528] sm:self-end"
          >
            <EditableText path="homeLatest.linkLabel" ariaLabel="Últimos artículos link" />
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </EditorLink>
        </MotionDiv>

        <MotionList className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {latestArticles.map((post) => (
            <MotionItem
              key={post.id}
              className="group relative flex min-h-[360px] flex-col overflow-hidden border border-[#ded5c7] bg-[#fffdf8] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(31,27,22,0.10)]"
            >
              <div className="absolute left-0 right-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-[#bd6f3c] transition-transform duration-300 group-hover:scale-x-100" />

              <EditorLink
                href={post.link}
                className="relative block aspect-[16/10] w-full overflow-hidden bg-[#eee8dc]"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover saturate-[0.82] transition-transform duration-700 group-hover:scale-105"
                />
              </EditorLink>

              <div className="flex flex-grow flex-col p-6">
                <div className="mb-4 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#bd6f3c]">
                  {post.category}
                </div>
                <div className="group/inner relative flex-grow">
                  <h3
                    className="crc-serif mb-3 text-[1.35rem] font-semibold leading-snug text-[#23241f] transition-colors group-hover:text-[#9f5528]"
                  >
                    <EditorLink href={post.link}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </EditorLink>
                  </h3>
                  <p className="line-clamp-3 text-[0.9rem] leading-relaxed text-[#55574f]">{post.excerpt}</p>
                </div>
                <time dateTime={post.date} className="mt-5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#80786b]">
                  {post.date}
                </time>
              </div>
            </MotionItem>
          ))}
        </MotionList>
      </div>
    </section>
  );
}

function LegacyTestimonials() {
  const MAX_VISIBLE = 3;
  const ROTATE_EVERY_MS = 9000;
  const { content, updateTestimonial, deleteTestimonial } = useContent();
  const { adminEnabled } = useEditor();
  const [visibleIds, setVisibleIds] = useState<string[]>(() => content.testimonials.slice(0, MAX_VISIBLE).map((t) => t.id));
  const testimonialIds = useMemo(() => content.testimonials.map((t) => t.id), [content.testimonials]);
  const normalizedVisibleIds = useMemo(
    () => normalizeVisibleIds(testimonialIds, visibleIds, MAX_VISIBLE),
    [testimonialIds, visibleIds]
  );

  useEffect(() => {
    if (testimonialIds.length <= MAX_VISIBLE) return undefined;
    const timer = window.setInterval(() => {
      setVisibleIds((current) => {
        const base = normalizeVisibleIds(testimonialIds, current, MAX_VISIBLE);
        const hidden = testimonialIds.filter((id) => !base.includes(id));
        if (base.length === 0 || hidden.length === 0) return base;

        const next = [...base];
        const replaceIndex = Math.floor(Math.random() * next.length);
        const replacement = hidden[Math.floor(Math.random() * hidden.length)];
        next[replaceIndex] = replacement;
        return next;
      });
    }, ROTATE_EVERY_MS);
    return () => window.clearInterval(timer);
  }, [testimonialIds]);

  const visibleTestimonials = useMemo(() => {
    if (content.testimonials.length <= MAX_VISIBLE) return content.testimonials;
    const byId = new Map(content.testimonials.map((t) => [t.id, t]));
    return normalizedVisibleIds.map((id) => byId.get(id)).filter(isDefined);
  }, [content.testimonials, normalizedVisibleIds]);

  const renderCard = (t: typeof content.testimonials[number]) => {
    return (
      <div
        className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-6 shadow-2xl hover:bg-black/60 hover:-translate-y-1 transition-all duration-300 w-full flex flex-col justify-between"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-br from-white/5 via-transparent to-white/5" />

        <div className="relative flex flex-col h-full">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-sm font-bold text-white mb-1">
                <EditableAtom value={t.name} ariaLabel="Testimonio nombre" onCommit={(next) => updateTestimonial(t.id, { name: next })} />
              </div>
              <div className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-300 border border-white/5">
                <EditableAtom value={t.category} ariaLabel="Testimonio categoría" onCommit={(next) => updateTestimonial(t.id, { category: next })} />
              </div>
            </div>
            {adminEnabled ? (
              <button
                type="button"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
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
          </div>

          <div className="text-gray-200 leading-relaxed text-sm flex-grow">
            <EditableAtom value={t.text} ariaLabel="Testimonio texto" multiline onCommit={(next) => updateTestimonial(t.id, { text: next })} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative py-24 overflow-hidden isolate border-t border-[rgba(176,145,100,0.2)]" style={{ background: "#1C1208" }}>
      <div className="absolute inset-0 -z-10">
        <Image src="/images/consulting_hero.png" alt="Background" fill className="object-cover opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #1C1208 0%, rgba(28,18,8,0.7) 50%, #1C1208 100%)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              <EditableText path="homeTestimonials.title" ariaLabel="Opiniones título" />
            </h2>
            <p className="mt-4 text-lg text-[rgba(250,247,242,0.7)]">
              <EditableText path="homeTestimonials.subtitle" ariaLabel="Opiniones subtítulo" multiline />
            </p>
          </div>
          {adminEnabled ? (
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <Star className="h-4 w-4 text-amber-500" />
              <span>Editable en vivo</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 py-4">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleTestimonials.map((t) => (
              <motion.div
                key={t.id}
                layout
                className="h-full"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderCard(t)}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
