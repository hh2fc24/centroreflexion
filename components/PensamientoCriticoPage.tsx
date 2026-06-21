"use client";

import { useMemo, useState } from "react";
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
};

const editorialSections: EditorialSection[] = [
  {
    id: "infancia-derechos",
    title: "Infancia y Derechos",
    shortTitle: "Infancia",
    description: "Niñez, familia, protección, justicia y derechos sociales.",
    accent: "#d3976d",
  },
  {
    id: "salud-mental-critica",
    title: "Salud Mental Crítica",
    shortTitle: "Salud mental",
    description: "Malestar, medicalización, trauma, clínica y comunidad.",
    accent: "#91a884",
  },
  {
    id: "escuela-instituciones",
    title: "Escuela e Instituciones",
    shortTitle: "Instituciones",
    description: "Escuela, Estado, tribunales, residencias y dispositivos de cuidado.",
    accent: "#c9a34f",
  },
  {
    id: "cultura-pensamiento",
    title: "Cultura y Pensamiento",
    shortTitle: "Cultura",
    description: "Libros, filosofía, documentales y crítica cultural para leer el presente.",
    accent: "#b9857c",
  },
  {
    id: "debate-publico",
    title: "Debate Público",
    shortTitle: "Debate",
    description: "Política social, Estado, elecciones, ciudadanía y vida común.",
    accent: "#9aa7bd",
  },
];

const primarySectionByArticleId: Record<string, string> = {
  "la-infancia-olvidada-adopcion-sin-familia": "infancia-derechos",
  "naneas-realidad": "infancia-derechos",
  "ninez-discapacidad-cifras-full": "infancia-derechos",
  "infancia-que-nos-robaron-full": "infancia-derechos",
  "escuchar-antes-de-corregir-desafio-infancia": "salud-mental-critica",
  "medicalizar-la-infancia": "salud-mental-critica",
  "salud-mental-infantil-elecciones": "salud-mental-critica",
  "neoliberalismo-soledad-salud-mental": "salud-mental-critica",
  "sufrimiento-ninez-derecho-familia-tecnocracia": "escuela-instituciones",
  "escuelas-desreguladas-sufrimiento-infancia-terapia-ocupacional": "escuela-instituciones",
  "desinstitucionalizacion-infantil": "escuela-instituciones",
  "tecnocratas-infancia-pobre": "escuela-instituciones",
  "costo-abandonar-nino-calle": "escuela-instituciones",
  "el-mundo-de-sofia-recuperar-asombro": "cultura-pensamiento",
  "el-principito-infancia-asombro": "cultura-pensamiento",
  "frankenstein-moderno-prometeo-mary-shelley": "cultura-pensamiento",
  "el-rey-filosofo": "cultura-pensamiento",
  "la-libertad": "cultura-pensamiento",
  "bajo-custodia-documental": "cultura-pensamiento",
  "freudomarxismo-psicoanalisis": "cultura-pensamiento",
  "aliviar-conciencia-planeta": "debate-publico",
  "eleccion-presidencial-40-horas": "debate-publico",
  "los-therians": "debate-publico",
};

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
  const sectionId = primarySectionByArticleId[article.id];
  if (sectionId) return editorialSections.find((section) => section.id === sectionId) ?? editorialSections[0];
  if (article.category === "Salud Mental") return editorialSections[1];
  if (article.category === "Educación") return editorialSections[2];
  if (article.category === "Crítica Literaria" || article.category === "Filosofía" || article.category === "Reseñas") {
    return editorialSections[3];
  }
  if (article.category === "Política y Sociedad") return editorialSections[4];
  return editorialSections[0];
}

function getSectionArticles(section: EditorialSection, articles: EditorialArticle[]) {
  return articles.filter((article) => getSectionForArticle(article).id === section.id);
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
      ? "w-[74vw] max-w-[320px] shrink-0 snap-start sm:w-[300px]"
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
      <div className="flex min-h-[190px] flex-col p-4">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.13em] text-[#8a8276]">
          Lectura · {getReadingMinutes(article)} min
        </div>
        <h3 className={`font-serif font-bold leading-tight text-[#171713] transition-colors group-hover:text-[#9f5528] ${compact ? "text-[1.05rem]" : "text-[1.18rem]"}`}>
          <Link href={`${article.basePath}/${article.id}`}>{article.title}</Link>
        </h3>
        {variant === "grid" ? (
          <p className="mt-3 line-clamp-3 text-[0.82rem] leading-5 text-[#55574f]">{article.excerpt}</p>
        ) : null}
        <div className="mt-auto pt-5">
          <AuthorLine article={article} />
        </div>
      </div>
    </article>
  );
}

function DossierFeature({ articles }: { articles: EditorialArticle[] }) {
  const lead = articles[0];
  if (!lead) return null;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#15130f] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(211,151,109,0.65),transparent)]" />
      <div className="mx-auto grid max-w-[1640px] gap-5 xl:grid-cols-[minmax(440px,0.92fr)_minmax(620px,1.08fr)]">
        <Link
          href={`${lead.basePath}/${lead.id}`}
          className="group relative min-h-[480px] overflow-hidden rounded-[8px] border border-white/10 bg-[#211d17] shadow-[0_28px_90px_rgba(0,0,0,0.3)]"
        >
          <Image
            src={lead.image}
            alt={lead.title}
            fill
            sizes="(min-width: 1280px) 44vw, 100vw"
            className="object-cover opacity-74 saturate-[0.82] transition duration-700 group-hover:scale-[1.035] group-hover:opacity-88 group-hover:saturate-100"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,15,11,0.08)_0%,rgba(18,15,11,0.44)_46%,rgba(18,15,11,0.94)_100%)]" />
          <div className="absolute left-5 top-5 border border-white/18 bg-[#11100c]/72 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#ead7c1] backdrop-blur">
            Dossier · {articles.length} textos
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#d3976d]">
              Curaduría editorial
            </p>
            <h2 className="max-w-xl font-serif text-[clamp(1.85rem,3.1vw,3.35rem)] font-semibold leading-[1.02] text-[#fff8ef]">
              Infancia, Estado y cuidado
            </h2>
            <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-[#ded1c2] sm:text-base">
              Una selección sobre protección, justicia de familia, escuela, residencias y políticas públicas de niñez.
            </p>
            <span className="mt-6 inline-flex border-b border-[#d3976d] pb-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#f2be91] transition group-hover:border-[#fff8ef] group-hover:text-[#fff8ef]">
              Comenzar lectura
            </span>
          </div>
        </Link>

        <div className="grid gap-4 sm:grid-cols-2">
          {articles.slice(1).map((article, index) => (
            <Link
              key={article.id}
              href={`${article.basePath}/${article.id}`}
              className="group relative min-h-[250px] overflow-hidden rounded-[8px] border border-white/10 bg-[#1b1813] p-5 pb-20 transition duration-300 hover:-translate-y-1 hover:border-[#d3976d]/55 hover:bg-[#211d17] hover:shadow-[0_22px_60px_rgba(0,0,0,0.22)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#d3976d] transition-transform duration-300 group-hover:scale-x-100" />
              <div className="flex items-start justify-between gap-4">
                <span className="font-serif text-3xl leading-none text-[#d3976d]">{String(index + 2).padStart(2, "0")}</span>
                <span className="text-right text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8f867b]">
                  {getReadingMinutes(article)} min
                </span>
              </div>
              <h3 className="mt-6 line-clamp-4 font-serif text-[1.12rem] font-semibold leading-snug text-[#fff8ef] transition group-hover:text-[#f2be91]">
                {article.title}
              </h3>
              <p className="mt-3 line-clamp-2 text-[0.82rem] leading-5 text-[#bfb4a7]">{article.excerpt}</p>
              <p className="absolute bottom-5 left-5 right-5 border-t border-white/10 pt-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#9f9487]">
                {article.author}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionRail({
  section,
  articles,
  onSelect,
}: {
  section: EditorialSection;
  articles: EditorialArticle[];
  onSelect: (sectionId: string) => void;
}) {
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
          <h2 className="font-serif text-xl font-semibold text-[#fff8ef] sm:text-2xl">{section.title}</h2>
          <p className="mt-1 max-w-2xl text-[0.82rem] leading-5 text-[#c9beb0]">{section.description}</p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(section.id)}
          className="self-start border-b border-[#d3976d]/70 pb-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#d3976d] transition hover:border-[#fff8ef] hover:text-[#fff8ef] sm:self-auto"
        >
          Ver sección
        </button>
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

  const featuredArticle =
    allArticles.find((article) => article.id === "sufrimiento-ninez-derecho-familia-tecnocracia") ??
    allArticles[0] ??
    null;
  const dossierArticles = useMemo(() => {
    const ids = [
      "desinstitucionalizacion-infantil",
      "medicalizar-la-infancia",
      "escuelas-desreguladas-sufrimiento-infancia-terapia-ocupacional",
      "infancia-que-nos-robaron-full",
    ];
    return ids.map((id) => allArticles.find((article) => article.id === id)).filter(Boolean) as EditorialArticle[];
  }, [allArticles]);

  const usedInLead = useMemo(() => {
    return new Set([featuredArticle?.id, ...dossierArticles.map((article) => article.id)].filter(Boolean));
  }, [dossierArticles, featuredArticle?.id]);

  const homeSectionCollections = useMemo(
    () =>
      sectionCollections.map((section) => ({
        ...section,
        articles: section.articles.filter((article) => !usedInLead.has(article.id)),
      })),
    [sectionCollections, usedInLead]
  );

  const selectedCollection =
    activeSection === "portada"
      ? null
      : sectionCollections.find((section) => section.id === activeSection) ?? null;

  if (!featuredArticle) return null;

  const featuredSection = getSectionForArticle(featuredArticle);

  return (
    <div className="min-h-screen bg-[#11100c] text-[#fff8ef]">
      <section className="relative isolate min-h-[520px] overflow-hidden lg:min-h-[580px]">
        <Image
          src={featuredArticle.image}
          alt={featuredArticle.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-58 saturate-[0.78]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,16,12,0.97)_0%,rgba(17,16,12,0.84)_43%,rgba(17,16,12,0.5)_72%,rgba(17,16,12,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,16,12,0.2)_0%,rgba(17,16,12,0.48)_72%,#11100c_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[1640px] flex-col justify-center px-4 py-10 sm:px-6 lg:min-h-[580px] lg:px-10 lg:py-14">
          <div className="grid max-w-[720px] gap-7">
            <div className="max-w-[680px]">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#f4dfca] backdrop-blur">
                  Observatorio CRC
                </span>
                <span
                  className="rounded-full px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#171713]"
                  style={{ backgroundColor: featuredSection.accent }}
                >
                  {featuredSection.title}
                </span>
              </div>
              <h1 className="font-serif text-[clamp(2.25rem,3.6vw,3.9rem)] font-semibold leading-[0.98] tracking-normal text-[#fff8ef]">
                Observatorio Crítico
              </h1>
              <p className="mt-3 max-w-[620px] font-serif text-[clamp(1.08rem,1.55vw,1.65rem)] font-semibold leading-tight text-[#ead7c1]">
                Infancia, Salud Mental e Instituciones
              </p>
              <p className="mt-5 max-w-lg text-sm font-medium leading-6 text-[#d8d0c4] sm:text-[0.96rem]">
                Análisis, columnas y ensayos para comprender las tensiones entre infancia, salud mental, escuela, familia y Estado.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={`${featuredArticle.basePath}/${featuredArticle.id}`}
                  className="inline-flex h-10 items-center rounded-[6px] bg-[#d3976d] px-5 text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#171713] transition hover:bg-[#e7b187]"
                >
                  Leer portada
                </Link>
                <a
                  href="#secciones"
                  className="inline-flex h-10 items-center rounded-[6px] border border-white/20 bg-white/8 px-5 text-[11px] font-extrabold uppercase tracking-[0.13em] text-white transition hover:bg-white/14"
                >
                  Ver secciones
                </a>
              </div>
            </div>

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
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#d3976d]">
                Sección editorial
              </p>
              <h2 className="font-serif text-3xl font-semibold text-[#fff8ef] sm:text-4xl">{selectedCollection.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#c9beb0]">{selectedCollection.description}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {selectedCollection.articles.map((article) => (
                <ArticleCard key={`${selectedCollection.id}-${article.id}`} article={article} compact variant="grid" />
              ))}
            </div>
          </section>
        ) : (
          <>
            <DossierFeature articles={dossierArticles} />

            {homeSectionCollections.map((section) => (
              <SectionRail key={section.id} section={section} articles={section.articles} onSelect={setActiveSection} />
            ))}

            <section className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10 lg:py-12">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#d3976d]">Índice completo</p>
                  <h2 className="font-serif text-2xl font-semibold text-[#fff8ef]">Todas las publicaciones</h2>
                </div>
                <p className="text-xs font-semibold text-[#b9afa2]">{allArticles.length} textos publicados</p>
              </div>
              <div className="grid gap-x-8 gap-y-0 border-t border-white/10 md:grid-cols-2 xl:grid-cols-3">
                {allArticles.map((article) => (
                  <Link
                    key={`archive-${article.id}`}
                    href={`${article.basePath}/${article.id}`}
                    className="group border-b border-white/10 py-4 transition hover:border-[#d3976d]/50"
                  >
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#8f867b]">
                      {getSectionForArticle(article).shortTitle} · {article.date}
                    </p>
                    <h3 className="mt-1 font-serif text-[1.02rem] font-semibold leading-snug text-[#efe7dc] transition group-hover:text-[#f2be91]">
                      {article.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
