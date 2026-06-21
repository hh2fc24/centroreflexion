"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseDisplayDate } from "@/lib/articles/date";
import type { Article } from "@/lib/data";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type EditorialArticle = Article & { basePath: string };

type EditorialSection = {
  id: string;
  title: string;
  shortTitle: string;
  accent: string;
  /** Categories that map to this section */
  categories: string[];
};

/* ------------------------------------------------------------------ */
/*  Sections — auto-classification by article.category                 */
/* ------------------------------------------------------------------ */

const editorialSections: EditorialSection[] = [
  {
    id: "infancia-derechos",
    title: "Infancia y Derechos",
    shortTitle: "Infancia",
    accent: "#d3976d",
    categories: ["Infancia y Niñez"],
  },
  {
    id: "salud-mental-critica",
    title: "Salud Mental Crítica",
    shortTitle: "Salud Mental",
    accent: "#91a884",
    categories: ["Salud Mental"],
  },
  {
    id: "escuela-instituciones",
    title: "Escuela e Instituciones",
    shortTitle: "Instituciones",
    accent: "#c9a34f",
    categories: ["Educación"],
  },
  {
    id: "cultura-pensamiento",
    title: "Cultura y Pensamiento",
    shortTitle: "Cultura",
    accent: "#b9857c",
    categories: ["Crítica Literaria", "Filosofía", "Reseñas"],
  },
  {
    id: "debate-publico",
    title: "Debate Público",
    shortTitle: "Debate",
    accent: "#9aa7bd",
    categories: ["Política y Sociedad"],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getSectionForArticle(article: EditorialArticle): EditorialSection {
  for (const section of editorialSections) {
    if (section.categories.includes(article.category)) return section;
  }
  return editorialSections[0];
}

function getReadingMinutes(article: EditorialArticle) {
  const words = article.content.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(words / 210));
}

/* ------------------------------------------------------------------ */
/*  Scroll Rail Hook                                                   */
/* ------------------------------------------------------------------ */

function useScrollRail() {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  return { ref, canLeft, canRight, scroll };
}

/* ------------------------------------------------------------------ */
/*  Netflix Card — Image-first with overlay title                      */
/* ------------------------------------------------------------------ */

function CinemaCard({
  article,
  size = "md",
}: {
  article: EditorialArticle;
  size?: "sm" | "md" | "lg";
}) {
  const section = getSectionForArticle(article);
  const mins = getReadingMinutes(article);

  const aspectClass =
    size === "lg" ? "aspect-[16/9]" : size === "sm" ? "aspect-[4/3]" : "aspect-[16/10]";
  const titleClass =
    size === "lg"
      ? "text-[clamp(1.15rem,1.8vw,1.65rem)]"
      : size === "sm"
        ? "text-[0.92rem] leading-snug"
        : "text-[clamp(0.95rem,1.3vw,1.15rem)]";

  return (
    <Link
      href={`${article.basePath}/${article.id}`}
      className="group relative block overflow-hidden rounded-lg bg-[#1a1814]"
    >
      <div className={`relative ${aspectClass} overflow-hidden`}>
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes={size === "lg" ? "(min-width:1024px) 50vw, 100vw" : "320px"}
          className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* Section pill */}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#111]"
          style={{ backgroundColor: section.accent }}
        >
          {section.shortTitle}
        </span>

        {/* Reading time */}
        <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-sm">
          {mins} min
        </span>

        {/* Title overlay at bottom — hidden on hover to avoid overlap */}
        <div className="absolute inset-x-0 bottom-0 p-4 transition-opacity duration-300 group-hover:opacity-0">
          <h3
            className={`font-serif font-semibold leading-tight text-white ${titleClass}`}
          >
            {article.title}
          </h3>
          <p className="mt-2 text-[11px] font-semibold tracking-wide text-white/50">
            {article.author}
          </p>
        </div>

        {/* Hover reveal: excerpt */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/95 via-black/60 to-black/20 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div>
            <span
              className="mb-2 inline-block rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#111]"
              style={{ backgroundColor: section.accent }}
            >
              {section.shortTitle}
            </span>
            <h3 className={`font-serif font-semibold leading-tight text-white ${titleClass}`}>
              {article.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-[0.78rem] leading-relaxed text-white/65">
              {article.excerpt}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-white/50">{article.author} · {article.date}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#d3976d]">
                Leer <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero — Latest article, full width                                  */
/* ------------------------------------------------------------------ */

function HeroFeature({ article }: { article: EditorialArticle }) {
  const section = getSectionForArticle(article);
  const mins = getReadingMinutes(article);

  return (
    <section className="relative isolate overflow-hidden">
      <Link href={`${article.basePath}/${article.id}`} className="group relative block">
        <div className="relative h-[55vh] min-h-[400px] max-h-[600px] lg:h-[60vh]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover grayscale transition duration-1000 group-hover:scale-[1.03] group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#11100c]/95 via-[#11100c]/60 to-[#11100c]/30 lg:from-[#11100c]/90 lg:via-[#11100c]/50 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100c] via-transparent to-[#11100c]/40" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-5 pb-10 sm:px-8 lg:max-w-[55%] lg:px-12 lg:pb-14">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#111]"
                style={{ backgroundColor: section.accent }}
              >
                {section.shortTitle}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                {mins} min lectura · {article.date}
              </span>
            </div>
            <h1 className="font-serif text-[clamp(1.55rem,3vw,2.75rem)] font-semibold leading-[1.08] text-white">
              {article.title}
            </h1>
            <p className="mt-3 line-clamp-2 max-w-xl text-[0.88rem] leading-relaxed text-white/55">
              {article.excerpt}
            </p>
            <div className="mt-5 flex items-center gap-4">
              <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm transition group-hover:bg-[#d3976d] group-hover:text-[#111]">
                Leer columna <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="text-[12px] font-semibold text-white/45">
                Por {article.author}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured Grid — next 4 articles in 2x2                             */
/* ------------------------------------------------------------------ */

function FeaturedGrid({ articles }: { articles: EditorialArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="border-b border-white/8 px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-[1640px]">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#d3976d]">
              Recientes
            </p>
            <h2 className="mt-1 font-serif text-lg font-semibold text-white/90 sm:text-xl">
              Últimas publicaciones
            </h2>
          </div>
        </div>
        {/* Desktop: 2x2 grid. Mobile: horizontal scroll */}
        <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4">
          {articles.slice(0, 4).map((a) => (
            <CinemaCard key={a.id} article={a} size="md" />
          ))}
        </div>
        <div className="flex snap-x gap-3 overflow-x-auto sm:hidden">
          {articles.slice(0, 4).map((a) => (
            <div key={a.id} className="w-[78vw] shrink-0 snap-start">
              <CinemaCard article={a} size="md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Rail — horizontal scroll per editorial section             */
/* ------------------------------------------------------------------ */

function SectionRail({
  section,
  articles,
}: {
  section: EditorialSection;
  articles: EditorialArticle[];
}) {
  const { ref, canLeft, canRight, scroll } = useScrollRail();

  if (articles.length === 0) return null;

  return (
    <section className="border-b border-white/6 py-8 lg:py-10">
      {/* Header */}
      <div className="mb-5 flex items-end justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: section.accent }}
          />
          <h2 className="font-serif text-base font-semibold text-white/90 sm:text-lg">
            {section.title}
          </h2>
          <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-bold text-white/40">
            {articles.length}
          </span>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canLeft}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-white/40 transition hover:border-white/25 hover:text-white/70 disabled:opacity-25 disabled:cursor-default"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canRight}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 text-white/40 transition hover:border-white/25 hover:text-white/70 disabled:opacity-25 disabled:cursor-default"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Rail */}
      <div
        ref={ref}
        className="flex snap-x gap-3.5 overflow-x-auto px-5 pb-2 sm:px-8 lg:px-12"
        style={{ scrollbarWidth: "none" }}
      >
        {articles.map((a) => (
          <div
            key={`${section.id}-${a.id}`}
            className="w-[70vw] shrink-0 snap-start sm:w-[260px] lg:w-[280px]"
          >
            <CinemaCard article={a} size="sm" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Editorial Index — clean list at the bottom                         */
/* ------------------------------------------------------------------ */

function EditorialIndex({ articles }: { articles: EditorialArticle[] }) {
  return (
    <section className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1640px]">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#d3976d]">
              Índice completo
            </p>
            <h2 className="mt-1 font-serif text-lg font-semibold text-white/90">
              Todas las publicaciones
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-white/35">
            {articles.length} textos
          </span>
        </div>
        <div className="grid gap-x-10 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => {
            const sec = getSectionForArticle(article);
            return (
              <Link
                key={`idx-${article.id}`}
                href={`${article.basePath}/${article.id}`}
                className="group flex items-start gap-4 border-b border-white/6 py-4 transition hover:border-white/15"
              >
                {/* Thumbnail */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#1a1814] lg:h-16 lg:w-16">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover grayscale transition duration-500 group-hover:scale-110 group-hover:grayscale-0"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: sec.accent }}
                    />
                    <span className="truncate text-[9px] font-bold uppercase tracking-wider text-white/35">
                      {sec.shortTitle} · {article.date}
                    </span>
                  </div>
                  <h3 className="mt-1 line-clamp-2 text-[0.82rem] font-semibold leading-snug text-white/75 transition group-hover:text-[#f2d5b8]">
                    {article.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Filter Bar                                                 */
/* ------------------------------------------------------------------ */

function SectionBar({
  sections,
  activeSection,
  onSelect,
}: {
  sections: { section: EditorialSection; count: number }[];
  activeSection: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-white/8 bg-[#11100c]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1640px] gap-1.5 overflow-x-auto px-5 py-3 sm:px-8 lg:px-12" style={{ scrollbarWidth: "none" }}>
        <button
          type="button"
          onClick={() => onSelect("portada")}
          className={`inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[10px] font-extrabold uppercase tracking-[0.14em] transition ${
            activeSection === "portada"
              ? "bg-white/90 text-[#111]"
              : "bg-white/6 text-white/50 hover:bg-white/10 hover:text-white/70"
          }`}
        >
          Portada
        </button>
        {sections.map(({ section, count }) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[10px] font-extrabold uppercase tracking-[0.14em] transition ${
              activeSection === section.id
                ? "text-[#111]"
                : "bg-white/6 text-white/50 hover:bg-white/10 hover:text-white/70"
            }`}
            style={activeSection === section.id ? { backgroundColor: section.accent } : undefined}
          >
            {section.shortTitle}
            <span className="rounded-full bg-black/15 px-1.5 py-0.5 text-[9px]">{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Detail — grid view when a section is selected              */
/* ------------------------------------------------------------------ */

function SectionDetail({
  section,
  articles,
}: {
  section: EditorialSection;
  articles: EditorialArticle[];
}) {
  return (
    <section className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-[1640px]">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: section.accent }} />
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/40">
              Sección editorial · {articles.length} textos
            </p>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-white/90 sm:text-3xl">
            {section.title}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {articles.map((a) => (
            <CinemaCard key={`${section.id}-${a.id}`} article={a} size="md" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export function PensamientoCriticoPage({ articles }: { articles: Article[] }) {
  const [activeSection, setActiveSection] = useState<string>("portada");

  // Sort all articles newest first, attach basePath
  const allArticles = useMemo<EditorialArticle[]>(
    () =>
      [...articles]
        .map((a) => ({ ...a, basePath: "/pensamiento-critico" }))
        .sort((a, b) => {
          const tb = parseDisplayDate(b.date);
          const ta = parseDisplayDate(a.date);
          if (Number.isFinite(tb) && Number.isFinite(ta)) return tb - ta;
          return b.date.localeCompare(a.date);
        }),
    [articles]
  );

  // Group articles by section
  const sectionCollections = useMemo(
    () =>
      editorialSections
        .map((section) => ({
          section,
          articles: allArticles.filter(
            (a) => getSectionForArticle(a).id === section.id
          ),
        }))
        .filter((s) => s.articles.length > 0),
    [allArticles]
  );

  // Hero = most recent article
  const heroArticle = allArticles[0] ?? null;

  // Featured grid = next 4
  const featuredArticles = allArticles.slice(1, 5);

  // IDs already shown in hero + featured
  const usedIds = useMemo(
    () => new Set([heroArticle?.id, ...featuredArticles.map((a) => a.id)].filter(Boolean)),
    [heroArticle, featuredArticles]
  );

  // Rails: per section, excluding already-shown articles
  const railCollections = useMemo(
    () =>
      sectionCollections.map((sc) => ({
        ...sc,
        articles: sc.articles.filter((a) => !usedIds.has(a.id)),
      })),
    [sectionCollections, usedIds]
  );

  // Currently selected section
  const selectedSection =
    activeSection === "portada"
      ? null
      : sectionCollections.find((sc) => sc.section.id === activeSection) ?? null;

  if (!heroArticle) return null;

  return (
    <div className="min-h-screen bg-[#11100c] text-white">
      {/* Hero */}
      <HeroFeature article={heroArticle} />

      {/* Section Bar */}
      <SectionBar
        sections={sectionCollections.map((sc) => ({
          section: sc.section,
          count: sc.articles.length,
        }))}
        activeSection={activeSection}
        onSelect={setActiveSection}
      />

      {/* Content */}
      <main className="mx-auto max-w-[1640px]">
        {selectedSection ? (
          <SectionDetail section={selectedSection.section} articles={selectedSection.articles} />
        ) : (
          <>
            {/* Featured Grid */}
            <FeaturedGrid articles={featuredArticles} />

            {/* Section Rails */}
            {railCollections.map((sc) => (
              <SectionRail
                key={sc.section.id}
                section={sc.section}
                articles={sc.articles}
              />
            ))}

            {/* Full Index */}
            <EditorialIndex articles={allArticles} />
          </>
        )}
      </main>
    </div>
  );
}
