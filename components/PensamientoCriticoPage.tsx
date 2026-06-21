"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Clock3, Layers, Newspaper, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { parseDisplayDate } from "@/lib/articles/date";
import type { Article } from "@/lib/data";

type EditorialArticle = Article & { basePath: string };

type EditorialSection = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  accent: string;
  match: (article: EditorialArticle) => boolean;
};

const institutionalIds = new Set([
  "escuelas-desreguladas-sufrimiento-infancia-terapia-ocupacional",
  "sufrimiento-ninez-derecho-familia-tecnocracia",
  "desinstitucionalizacion-infantil",
  "medicalizar-la-infancia",
  "tecnocratas-infancia-pobre",
  "la-infancia-olvidada-adopcion-sin-familia",
  "costo-abandonar-nino-calle",
  "infancia-que-nos-robaron-full",
  "bajo-custodia-documental",
]);

const debateIds = new Set([
  "salud-mental-infantil-elecciones",
  "desinstitucionalizacion-infantil",
  "costo-abandonar-nino-calle",
  "tecnocratas-infancia-pobre",
  "la-libertad",
]);

const childRightsIds = new Set([
  "bajo-custodia-documental",
  "infancia-que-nos-robaron-full",
]);

const editorialSections: EditorialSection[] = [
  {
    id: "infancia-derechos",
    title: "Infancia y Derechos",
    shortTitle: "Infancia",
    description: "Niñez, familia, protección, justicia y derechos sociales.",
    accent: "#d3976d",
    match: (article) => article.category === "Infancia y Niñez" || childRightsIds.has(article.id),
  },
  {
    id: "salud-mental-critica",
    title: "Salud Mental Crítica",
    shortTitle: "Salud mental",
    description: "Malestar, medicalización, trauma, clínica y comunidad.",
    accent: "#91a884",
    match: (article) =>
      article.category === "Salud Mental" ||
      article.id === "escuchar-antes-de-corregir-desafio-infancia" ||
      article.id === "medicalizar-la-infancia",
  },
  {
    id: "escuela-instituciones",
    title: "Escuela e Instituciones",
    shortTitle: "Instituciones",
    description: "Escuela, Estado, tribunales, residencias y dispositivos de cuidado.",
    accent: "#c9a34f",
    match: (article) => article.category === "Educación" || institutionalIds.has(article.id),
  },
  {
    id: "cultura-pensamiento",
    title: "Cultura y Pensamiento",
    shortTitle: "Cultura",
    description: "Libros, filosofía, documentales y crítica cultural para leer el presente.",
    accent: "#b9857c",
    match: (article) =>
      article.category === "Crítica Literaria" || article.category === "Filosofía" || article.category === "Reseñas",
  },
  {
    id: "debate-publico",
    title: "Debate Público",
    shortTitle: "Debate",
    description: "Política social, Estado, elecciones, ciudadanía y vida común.",
    accent: "#9aa7bd",
    match: (article) => article.category === "Política y Sociedad" || debateIds.has(article.id),
  },
];

const getAuthorDetails = (author: string) => {
  if (author.includes("Rocío Solar")) {
    return {
      image: "/images/rocio_solar_real_white.png",
      role: "Cofundadora CRC · Terapeuta Ocupacional",
    };
  }
  if (author.includes("Juan Carlos Rauld")) {
    return {
      image: "/images/juan_carlos_real_white.png",
      role: "Director CRC · Investigador en infancia e instituciones",
    };
  }
  return null;
};

function getReadingMinutes(article: EditorialArticle) {
  const words = article.content.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(words / 210));
}

function getSectionForArticle(article: EditorialArticle) {
  return editorialSections.find((section) => section.match(article)) ?? editorialSections[0];
}

function getSectionArticles(section: EditorialSection, articles: EditorialArticle[]) {
  return articles.filter(section.match);
}

function AuthorLine({ article, tone = "dark" }: { article: EditorialArticle; tone?: "dark" | "light" }) {
  const details = getAuthorDetails(article.author);
  const textColor = tone === "light" ? "text-[#f3eadf]" : "text-[#171713]";
  const mutedColor = tone === "light" ? "text-[#d8d0c4]" : "text-[#70695f]";

  return (
    <div className="flex min-w-0 items-center gap-3">
      {details?.image ? (
        <Image
          src={details.image}
          alt={article.author}
          width={42}
          height={42}
          className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/35"
        />
      ) : (
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            tone === "light" ? "bg-white/14 text-white ring-1 ring-white/20" : "bg-[#eee8dc] text-[#55574f]"
          }`}
        >
          {article.author.charAt(0)}
        </div>
      )}
      <div className="min-w-0">
        <p className={`truncate text-sm font-bold ${textColor}`}>{article.author}</p>
        <p className={`truncate text-xs ${mutedColor}`}>{details?.role ?? article.date}</p>
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  compact = false,
  variant = "rail",
}: {
  article: EditorialArticle;
  compact?: boolean;
  variant?: "rail" | "grid";
}) {
  const section = getSectionForArticle(article);
  const sizeClass =
    variant === "rail"
      ? "w-[78vw] max-w-[360px] shrink-0 snap-start sm:w-[340px]"
      : "w-full";

  return (
    <article className={`group overflow-hidden rounded-[8px] bg-[#fffdf8] shadow-[0_18px_48px_rgba(0,0,0,0.22)] ring-1 ring-white/10 ${sizeClass}`}>
      <Link href={`${article.basePath}/${article.id}`} className="relative block aspect-[16/10] overflow-hidden bg-[#222018]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="360px"
          className="object-cover saturate-[0.88] transition duration-700 group-hover:scale-105 group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
        <span
          className="absolute bottom-3 left-3 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#171713]"
          style={{ backgroundColor: section.accent }}
        >
          {section.shortTitle}
        </span>
      </Link>
      <div className="flex min-h-[214px] flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-[#8a8276]">
          <Clock3 className="h-3.5 w-3.5" />
          {getReadingMinutes(article)} min
        </div>
        <h3 className={`font-serif font-bold leading-tight text-[#171713] transition-colors group-hover:text-[#9f5528] ${compact ? "text-xl" : "text-2xl"}`}>
          <Link href={`${article.basePath}/${article.id}`}>{article.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#55574f]">{article.excerpt}</p>
        <div className="mt-auto pt-5">
          <AuthorLine article={article} />
        </div>
      </div>
    </article>
  );
}

function SectionRail({ section, articles }: { section: EditorialSection; articles: EditorialArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-white/10 py-10 sm:py-12">
      <div className="mb-5 flex flex-col gap-3 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-10">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: section.accent }} />
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#b9afa2]">
              {articles.length} lectura{articles.length !== 1 ? "s" : ""}
            </p>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#fff8ef] sm:text-3xl">{section.title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#c9beb0]">{section.description}</p>
        </div>
        <Link
          href="#secciones"
          className="inline-flex items-center gap-2 self-start text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#d3976d] transition hover:text-[#f2be91] sm:self-auto"
        >
          Explorar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex snap-x gap-4 overflow-x-auto px-4 pb-3 sm:gap-5 sm:px-6 lg:px-10">
        {articles.slice(0, 10).map((article) => (
          <ArticleCard key={`${section.id}-${article.id}`} article={article} />
        ))}
      </div>
    </section>
  );
}

export function PensamientoCriticoPage({ articles }: { articles: Article[] }) {
  const [activeSection, setActiveSection] = useState<string>("portada");

  const allArticles = useMemo(
    () =>
      [...articles]
        .map((article) => ({ ...article, basePath: "/pensamiento-critico" }))
        .sort((a, b) => {
          const tb = parseDisplayDate(b.date);
          const ta = parseDisplayDate(a.date);
          if (Number.isFinite(tb) && Number.isFinite(ta)) return tb - ta;
          return b.date.localeCompare(a.date);
        }),
    [articles]
  );

  const sectionCollections = useMemo(
    () =>
      editorialSections.map((section) => ({
        ...section,
        articles: getSectionArticles(section, allArticles),
      })),
    [allArticles]
  );

  const featuredArticle = allArticles[0] ?? null;
  const dossierArticles = useMemo(() => {
    const ids = [
      "sufrimiento-ninez-derecho-familia-tecnocracia",
      "desinstitucionalizacion-infantil",
      "medicalizar-la-infancia",
      "escuelas-desreguladas-sufrimiento-infancia-terapia-ocupacional",
    ];
    return ids.map((id) => allArticles.find((article) => article.id === id)).filter(Boolean) as EditorialArticle[];
  }, [allArticles]);

  const selectedCollection =
    activeSection === "portada"
      ? null
      : sectionCollections.find((section) => section.id === activeSection) ?? null;

  if (!featuredArticle) return null;

  const featuredSection = getSectionForArticle(featuredArticle);

  return (
    <div className="min-h-screen bg-[#11100c] text-[#fff8ef]">
      <section className="relative isolate min-h-[720px] overflow-hidden">
        <Image
          src={featuredArticle.image}
          alt={featuredArticle.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-58 saturate-[0.78]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,16,12,0.98)_0%,rgba(17,16,12,0.86)_34%,rgba(17,16,12,0.52)_68%,rgba(17,16,12,0.86)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,16,12,0.18)_0%,rgba(17,16,12,0.64)_72%,#11100c_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1640px] flex-col justify-end px-4 pb-10 pt-20 sm:px-6 lg:px-10 lg:pb-14">
          <div className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <div className="max-w-4xl">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f4dfca] backdrop-blur">
                  <Newspaper className="h-4 w-4" />
                  Observatorio CRC
                </span>
                <span
                  className="rounded-full px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#171713]"
                  style={{ backgroundColor: featuredSection.accent }}
                >
                  {featuredSection.title}
                </span>
              </div>
              <h1 className="max-w-5xl font-serif text-[clamp(2.65rem,6vw,6.3rem)] font-semibold leading-[0.95] tracking-normal text-[#fff8ef]">
                Observatorio Crítico de Infancia, Salud Mental e Instituciones
              </h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-[#d8d0c4] sm:text-lg">
                Una portada editorial para leer el sufrimiento infantil, la salud mental y los dispositivos institucionales sin reducirlos a titulares.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`${featuredArticle.basePath}/${featuredArticle.id}`}
                  className="inline-flex h-12 items-center gap-3 rounded-[6px] bg-[#d3976d] px-6 text-sm font-extrabold uppercase tracking-[0.13em] text-[#171713] transition hover:bg-[#e7b187]"
                >
                  Leer portada
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#secciones"
                  className="inline-flex h-12 items-center rounded-[6px] border border-white/20 bg-white/8 px-6 text-sm font-extrabold uppercase tracking-[0.13em] text-white transition hover:bg-white/14"
                >
                  Ver secciones
                </a>
              </div>
            </div>

            <aside className="rounded-[8px] border border-white/14 bg-[#171713]/72 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-md">
              <p className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#d3976d]">
                <Sparkles className="h-4 w-4" />
                En portada
              </p>
              <Link href={`${featuredArticle.basePath}/${featuredArticle.id}`} className="group block">
                <h2 className="font-serif text-3xl font-semibold leading-tight text-[#fff8ef] transition group-hover:text-[#f2be91]">
                  {featuredArticle.title}
                </h2>
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#d8d0c4]">{featuredArticle.excerpt}</p>
              </Link>
              <div className="mt-6 border-t border-white/10 pt-5">
                <AuthorLine article={featuredArticle} tone="light" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="secciones" className="border-y border-white/10 bg-[#11100c] px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1640px] gap-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSection("portada")}
            className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-xs font-extrabold uppercase tracking-[0.14em] transition ${
              activeSection === "portada"
                ? "bg-[#fff8ef] text-[#171713]"
                : "bg-white/7 text-[#d8d0c4] ring-1 ring-white/12 hover:bg-white/12"
            }`}
          >
            <Layers className="h-4 w-4" />
            Portada
          </button>
          {sectionCollections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-xs font-extrabold uppercase tracking-[0.14em] transition ${
                activeSection === section.id
                  ? "text-[#171713]"
                  : "bg-white/7 text-[#d8d0c4] ring-1 ring-white/12 hover:bg-white/12"
              }`}
              style={activeSection === section.id ? { backgroundColor: section.accent } : undefined}
            >
              {section.shortTitle}
              <span className="rounded-full bg-black/18 px-2 py-0.5 text-[10px]">{section.articles.length}</span>
            </button>
          ))}
        </div>
      </section>

      <main className="mx-auto max-w-[1640px]">
        {selectedCollection ? (
          <section className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
            <div className="mb-8 max-w-3xl">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#d3976d]">
                <BookOpen className="h-4 w-4" />
                Sección editorial
              </p>
              <h2 className="font-serif text-4xl font-semibold text-[#fff8ef] sm:text-5xl">{selectedCollection.title}</h2>
              <p className="mt-3 text-base leading-7 text-[#c9beb0]">{selectedCollection.description}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {selectedCollection.articles.map((article) => (
                <ArticleCard key={`${selectedCollection.id}-${article.id}`} article={article} compact variant="grid" />
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="grid gap-6 border-b border-white/10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-10 lg:py-16">
              <div>
                <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#d3976d]">Dossier editorial</p>
                <h2 className="font-serif text-4xl font-semibold leading-tight text-[#fff8ef] sm:text-5xl">
                  Infancia, Estado y sufrimiento institucional
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-[#c9beb0]">
                  Una ruta de lectura para entender cómo la niñez queda atrapada entre familia, escuela, justicia, residencias y salud mental.
                </p>
              </div>
              <div className="space-y-3">
                {dossierArticles.map((article, index) => (
                  <Link
                    key={article.id}
                    href={`${article.basePath}/${article.id}`}
                    className="group grid grid-cols-[44px_1fr] gap-4 border-t border-white/10 py-4 first:border-t-0"
                  >
                    <span className="font-serif text-3xl text-[#d3976d]">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block font-serif text-xl font-semibold leading-tight text-[#fff8ef] transition group-hover:text-[#f2be91]">
                        {article.title}
                      </span>
                      <span className="mt-2 block text-xs font-bold uppercase tracking-[0.13em] text-[#9f9487]">
                        {article.author} · {getReadingMinutes(article)} min
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {sectionCollections.map((section) => (
              <SectionRail key={section.id} section={section} articles={section.articles} />
            ))}

            <section className="border-t border-white/10 px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#d3976d]">Archivo completo</p>
                  <h2 className="font-serif text-4xl font-semibold text-[#fff8ef]">Todas las publicaciones</h2>
                </div>
                <p className="text-sm font-semibold text-[#b9afa2]">{allArticles.length} textos publicados</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {allArticles.map((article) => (
                  <ArticleCard key={`archive-${article.id}`} article={article} compact variant="grid" />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
