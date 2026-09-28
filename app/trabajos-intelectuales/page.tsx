import { readPublishedArticleCollections } from "@/lib/server/publicArticles";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TypographicCover, displayTitle, toSentenceCase } from "@/components/TypographicCover";

export const metadata = pageMetadata({
    title: "Trabajos Intelectuales",
    description:
        "Artículos académicos e investigaciones publicados por el Centro de Reflexiones Críticas. Trabajos de fondo sobre infancia, institucionalidad y derechos.",
    path: "/trabajos-intelectuales",
});

export default async function TrabajosIntelectualesPage() {
    const { academic } = await readPublishedArticleCollections();

    return (
        <div className="min-h-screen bg-[#f8f5ee] text-[#171713]">
            <header className="border-b border-[#d8cfc0] bg-[#fffdf8]">
                <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
                    <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Investigación del CRC</p>
                    <h1 className="crc-serif mt-3 max-w-[22ch] text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                        Trabajos intelectuales
                    </h1>
                    <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
                        Investigaciones, artículos académicos y ensayos de fondo sobre las tensiones estructurales
                        de la infancia, la institucionalidad y los derechos en América Latina.
                    </p>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
                {academic.length === 0 ? (
                    <p className="text-[1rem] text-[#55574f]">No hay trabajos intelectuales publicados aún.</p>
                ) : (
                    <ol className="border-t border-[#d8cfc0]">
                        {academic.map((article) => {
                            const wordCount = article.content.join(" ").trim().split(/\s+/).filter(Boolean).length;
                            const readingMins = Math.max(5, Math.ceil(wordCount / 200));
                            const href = `/trabajos-intelectuales/${article.id}`;

                            return (
                                <li key={article.id} className="border-b border-[#d8cfc0] py-10">
                                    <article className="grid gap-6 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-10">
                                        <Link
                                            href={href}
                                            tabIndex={-1}
                                            aria-hidden="true"
                                            className="group hidden rounded-[6px] md:block"
                                        >
                                            <TypographicCover
                                                category={article.category}
                                                title={article.title}
                                                date={article.date}
                                                tone="ink"
                                                className="transition-transform duration-200 group-hover:-translate-y-px"
                                            />
                                        </Link>

                                        <div className="flex flex-col">
                                            <p className="text-[0.8125rem] font-semibold text-[#9f5528]">
                                                {toSentenceCase(article.category)}
                                                <span className="font-normal text-[#6f675d]"> · {readingMins} min de lectura</span>
                                            </p>
                                            <h2 className="crc-serif mt-3 text-balance text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.01em] sm:text-[1.6rem]">
                                                <Link href={href} className="hover:underline hover:decoration-[#bd6f3c] hover:underline-offset-4">
                                                    {displayTitle(article.title)}
                                                </Link>
                                            </h2>
                                            <p className="mt-3 text-[0.9375rem] text-[#55574f]">
                                                <span className="font-semibold text-[#171713]">
                                                    {article.authors?.length
                                                        ? article.authors.map((author) => author.name).join(" · ")
                                                        : article.author}
                                                </span>
                                                <span className="tabular-nums"> · {article.date}</span>
                                            </p>
                                            {article.publication ? (
                                                <p className="mt-1 text-[0.875rem] text-[#6f675d]">
                                                    <cite className="not-italic">{article.publication.journal}</cite>,{" "}
                                                    {article.publication.volume} ({article.publication.year})
                                                </p>
                                            ) : null}
                                            <p className="mt-4 max-w-[65ch] text-[1rem] leading-[1.7] text-[#55574f] line-clamp-4">
                                                {article.excerpt}
                                            </p>
                                            <Link
                                                href={href}
                                                className="mt-6 inline-flex items-center gap-2 self-start text-[0.9375rem] font-semibold text-[#9f5528] underline-offset-4 hover:underline"
                                            >
                                                Leer el artículo
                                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                            </Link>
                                        </div>
                                    </article>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </main>
        </div>
    );
}
