"use client";

import { useMemo, useState } from "react";
import { MotionItem, MotionList } from "@/components/ui/Motion";
import Image from "next/image";
import Link from "next/link";
import { parseDisplayDate } from "@/lib/articles/date";
import type { Article } from "@/lib/data";

const getAuthorDetails = (author: string) => {
  if (author.includes("Rocío Solar")) {
    return { image: "/images/rocio_solar_real_white.png", role: "Co-fundadora CRC · Terapeuta Ocupacional, Magíster (c) en Ocupación y TO, U. de Chile" };
  }
  if (author.includes("Juan Carlos Rauld")) {
    return { image: "/images/juan_carlos_real_white.png", role: "Director CRC · Doctorando en Trabajo Social, Universidad de Rovira I Virgilli, España" };
  }
  return null;
};

export function PensamientoCriticoPage({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("Todas");

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

  const categories = useMemo(() => {
    const catSet = [...new Set(allArticles.map((a) => a.category))];
    return catSet.sort(
      (a, b) => allArticles.filter((x) => x.category === b).length - allArticles.filter((x) => x.category === a).length
    );
  }, [allArticles]);

  const filteredArticles = useMemo(
    () => (activeCategory === "Todas" ? allArticles : allArticles.filter((a) => a.category === activeCategory)),
    [activeCategory, allArticles]
  );

  const featuredArticle = filteredArticles[0] ?? null;
  const remainingArticles = filteredArticles.slice(1);

  if (allArticles.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#f8f5ee] py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl animate-in fade-in slide-in-from-bottom-8 text-center duration-1000 sm:mb-20">
          <h2 className="text-4xl font-semibold tracking-tight text-[#171713] sm:text-4xl lg:text-4xl font-serif">
            Pensamiento <span className="text-[#9f5528]">Crítico</span>
          </h2>
          <div className="mx-auto mt-8 mb-6 h-1 w-20 bg-[#9f5528]"></div>
          <p className="mt-4 text-base font-light leading-7 text-[#55574f] sm:text-xl sm:leading-8">
            Columnas de opinión, observaciones reflexivas y ensayos analíticos
            sobre la complejidad social contemporánea.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveCategory("Todas")}
              className={`cursor-pointer inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-all duration-200 ${
                activeCategory === "Todas"
                  ? "bg-[#9f5528] text-white ring-[#9f5528] shadow-md shadow-[#dec0a8]"
                  : "bg-[#f4eadf] text-[#9f5528] ring-[#dec0a8] hover:bg-[#ecd8c7]"
              }`}
            >
              Todas
              <span
                className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeCategory === "Todas" ? "bg-[#fffdf8]/20 text-white" : "bg-[#ecd8c7] text-[#bd6f3c]"
                }`}
              >
                {allArticles.length}
              </span>
            </button>
            {categories.map((cat) => {
              const count = allArticles.filter((a) => a.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ring-1 ring-inset transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-[#171713] text-white ring-[#171713] shadow-md"
                      : "bg-[#fffdf8] text-[#55574f] ring-[#ded5c7] hover:bg-[#f8f5ee] hover:text-[#171713]"
                  }`}
                >
                  {cat}
                  <span
                    className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      activeCategory === cat ? "bg-[#fffdf8]/20 text-white" : "bg-[#eee8dc] text-[#70695f]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          {activeCategory !== "Todas" ? (
            <p className="mt-4 text-sm text-[#8a8276]">
              Mostrando {filteredArticles.length} artículo{filteredArticles.length !== 1 ? "s" : ""} en{" "}
              <strong className="text-[#55574f]">{activeCategory}</strong> ·{" "}
              <button onClick={() => setActiveCategory("Todas")} className="font-medium text-[#bd6f3c] hover:underline">
                Ver todas
              </button>
            </p>
          ) : null}
        </div>

        {featuredArticle ? (
          <div className="relative isolate mb-16 overflow-hidden rounded-[8px] bg-[#fffdf8] pr-0 ring-1 ring-[#ded5c7] shadow-md shadow-[#ded5c7]/50 sm:mb-24 sm:rounded-[8px] lg:flex lg:items-center lg:pr-10 lg:pl-0">
            <Link
              href={`${featuredArticle.basePath}/${featuredArticle.id}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-t-3xl lg:w-1/2 lg:aspect-[5/4] lg:rounded-l-3xl lg:rounded-tr-none"
            >
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </Link>
            <div className="p-6 sm:p-10 lg:w-1/2 lg:pl-16">
              <div className="mb-5 flex flex-wrap items-center gap-3 text-sm sm:mb-6">
                <time dateTime={featuredArticle.date} className="font-medium uppercase tracking-wide text-[#70695f]">
                  {featuredArticle.date}
                </time>
                <span className="relative z-10 rounded-full bg-[#f4eadf] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#9f5528]">
                  {featuredArticle.category}
                </span>
              </div>
              <h3 className="mb-5 text-2xl font-bold leading-[1.2] text-[#171713] transition-colors hover:text-[#9f5528] sm:mb-6 sm:text-4xl font-serif">
                <Link href={`${featuredArticle.basePath}/${featuredArticle.id}`}>{featuredArticle.title}</Link>
              </h3>
              <p className="mt-2 mb-6 border-l-2 border-[#dec0a8] pl-4 text-base italic leading-relaxed text-[#55574f] sm:mb-8 sm:text-lg">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center gap-x-4 border-t border-[#eee8dc] pt-6">
                {(() => {
                  const details = getAuthorDetails(featuredArticle.author);
                  return (
                    <>
                      {details?.image ? (
                        <Image
                          src={details.image}
                          alt={featuredArticle.author}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover shadow-md shadow-[#cfc4b4]"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#171713] text-sm font-bold text-white shadow-md shadow-[#cfc4b4]">
                          {featuredArticle.author.charAt(0)}
                        </div>
                      )}
                      <div className="text-base leading-6">
                        <p className="font-semibold text-[#171713]">{featuredArticle.author}</p>
                        {details?.role ? <p className="text-sm text-[#70695f]">{details.role}</p> : null}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mb-10 flex items-center gap-4 sm:mb-16 sm:gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#171713] font-serif">
            {activeCategory === "Todas" ? "Más Columnas" : activeCategory}
          </h2>
          <div className="h-px flex-1 bg-[#ded5c7]"></div>
        </div>

        <MotionList
          key={activeCategory}
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-y-24"
        >
          {remainingArticles.map((post) => (
            <MotionItem
              key={post.id}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-[8px] bg-[#fffdf8] shadow-sm ring-1 ring-[#eee8dc] transition-all duration-300 hover:shadow-sm hover:shadow-[#ded5c7]/50"
            >
              <Link href={`${post.basePath}/${post.id}`} className="relative block aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#0f0d0a]/0 transition-colors duration-300 group-hover:bg-[#0f0d0a]/5" />
              </Link>
              <div className="flex flex-1 flex-col justify-between p-5 sm:p-8">
                <div>
                  <div className="mb-5 flex items-center gap-x-4 text-xs">
                    <time dateTime={post.date} className="font-medium text-[#70695f]">
                      {post.date}
                    </time>
                    <span
                      className={`relative z-10 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        post.category === "Educación"
                          ? "bg-[#f4eadf] text-[#9f5528]"
                          : post.category === "Políticas Públicas"
                            ? "bg-[#f4eadf] text-[#9f5528]"
                            : post.category === "Infancia"
                              ? "bg-[#f4eadf] text-[#9f5528]"
                              : "bg-[#eee8dc] text-[#3f423a]"
                      }`}
                    >
                      {post.category}
                    </span>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 mb-4 text-xl font-bold leading-tight text-[#171713] transition-colors group-hover:text-[#9f5528] sm:text-2xl font-serif">
                      <Link href={`${post.basePath}/${post.id}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-[#55574f] sm:text-base">{post.excerpt}</p>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-x-4 border-t border-[#eee8dc] pt-6">
                  {(() => {
                    const details = getAuthorDetails(post.author);
                    return (
                      <>
                        {details?.image ? (
                          <Image
                            src={details.image}
                            alt={post.author}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover ring-1 ring-[#ded5c7]"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f5ee] text-xs font-bold text-[#55574f] ring-1 ring-[#ded5c7]">
                            {post.author.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 text-sm leading-6">
                          <p className="font-semibold text-[#171713]">{post.author}</p>
                          {details?.role ? <p className="line-clamp-1 text-xs text-[#70695f]">{details.role}</p> : null}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </MotionItem>
          ))}
        </MotionList>
        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-[#8a8276]">No hay artículos en esta categoría.</p>
            <button onClick={() => setActiveCategory("Todas")} className="mt-4 font-semibold text-[#bd6f3c] hover:underline">
              Ver todas las columnas
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
