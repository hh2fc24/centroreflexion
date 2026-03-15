"use client";

import { useState, useMemo } from "react";
import { MotionList, MotionItem } from "@/components/ui/Motion";
import Image from "next/image";
import Link from "next/link";
import { readers } from "@/lib/data";
import { parseDisplayDate } from "@/lib/articles/date";

const getAuthorDetails = (author: string) => {
    if (author.includes("Rocío Solar")) {
        return { image: "/images/rocio_solar.png", role: "Co-fundadora & Terapeuta Ocupacional" };
    }
    if (author.includes("Juan Carlos Rauld")) {
        return { image: "/images/juan_carlos_20260224.png", role: "Director CRC · Doctorando en Trabajo Social (URV, España)" };
    }
    return null;
};

export default function PensamientoCritico() {
    const [activeCategory, setActiveCategory] = useState<string>("Todas");

    // Merge all reader articles and sort by date (newest first)
    const allArticles = useMemo(() =>
        [...readers].map(r => ({ ...r, basePath: "/pensamiento-critico" })).sort((a, b) => {
            const tb = parseDisplayDate(b.date);
            const ta = parseDisplayDate(a.date);
            if (Number.isFinite(tb) && Number.isFinite(ta)) return tb - ta;
            return b.date.localeCompare(a.date);
        }),
        []
    );

    if (allArticles.length === 0) return null;

    // Get unique categories
    const categories = useMemo(() => [...new Set(allArticles.map(a => a.category))], [allArticles]);

    // Filtered articles
    const filteredArticles = useMemo(() =>
        activeCategory === "Todas"
            ? allArticles
            : allArticles.filter(a => a.category === activeCategory),
        [allArticles, activeCategory]
    );

    const featuredArticle = filteredArticles[0];
    const remainingArticles = filteredArticles.slice(1);

    return (
        <div className="min-h-screen bg-gray-50 py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mx-auto mb-14 max-w-3xl animate-in fade-in slide-in-from-bottom-8 text-center duration-1000 sm:mb-20">
                    <h2 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-6xl font-serif">
                        Pensamiento <span className="text-red-700">Crítico</span>
                    </h2>
                    <div className="h-1 w-20 bg-red-700 mx-auto mt-8 mb-6"></div>
                    <p className="mt-4 text-base font-light leading-7 text-gray-600 sm:text-xl sm:leading-8">
                        Columnas de opinión, observaciones reflexivas y ensayos analíticos
                        sobre la complejidad social contemporánea.
                    </p>

                    {/* Category badges — funcionales, filtran los artículos */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        <button
                            onClick={() => setActiveCategory("Todas")}
                            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-all duration-200 cursor-pointer ${
                                activeCategory === "Todas"
                                    ? "bg-red-700 text-white ring-red-700 shadow-md shadow-red-200"
                                    : "bg-red-50 text-red-700 ring-red-200 hover:bg-red-100"
                            }`}
                        >
                            Todas
                            <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeCategory === "Todas" ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}>
                                {allArticles.length}
                            </span>
                        </button>
                        {categories.map(cat => {
                            const count = allArticles.filter(a => a.category === cat).length;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ring-1 ring-inset transition-all duration-200 cursor-pointer ${
                                        activeCategory === cat
                                            ? "bg-gray-900 text-white ring-gray-900 shadow-md"
                                            : "bg-white text-gray-600 ring-gray-200 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    {cat}
                                    <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeCategory === cat ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {activeCategory !== "Todas" && (
                        <p className="mt-4 text-sm text-gray-400">
                            Mostrando {filteredArticles.length} artículo{filteredArticles.length !== 1 ? "s" : ""} en <strong className="text-gray-600">{activeCategory}</strong>
                            {" "}·{" "}
                            <button onClick={() => setActiveCategory("Todas")} className="text-red-600 hover:underline font-medium">Ver todas</button>
                        </p>
                    )}
                </div>

                {/* Featured Article */}
                {featuredArticle && (
                <div className="relative isolate mb-16 overflow-hidden rounded-2xl bg-white pr-0 ring-1 ring-gray-200 shadow-xl shadow-gray-200/50 sm:mb-24 sm:rounded-3xl lg:flex lg:items-center lg:pr-10 lg:pl-0">
                    <Link href={`${featuredArticle.basePath}/${featuredArticle.id}`} className="block lg:w-1/2 group relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
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
                            <time dateTime={featuredArticle.date} className="text-gray-500 font-medium tracking-wide uppercase">
                                {featuredArticle.date}
                            </time>
                            <span className="relative z-10 rounded-full px-3 py-1 font-semibold text-xs tracking-wide uppercase bg-red-50 text-red-700">
                                {featuredArticle.category}
                            </span>
                        </div>
                        <h3 className="mb-5 text-2xl font-bold leading-[1.2] text-gray-900 transition-colors hover:text-red-700 sm:text-4xl sm:mb-6 font-serif">
                            <Link href={`${featuredArticle.basePath}/${featuredArticle.id}`}>
                                {featuredArticle.title}
                            </Link>
                        </h3>
                        <p className="mt-2 mb-6 border-l-2 border-red-200 pl-4 text-base italic leading-relaxed text-gray-600 sm:mb-8 sm:text-lg">
                            {featuredArticle.excerpt}
                        </p>
                        <div className="flex items-center gap-x-4 border-t border-gray-100 pt-6">
                            {(() => {
                                const details = getAuthorDetails(featuredArticle.author);
                                return (
                                    <>
                                        {details?.image ? (
                                            <Image src={details.image} alt={featuredArticle.author} width={48} height={48} className="h-12 w-12 rounded-full object-cover shadow-md shadow-gray-300" />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-gray-300">
                                                {featuredArticle.author.charAt(0)}
                                            </div>
                                        )}
                                        <div className="text-base leading-6">
                                            <p className="font-semibold text-gray-900">
                                                {featuredArticle.author}
                                            </p>
                                            {details?.role && (
                                                <p className="text-sm text-gray-500">{details.role}</p>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
                )}

                {/* Grid Divider */}
                <div className="mb-10 flex items-center gap-4 sm:mb-16 sm:gap-6">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 font-serif">
                        {activeCategory === "Todas" ? "Más Columnas" : activeCategory}
                    </h2>
                    <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                {/* Masonry-Style Grid for Remaining Articles */}
                <MotionList className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-y-24">
                    {remainingArticles.map((post) => (
                        <MotionItem key={post.id} className="flex flex-col group cursor-pointer bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden">
                            <Link href={`${post.basePath}/${post.id}`} className="relative w-full aspect-[16/9] overflow-hidden block">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                            </Link>
                            <div className="flex flex-1 flex-col justify-between p-5 sm:p-8">
                                <div>
                                    <div className="flex items-center gap-x-4 text-xs mb-5">
                                        <time dateTime={post.date} className="text-gray-500 font-medium">
                                            {post.date}
                                        </time>
                                        <span className={`relative z-10 rounded-full px-3 py-1 font-semibold uppercase tracking-wider text-[10px] ${post.category === "Educación" ? "bg-blue-50 text-blue-700" :
                                            post.category === "Políticas Públicas" ? "bg-purple-50 text-purple-700" :
                                                post.category === "Infancia" ? "bg-red-50 text-red-700" :
                                                    "bg-gray-100 text-gray-700"
                                            }`}>
                                            {post.category}
                                        </span>
                                    </div>
                                    <div className="group relative">
                                        <h3 className="mt-3 mb-4 text-xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-red-700 sm:text-2xl font-serif">
                                            <Link href={`${post.basePath}/${post.id}`}>
                                                <span className="absolute inset-0" />
                                                {post.title}
                                            </Link>
                                        </h3>
                                        <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 flex items-center gap-x-4 pt-6 border-t border-gray-100">
                                    {(() => {
                                        const details = getAuthorDetails(post.author);
                                        return (
                                            <>
                                                {details?.image ? (
                                                    <Image src={details.image} alt={post.author} width={40} height={40} className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 text-xs font-bold ring-1 ring-gray-200">
                                                        {post.author.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="text-sm leading-6 flex-1">
                                                    <p className="font-semibold text-gray-900">
                                                        {post.author}
                                                    </p>
                                                    {details?.role && (
                                                        <p className="text-xs text-gray-500 line-clamp-1">{details.role}</p>
                                                    )}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </MotionItem>
                    ))}
                </MotionList>
                {remainingArticles.length === 0 && filteredArticles.length === 0 && (
                    <div className="py-16 text-center">
                        <p className="text-gray-400 text-lg">No hay artículos en esta categoría.</p>
                        <button onClick={() => setActiveCategory("Todas")} className="mt-4 text-red-600 font-semibold hover:underline">
                            Ver todas las columnas
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
