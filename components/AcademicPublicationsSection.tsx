import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Article } from "@/lib/data";
import { TypographicCover, displayTitle } from "@/components/TypographicCover";

export function AcademicPublicationsSection({ academic }: { academic: Article[] }) {
    if (!academic || academic.length === 0) return null;

    const featuredArticle = academic[0];
    const href = `/trabajos-intelectuales/${featuredArticle.id}`;

    return (
        <section aria-labelledby="academicos-titulo" className="border-b border-[#d8cfc0] bg-[#fffdf8] py-14 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-8">
                <div className="flex flex-col gap-4 border-b border-[#d8cfc0] pb-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Trabajos intelectuales</p>
                        <h2
                            id="academicos-titulo"
                            className="crc-serif mt-2 text-[clamp(1.6rem,2.3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-[#171713]"
                        >
                            Artículos académicos
                        </h2>
                    </div>
                    <p className="max-w-[52ch] text-[0.9375rem] leading-[1.7] text-[#55574f]">
                        Investigaciones y artículos de fondo sobre infancia, institucionalidad y derechos.
                    </p>
                </div>

                <div className="mt-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    <Link href={href} tabIndex={-1} aria-hidden="true" className="group block rounded-[6px]">
                        <TypographicCover
                            category={featuredArticle.category}
                            title={featuredArticle.title}
                            date={featuredArticle.date}
                            tone="ink"
                            className="transition-transform duration-200 group-hover:-translate-y-px"
                        />
                    </Link>

                    <div>
                        <h3 className="crc-serif text-balance text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.01em] text-[#171713] sm:text-[1.6rem]">
                            <Link href={href} className="hover:underline hover:decoration-[#bd6f3c] hover:underline-offset-4">
                                {displayTitle(featuredArticle.title)}
                            </Link>
                        </h3>
                        <p className="mt-3 text-[0.9375rem] text-[#55574f]">
                            <span className="font-semibold text-[#171713]">{featuredArticle.author}</span>
                            <span className="tabular-nums"> · {featuredArticle.date}</span>
                        </p>
                        <p className="mt-4 max-w-[62ch] text-[1rem] leading-[1.7] text-[#55574f]">{featuredArticle.excerpt}</p>
                        <Link
                            href={href}
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] sm:w-auto"
                        >
                            Leer el artículo
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
