"use client";

import { MotionDiv } from "@/components/ui/Motion";
import { ArrowRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/data";

export function AcademicPublicationsSection({ academic }: { academic: Article[] }) {
    if (!academic || academic.length === 0) return null;

    const featuredArticle = academic[0];

    return (
        <section className="border-b border-[#eee8dc] bg-[#fffdf8] py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 border-b border-[#ded5c7] pb-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">
                            Trabajos Intelectuales
                        </span>
                        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#171713] sm:text-4xl">
                            Artículos Académicos
                        </h2>
                    </div>
                    <p className="max-w-2xl text-sm leading-7 text-[#70695f]">
                        Investigaciones, ensayos y artículos de fondo que profundizan en las tensiones estructurales, la infancia y la institucionalidad.
                    </p>
                </div>

                <div className="mt-12 grid lg:grid-cols-[1fr_1fr] gap-10 items-center">
                    <MotionDiv
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] border border-[#ded5c7] shadow-md"
                    >
                        <Image
                            src={featuredArticle.image || "/images/infancia_estado_hero.jpg"}
                            alt={featuredArticle.imageAlt || featuredArticle.title}
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </MotionDiv>

                    <MotionDiv
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col justify-center"
                    >
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#9f5528] mb-4">
                            <FileText className="h-4 w-4" />
                            {featuredArticle.category}
                        </div>
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-[#171713]">
                            {featuredArticle.title}
                        </h3>
                        <div className="mt-4 flex items-center gap-3">
                            <span className="text-sm font-bold uppercase tracking-widest text-[#70695f]">
                                Autor: {featuredArticle.author}
                            </span>
                            <span className="text-[#ded5c7]">&bull;</span>
                            <span className="text-sm font-semibold text-[#8a8175]">
                                {featuredArticle.date}
                            </span>
                        </div>
                        <p className="mt-6 text-base leading-relaxed text-[#70695f]">
                            {featuredArticle.excerpt}
                        </p>
                        
                        <div className="mt-8">
                            <Link
                                href={`/trabajos-intelectuales/${featuredArticle.id}`}
                                className="group inline-flex items-center justify-center gap-2 rounded-[7px] bg-[#bd6f3c] px-6 py-3.5 text-sm font-bold text-white transition duration-200 hover:bg-[#9f5528]"
                            >
                                Leer Artículo Completo
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </Link>
                        </div>
                    </MotionDiv>
                </div>
            </div>
        </section>
    );
}
