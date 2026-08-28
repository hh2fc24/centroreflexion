import { readPublishedArticleCollections } from "@/lib/server/publicArticles";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, GraduationCap } from "lucide-react";

export const metadata = pageMetadata({
    title: "Trabajos Intelectuales",
    description:
        "Artículos académicos e investigaciones publicados por el Centro de Reflexiones Críticas. Trabajos de fondo sobre infancia, institucionalidad y derechos.",
    path: "/trabajos-intelectuales",
});

export default async function TrabajosIntelectualesPage() {
    const { academic } = await readPublishedArticleCollections();

    return (
        <div className="min-h-screen bg-[#fffdf8]">
            {/* Header */}
            <section className="border-b border-[#ded5c7] bg-[#fffdf8]">
                <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24 text-center">
                    <div className="inline-flex items-center gap-2 rounded-[5px] border border-[#ead8c7] bg-[#f8f5ee] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9f5528]">
                        <GraduationCap className="h-3.5 w-3.5" />
                        Centro de Reflexiones Críticas
                    </div>
                    <h1 className="mt-8 font-serif text-4xl font-bold leading-tight text-[#171713] sm:text-5xl lg:text-6xl">
                        Trabajos Intelectuales
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#70695f] sm:text-lg">
                        Investigaciones, artículos académicos y ensayos de fondo que profundizan en
                        las tensiones estructurales de la infancia, la institucionalidad y los
                        derechos en América Latina.
                    </p>
                </div>
            </section>

            {/* Articles listing */}
            <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
                {academic.length === 0 ? (
                    <p className="text-center text-[#70695f]">
                        No hay trabajos intelectuales publicados aún.
                    </p>
                ) : (
                    <div className="space-y-12">
                        {academic.map((article) => {
                            const wordCount = article.content
                                .join(" ")
                                .trim()
                                .split(/\s+/)
                                .filter(Boolean).length;
                            const readingMins = Math.max(5, Math.ceil(wordCount / 200));

                            return (
                                <article
                                    key={article.id}
                                    className="group rounded-[8px] border border-[#ded5c7] bg-[#fffdf8] shadow-sm transition hover:border-[#bd6f3c]/40 hover:shadow-md"
                                >
                                    <div className="grid lg:grid-cols-[380px_1fr] gap-0">
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden rounded-t-[8px] lg:rounded-l-[8px] lg:rounded-tr-none">
                                            <Image
                                                src={article.image || "/images/infancia_estado_hero.jpg"}
                                                alt={article.imageAlt || article.title}
                                                fill
                                                sizes="(min-width: 1024px) 380px, 100vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                                            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9f5528]">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <FileText className="h-3.5 w-3.5" />
                                                    {article.category}
                                                </span>
                                                <span className="text-[#ded5c7]">·</span>
                                                <span className="text-[#8a8175]">
                                                    {readingMins} min lectura
                                                </span>
                                            </div>

                                            <h2 className="mt-4 font-serif text-xl sm:text-2xl font-bold leading-tight text-[#171713]">
                                                {article.title}
                                            </h2>

                                            <div className="mt-3 flex items-center gap-2 text-sm text-[#70695f]">
                                                <span className="font-semibold text-[#171713]">
                                                    {article.author}
                                                </span>
                                                <span className="text-[#ded5c7]">·</span>
                                                <span>{article.date}</span>
                                            </div>

                                            <p className="mt-5 text-sm leading-7 text-[#70695f] line-clamp-3">
                                                {article.excerpt}
                                            </p>

                                            <div className="mt-6">
                                                <Link
                                                    href={`/trabajos-intelectuales/${article.id}`}
                                                    className="group/btn inline-flex items-center gap-2 rounded-[6px] bg-[#171713] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#34362f]"
                                                >
                                                    Leer artículo completo
                                                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
