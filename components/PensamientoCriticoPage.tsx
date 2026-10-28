"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { parseDisplayDate } from "@/lib/articles/date";
import type { Article } from "@/lib/data";
import { CoverImage, TypographicCover, hasCoverImage, toSentenceCase } from "@/components/TypographicCover";

/* ------------------------------------------------------------------ */
/*  Secciones editoriales — clasificación por article.category         */
/* ------------------------------------------------------------------ */

type EditorialSection = {
  id: string;
  title: string;
  categories: string[];
};

const editorialSections: EditorialSection[] = [
  { id: "infancia-derechos", title: "Infancia y derechos", categories: ["Infancia y Niñez"] },
  { id: "salud-mental-critica", title: "Salud mental", categories: ["Salud Mental"] },
  { id: "escuela-instituciones", title: "Escuela e instituciones", categories: ["Educación"] },
  {
    id: "cultura-pensamiento",
    title: "Cultura y pensamiento",
    categories: ["Crítica Literaria", "Literatura", "Filosofía", "Reseñas"],
  },
  { id: "debate-publico", title: "Debate público", categories: ["Política y Sociedad", "Política"] },
];

const BASE_PATH = "/pensamiento-critico";
const GRID_COUNT = 6;

function getSection(article: Article): EditorialSection {
  return editorialSections.find((s) => s.categories.includes(article.category)) ?? editorialSections[0];
}

function getReadingMinutes(article: Article) {
  const words = article.content.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(words / 210));
}

const href = (article: Article) => `${BASE_PATH}/${article.id}`;

/* ------------------------------------------------------------------ */
/*  Piezas                                                             */
/* ------------------------------------------------------------------ */

function ArticleMeta({ article }: { article: Article }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 text-[0.8125rem] font-semibold text-[#9f5528]">
      {toSentenceCase(article.category)}
      <span className="font-normal tabular-nums text-[#6f675d]">{article.date}</span>
    </p>
  );
}

function FeaturedArticle({ article }: { article: Article }) {
  const withImage = hasCoverImage(article.image);
  return (
    <article className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      <Link
        href={href(article)}
        className="group block rounded-[6px] outline-none focus-visible:ring-2 focus-visible:ring-[#bd6f3c] focus-visible:ring-offset-2"
      >
        {withImage ? (
          <CoverImage
            src={article.image}
            alt={article.imageAlt || article.title}
            sizes="(min-width: 1024px) 600px, 100vw"
            priority
            className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]"
          />
        ) : (
          <TypographicCover
            category={article.category}
            title={article.title}
            date={article.date}
            titleAs="h2"
            className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] sm:[&_h2]:text-[1.9rem] lg:[&_h2]:text-[2.15rem]"
          />
        )}
      </Link>
      <div className="flex flex-col justify-center">
        <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Última publicación</p>
        {withImage ? (
          <>
            <p className="mt-2 text-[0.875rem] tabular-nums text-[#6f675d]">
              {toSentenceCase(article.category)} · {article.date}
            </p>
            <h2 className="crc-serif mt-4 max-w-[24ch] text-balance text-[clamp(1.6rem,2.4vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-[#171713]">
              <Link href={href(article)} className="hover:underline hover:decoration-[#bd6f3c] hover:underline-offset-4">
                {article.title}
              </Link>
            </h2>
          </>
        ) : null}
        <p className="mt-4 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">{article.excerpt}</p>
        <p className="mt-6 text-[0.9375rem] text-[#171713]">
          <span className="font-semibold">{article.author}</span>
          <span className="text-[#6f675d]"> · {getReadingMinutes(article)} min de lectura</span>
        </p>
        <Link
          href={href(article)}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] sm:w-auto sm:self-start"
        >
          Leer la columna
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const withImage = hasCoverImage(article.image);
  return (
    <article>
      <Link
        href={href(article)}
        className="group block rounded-[6px] outline-none focus-visible:ring-2 focus-visible:ring-[#bd6f3c] focus-visible:ring-offset-2"
      >
        {withImage ? (
          <>
            <CoverImage
              src={article.image}
              alt={article.imageAlt || article.title}
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            />
            <div className="mt-4">
              <ArticleMeta article={article} />
            </div>
            <h3 className="crc-serif mt-2 text-[1.3rem] font-semibold leading-[1.2] text-[#171713] group-hover:underline group-hover:decoration-[#bd6f3c] group-hover:underline-offset-4">
              {article.title}
            </h3>
          </>
        ) : (
          <TypographicCover
            category={article.category}
            title={article.title}
            date={article.date}
            titleAs="h3"
            className="transition-transform duration-200 group-hover:-translate-y-px"
          />
        )}
        <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-[1.7] text-[#55574f]">{article.excerpt}</p>
        <p className="mt-3 text-[0.875rem] text-[#6f675d]">
          <span className="font-semibold text-[#171713]">{article.author}</span> · {getReadingMinutes(article)} min
        </p>
      </Link>
    </article>
  );
}

function ArticleIndex({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="indice-titulo" className="mt-20">
      <div className="flex items-baseline justify-between gap-4 border-b border-[#d8cfc0] pb-4">
        <h2 id="indice-titulo" className="crc-serif text-[clamp(1.6rem,2.3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-[#171713]">
          Archivo
        </h2>
        <span className="text-[0.875rem] tabular-nums text-[#6f675d]">{articles.length} textos</span>
      </div>
      <ol>
        {articles.map((article) => (
          <li key={article.id} className="border-b border-[#ded5c7]">
            <Link href={href(article)} className="group flex items-start gap-4 py-5 sm:gap-6">
              {hasCoverImage(article.image) ? (
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[6px] bg-[#eee8dc] sm:h-20 sm:w-20">
                  <Image src={article.image} alt="" fill sizes="80px" className="object-cover" />
                </span>
              ) : null}
              <span className="grid min-w-0 flex-1 gap-1 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-6">
                <span className="text-[0.8125rem] font-semibold text-[#9f5528]">
                  {toSentenceCase(article.category)}
                </span>
                <span className="crc-serif text-[1.15rem] font-semibold leading-[1.3] text-[#171713] group-hover:underline group-hover:decoration-[#bd6f3c] group-hover:underline-offset-4 sm:text-[1.25rem]">
                  {article.title}
                </span>
                <span className="text-[0.875rem] text-[#6f675d] sm:text-right">
                  {article.author} · <span className="tabular-nums">{article.date}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Página                                                             */
/* ------------------------------------------------------------------ */

/** Minúsculas y sin tildes, para que "nino" encuentre "niño". */
const normalizeSearch = (text: string) =>
  text.toLocaleLowerCase("es-CL").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function PensamientoCriticoPage({ articles }: { articles: Article[] }) {
  const [activeSection, setActiveSection] = useState<string>("todo");
  const [query, setQuery] = useState("");

  const allArticles = useMemo(
    () =>
      [...articles].sort((a, b) => {
        const tb = parseDisplayDate(b.date);
        const ta = parseDisplayDate(a.date);
        if (Number.isFinite(tb) && Number.isFinite(ta)) return tb - ta;
        return b.date.localeCompare(a.date);
      }),
    [articles],
  );

  const sectionCounts = useMemo(
    () =>
      editorialSections
        .map((section) => ({
          section,
          count: allArticles.filter((a) => getSection(a).id === section.id).length,
        }))
        .filter((s) => s.count > 0),
    [allArticles],
  );

  const visible = useMemo(
    () =>
      activeSection === "todo"
        ? allArticles
        : allArticles.filter((a) => getSection(a).id === activeSection),
    [allArticles, activeSection],
  );

  // Búsqueda en todo el archivo (título, bajada, autor y texto), dentro de la
  // sección activa. Cada término debe aparecer; el orden no importa.
  const searchIndex = useMemo(
    () =>
      new Map(
        allArticles.map((a) => [
          a.id,
          normalizeSearch([a.title, a.excerpt, a.author, a.category, a.content.join(" ")].join(" ")),
        ]),
      ),
    [allArticles],
  );
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  const results = terms.length
    ? visible.filter((a) => {
        const haystack = searchIndex.get(a.id) ?? "";
        return terms.every((t) => haystack.includes(t));
      })
    : null;

  if (allArticles.length === 0) return null;

  const [featured, ...rest] = visible;
  const grid = rest.slice(0, GRID_COUNT);
  const archive = rest.slice(GRID_COUNT);

  const tabs = [{ id: "todo", title: "Todo", count: allArticles.length }].concat(
    sectionCounts.map(({ section, count }) => ({ id: section.id, title: section.title, count })),
  );

  return (
    <div className="min-h-screen bg-[#f8f5ee] text-[#171713]">
      <header className="border-b border-[#d8cfc0] bg-[#fffdf8]">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-8 sm:pb-12 sm:pt-20">
          <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Columnas y análisis del CRC</p>
          <h1 className="crc-serif mt-3 max-w-[20ch] text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
            Pensamiento crítico
          </h1>
          <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
            Columnas, reseñas y análisis del equipo del Centro de Reflexiones Críticas sobre infancia,
            salud mental, escuela, instituciones y debate público en Chile.
          </p>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-8">
          <label htmlFor="buscar-columnas" className="text-[0.875rem] font-semibold text-[#171713]">
            Buscar en el archivo
          </label>
          <input
            id="buscar-columnas"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tema, autor o palabra: residencias, Foucault, escuela…"
            className="mt-2 block min-h-11 w-full max-w-[36rem] rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8] px-4 text-[1rem] text-[#171713] placeholder:text-[#8a8276] focus:border-[#bd6f3c] focus:outline-none focus:ring-2 focus:ring-[#bd6f3c]/25"
          />
        </div>
        <nav aria-label="Secciones editoriales" className="mx-auto max-w-6xl px-4 sm:px-8">
          <ul className="-mb-px flex gap-6 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {tabs.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <li key={tab.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveSection(tab.id)}
                    aria-pressed={isActive}
                    className={`inline-flex items-baseline gap-1.5 border-b-2 py-3 text-[0.9375rem] font-semibold transition-colors ${
                      isActive
                        ? "border-[#bd6f3c] text-[#171713]"
                        : "border-transparent text-[#6f675d] hover:text-[#171713]"
                    }`}
                  >
                    {tab.title}
                    <span className="text-[0.8125rem] font-normal tabular-nums text-[#6f675d]">{tab.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
        {results ? (
          <section aria-labelledby="resultados-titulo">
            <h2 id="resultados-titulo" className="border-b border-[#d8cfc0] pb-4 text-[0.9375rem] font-semibold text-[#171713]" aria-live="polite">
              {results.length === 0
                ? `Sin resultados para «${query.trim()}»`
                : `${results.length} ${results.length === 1 ? "texto" : "textos"} para «${query.trim()}»`}
            </h2>
            {results.length === 0 ? (
              <p className="mt-6 max-w-[56ch] text-[1rem] leading-[1.7] text-[#55574f]">
                Prueba con otra palabra o{" "}
                <button type="button" onClick={() => setQuery("")} className="font-semibold text-[#9f5528] underline underline-offset-4">
                  vuelve al archivo completo
                </button>
                .
              </p>
            ) : (
              <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </section>
        ) : null}

        {!results && featured ? <FeaturedArticle article={featured} /> : null}

        {!results && grid.length > 0 ? (
          <section aria-labelledby="recientes-titulo" className="mt-16">
            <h2 id="recientes-titulo" className="crc-serif border-b border-[#d8cfc0] pb-4 text-[clamp(1.6rem,2.3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
              Recientes
            </h2>
            <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        ) : null}

        {!results ? <ArticleIndex articles={archive} /> : null}
      </main>
    </div>
  );
}
