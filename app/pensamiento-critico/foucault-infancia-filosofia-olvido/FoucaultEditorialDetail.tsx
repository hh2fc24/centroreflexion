"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Link as LinkIcon } from "lucide-react";
import { Article } from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { ColumnCta } from "@/components/ColumnCta";
import { EditorialHero } from "@/components/TypographicCover";

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const TOC_SECTIONS = [
  "La herencia biopolítica",
  "La infancia olvidada",
  "Biopolítica y desprotección",
  "¿Puede un niño ejercer la biopoética?",
  "Cifras y racionalidades de gobierno",
  "La infancia como biopolítica",
  "La categoría biopolítica de infancia pobre",
  "Foucault el artificiero"
];

export default function FoucaultEditorialDetail({ article }: { article: Article }) {
    const [copied, setCopied] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { rootMargin: "-10% 0px -80% 0px" });

        TOC_SECTIONS.forEach(section => {
            const el = document.getElementById(slugify(section));
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    // Transform content
    const contentNodes: React.ReactNode[] = [];
    
    // We'll insert headers before specific keywords
    const headerMapping = [
        { text: "La herencia biopolítica", match: "Entre sus principales legados" },
        { text: "La infancia olvidada", match: "Foucault dejó inconcluso" },
        { text: "Biopolítica y desprotección", match: "Pese a la omisión" },
        { text: "¿Puede un niño ejercer la biopoética?", match: "En sus últimos cursos" },
        { text: "Cifras y racionalidades de gobierno", match: "Basta mirar las cifras" },
        { text: "La infancia como biopolítica", match: "Lo que Foucault enseñó" },
        { text: "La categoría biopolítica de infancia pobre", match: "La herencia de la filosofía política" },
        { text: "Foucault el artificiero", match: "A cuarenta y dos años de su muerte" }
    ];

    const pullQuotes = [
        { match: "Entre sus principales legados", quote: "La filosofía, después de Foucault, dejó de ser una actividad contemplativa para convertirse en un diagnóstico del presente." },
        { match: "Basta mirar las cifras", quote: "La verdadera brutalidad reside en el sometimiento de una población que está inexorablemente subordinada a las lógicas del poder sin capacidad alguna de contestación." },
        { match: "La herencia de la filosofía política", quote: "Toda política de infancia es una biopolítica." }
    ];

    article.content.forEach((para, i) => {
        if (i === 0 && para.includes("A 42 años")) return; // Subtitle handled separately
        if (para.includes("Juan Carlos Rauld Farias")) return; // Author handled separately

        // Check for headers
        headerMapping.forEach(mapping => {
            if (para.includes(mapping.match)) {
                contentNodes.push(
                    <h2 key={`h-${mapping.text}`} id={slugify(mapping.text)} className="mt-14 mb-5 crc-serif text-[clamp(1.6rem,2.3vw,2.1rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-[#171713] scroll-mt-24">
                        {mapping.text}
                    </h2>
                );
            }
        });

        // Split "Lo que Foucault enseñó" if needed because it's in the middle of a paragraph
        if (para.includes("Lo que Foucault enseñó") && !para.startsWith("Lo que Foucault enseñó")) {
            const parts = para.split("Lo que Foucault enseñó");
            contentNodes.push(<p key={`p-${i}-a`} className="mb-6">{parts[0]}</p>);
            contentNodes.push(
                <h2 key="h-infancia-biopolitica" id={slugify("La infancia como biopolítica")} className="mt-14 mb-5 crc-serif text-[clamp(1.6rem,2.3vw,2.1rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-[#171713] scroll-mt-24">
                    La infancia como biopolítica
                </h2>
            );
            contentNodes.push(<p key={`p-${i}-b`} className="mb-6">Lo que Foucault enseñó{parts[1]}</p>);
            return;
        }

        // Check for pull quotes
        pullQuotes.forEach(pq => {
            if (para.includes(pq.match)) {
                contentNodes.push(
                    <blockquote key={`pq-${pq.match}`} className="my-10 border-l-2 border-[#bd6f3c] pl-6 text-[1.35rem] font-semibold leading-[1.35] text-[#171713] sm:text-[1.5rem]">
                        {pq.quote}
                    </blockquote>
                );
            }
        });

        contentNodes.push(
            <p key={`p-${i}`} className="mb-6">
                {para}
            </p>
        );
    });

    return (
        <article className="min-h-screen bg-[#fffdf8] pb-16 sm:pb-24">
            <EditorialHero
                titleAs="h1"
                image={article.image}
                imageAlt={article.imageAlt}
                imageCaption={article.imageCaption}
                imageContainerClassName="max-w-6xl"
                category={article.category}
                title={article.title}
                date={article.date}
                dek="A 42 años de la muerte de Michel Foucault (1926-1984)"
                tone="ink"
                containerClassName="max-w-6xl"
            >
                <Link
                    href="/pensamiento-critico"
                    className="mt-10 inline-flex items-center gap-2 text-[0.9375rem] font-semibold underline-offset-4 opacity-90 hover:underline hover:opacity-100"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Pensamiento Crítico
                </Link>
            </EditorialHero>

            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 lg:py-14">
                <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
                    {/* Índice en móvil: details nativo, sin animación */}
                    <details className="rounded-[6px] border border-[#d8cfc0] px-4 py-3 lg:hidden">
                        <summary className="cursor-pointer text-[0.9375rem] font-semibold text-[#171713]">
                            Contenido de la columna
                        </summary>
                        <ul className="mt-3 space-y-2.5">
                            {TOC_SECTIONS.map(section => (
                                <li key={section}>
                                    <a href={`#${slugify(section)}`} className="text-[0.9375rem] text-[#55574f] hover:text-[#9f5528]">
                                        {section}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </details>

                    {/* Índice fijo en escritorio */}
                    <aside className="hidden w-60 shrink-0 lg:block">
                        <div className="sticky top-24">
                            <p className="mb-4 text-[0.8125rem] font-semibold text-[#9f5528]">Contenido</p>
                            <ul className="space-y-3 border-l border-[#d8cfc0]">
                                {TOC_SECTIONS.map(section => {
                                    const slug = slugify(section);
                                    const isActive = activeSection === slug;
                                    return (
                                        <li key={slug}>
                                            <a
                                                href={`#${slug}`}
                                                aria-current={isActive ? "location" : undefined}
                                                className={`-ml-px block border-l-2 pl-4 text-[0.9375rem] leading-[1.4] transition-colors ${isActive ? "border-[#bd6f3c] font-semibold text-[#171713]" : "border-transparent text-[#55574f] hover:text-[#171713]"}`}
                                            >
                                                {section}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="mt-10 inline-flex items-center gap-2 rounded-[6px] border border-[#d8cfc0] px-3 py-2 text-[0.875rem] font-semibold text-[#55574f] transition-colors hover:border-[#9f5528] hover:text-[#9f5528]"
                            >
                                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <LinkIcon className="h-4 w-4" aria-hidden="true" />}
                                {copied ? "Enlace copiado" : "Copiar enlace"}
                            </button>
                        </div>
                    </aside>

                    <div className="min-w-0 flex-1">
                        {/* Firma */}
                        <div className="flex max-w-[65ch] items-center gap-3 border-b border-[#d8cfc0] pb-6">
                            <Image src="/images/juan_carlos_real_white.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full bg-[#eee8dc] object-cover" />
                            <div>
                                <p className="text-[0.9375rem] font-semibold text-[#171713]">{article.author}</p>
                                <p className="text-[0.875rem] tabular-nums text-[#6f675d]">{article.date}</p>
                            </div>
                        </div>

                        <p className="mt-8 max-w-[40rem] text-[1.125rem] leading-[1.6] text-[#55574f]">
                            {article.excerpt}
                        </p>

                        {/* Cuerpo: Source Serif 4, ~65 caracteres, interlineado 1.7 */}
                        <div className="crc-serif mt-8 max-w-[65ch] text-[1.0625rem] leading-[1.7] text-[#171713] sm:text-[1.125rem]">
                            {contentNodes}
                        </div>

                        <div className="mt-14 max-w-[65ch]">
                            <div className="flex items-start gap-4 border-t border-[#d8cfc0] pt-8">
                                <Image src="/images/juan_carlos_real_white.png" alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-full bg-[#eee8dc] object-cover" />
                                <div>
                                    <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Escrito por</p>
                                    <h2 className="crc-serif mt-1 text-[1.35rem] font-semibold leading-[1.2] text-[#171713]">{article.author}</h2>
                                    <p className="mt-2 text-[0.9375rem] leading-[1.6] text-[#55574f]">Doctorando Internacional en Trabajo Social, URV. Magíster en Pensamiento Contemporáneo en Filosofía Política. Director Editorial del CRC.</p>
                                </div>
                            </div>

                            {/* Oferta ligada al tema, antes de la suscripción */}
                            <ColumnCta category={article.category} title={article.title} />

                            <NewsletterBlock origen={article.category} />
                        </div>
                    </div>
                </div>
            </div>
            <JsonLd article={article} />
        </article>
    );
}
