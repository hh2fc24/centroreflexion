"use client";

import type { SiteBlock } from "@/lib/editor/types";
import { Hero } from "@/components/Hero";
import { FoundersSection } from "@/components/site/FoundersSection";
import { PublicationsSection } from "@/components/PublicationsSection";
import { InterviewsSection } from "@/components/InterviewsSection";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, BookOpen, PenTool, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MotionDiv, MotionItem, MotionList } from "@/components/ui/Motion";
import { EditorLink } from "@/components/editor/EditorLink";
import { EditableText } from "@/components/editor/EditableText";
import { EditableAtom } from "@/components/editor/EditableAtom";
import { useArticles, useContent, useEditor } from "@/lib/editor/hooks";
import type { Article } from "@/lib/data";
import { columns as publishedColumns, reviews as publishedReviews } from "@/lib/data";

export function LegacyBlock({ block }: { pageId: string; block: SiteBlock; editable: boolean }) {
  // This is a compatibility layer so the new Pages system can render existing sections without breaking.
  // Home still uses the legacy HomeCanvas end-to-end; pages can optionally embed these sections.
  switch (block.type) {
    case "legacy.hero":
      return <div data-crc-legacy="hero"><Hero /></div>;
    case "legacy.founders":
      return <div data-crc-legacy="founders"><FoundersSection /></div>;
    case "legacy.servicesPreview":
      return <div data-crc-legacy="servicesPreview"><LegacyServicesPreview /></div>;
    case "legacy.latestArticles":
      return <div data-crc-legacy="latestArticles"><LegacyLatestArticles /></div>;
    case "legacy.publications":
      return <div data-crc-legacy="publications"><PublicationsSection /></div>;
    case "legacy.interviews":
      return <div data-crc-legacy="interviews"><InterviewsSection /></div>;
    case "legacy.testimonials":
      return <div data-crc-legacy="testimonials"><LegacyTestimonials /></div>;
    default:
      return (
        <div className="mx-auto max-w-4xl px-4 py-10 text-sm text-slate-500">
          Bloque legacy no disponible en esta página.
        </div>
      );
  }
}

function pickFeatured(columns: Article[], reviews: Article[]) {
  const article1 = columns.find((c) => c.id === "elecciones-polarizacion") || columns[0]!;
  const article2 = reviews.find((r) => r.id === "soledad-garcia-marquez") || reviews[0]!;
  const article3 = columns.find((c) => c.id === "mito-progreso") || columns[2]!;
  return [
    { ...article1, link: `/columnas/${article1.id}` },
    { ...article2, link: `/critica/${article2.id}` },
    { ...article3, link: `/columnas/${article3.id}` },
  ];
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
    <section className="relative z-20 mt-16 md:mt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <MotionDiv
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mx-auto max-w-7xl"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const idx = cards.findIndex((c) => c.id === card.id);
            const toneClasses =
              card.tone === "primary"
                ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                : card.tone === "secondary"
                  ? "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white"
                  : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white";

            const ctaTone =
              card.tone === "primary"
                ? "text-primary"
                : card.tone === "secondary"
                  ? "text-secondary"
                  : "text-emerald-600";

            return (
              <EditorLink key={card.id} href={card.href} className="group relative">
                <div className="h-full relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-100">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl mb-6 transition-colors ${toneClasses}`}
                  >
                    {card.tone === "secondary" ? <BookOpen className="h-6 w-6" /> : <PenTool className="h-6 w-6" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
                    <EditableText path={`homeServices.cards.${idx}.title`} ariaLabel="Servicio título" />
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                    <EditableText
                      path={`homeServices.cards.${idx}.description`}
                      ariaLabel="Servicio descripción"
                      multiline
                    />
                  </p>
                  <div
                    className={`flex items-center ${ctaTone} text-sm font-semibold group-hover:translate-x-2 transition-transform`}
                  >
                    <EditableText path={`homeServices.cards.${idx}.ctaLabel`} ariaLabel="Servicio CTA" />{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
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
  const { adminEnabled } = useEditor();
  const { columns, reviews } = useArticles();

  const featuredArticles = pickFeatured(adminEnabled ? columns : publishedColumns, adminEnabled ? reviews : publishedReviews);

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionDiv className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            <EditableText path="homeLatest.title" ariaLabel="Últimos artículos título" />
          </h2>
          <EditorLink
            href={content.homeLatest.linkHref}
            className="text-sm font-semibold text-red-600 hover:text-red-500 group flex items-center"
          >
            <EditableText path="homeLatest.linkLabel" ariaLabel="Últimos artículos link" />{" "}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </EditorLink>
        </MotionDiv>

        <MotionList className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-8">
          {featuredArticles.map((post) => (
            <MotionItem key={post.id} className="flex flex-col items-start justify-between group cursor-pointer">
              <EditorLink
                href={post.link}
                className="relative w-full aspect-[16/9] mb-4 bg-gray-100 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow block"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </EditorLink>
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.date} className="text-gray-500">
                  {post.date}
                </time>
                <span
                  className={`relative z-10 rounded-full px-3 py-1.5 font-medium ${
                    post.category === "Política"
                      ? "bg-blue-50 text-blue-600"
                      : post.category === "Literatura"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-green-50 text-green-600"
                  }`}
                >
                  {post.category}
                </span>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-bold leading-6 text-gray-900 group-hover:text-blue-600 transition-colors">
                  <EditorLink href={post.link}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </EditorLink>
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt}</p>
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
    <section className="relative py-24 overflow-hidden isolate bg-gray-900 border-t border-gray-800">
      <div className="absolute inset-0 -z-10">
        <Image src="/images/library_bg.jpg" alt="Background" fill className="object-cover opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/80 to-gray-900" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white font-serif">
              <EditableText path="homeTestimonials.title" ariaLabel="Opiniones título" />
            </h2>
            <p className="mt-4 text-lg text-gray-300">
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
