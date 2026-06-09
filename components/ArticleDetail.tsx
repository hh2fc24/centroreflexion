"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, User, Calendar, Share2, Bookmark, Check, Link as LinkIcon, MessageCircle, Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MotionDiv, MotionItem } from "@/components/ui/Motion";
import { motion, AnimatePresence } from "framer-motion";
import { Article } from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterBlock } from "@/components/NewsletterBlock";

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
            <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.83.74 5.49 2.03 7.8L.5 31.5l7.93-2.08A15.44 15.44 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 28.22a13.7 13.7 0 0 1-7-1.92l-.5-.3-5.18 1.36 1.38-5.04-.33-.52A13.72 13.72 0 1 1 16 28.72zm7.52-10.28c-.41-.2-2.43-1.2-2.81-1.33-.37-.14-.64-.2-.91.2-.27.4-1.05 1.33-1.28 1.6-.23.27-.47.3-.88.1-.41-.2-1.73-.64-3.3-2.04-1.22-1.09-2.04-2.43-2.28-2.84-.24-.41-.03-.63.18-.83.18-.18.41-.47.61-.7.2-.23.27-.4.41-.67.14-.27.07-.5-.03-.7-.1-.2-.91-2.2-1.25-3.01-.33-.8-.67-.69-.91-.7h-.78c-.27 0-.7.1-1.07.5-.37.4-1.4 1.37-1.4 3.34s1.43 3.87 1.63 4.14c.2.27 2.82 4.3 6.83 6.03.95.41 1.7.66 2.28.84.96.3 1.83.26 2.52.16.77-.11 2.43-1 2.77-1.96.34-.97.34-1.8.24-1.97-.1-.17-.37-.27-.78-.47z" />
        </svg>
    );
}

const getServiceCTA = (category: string): { label: string; description: string; href: string } => {
    const cat = category.toLowerCase();
    if (cat.includes("salud mental") || cat.includes("infancia") || cat.includes("niñez") || cat.includes("adiccion") || cat.includes("adicción")) {
        return {
            label: "Atención clínica",
            description: "Evaluación, intervención y acompañamiento especializado en salud mental e infancia.",
            href: "/servicios/clinica",
        };
    }
    if (cat.includes("escuela") || cat.includes("educacion") || cat.includes("educación") || cat.includes("escolar") || cat.includes("colegio")) {
        return {
            label: "Bienestar escolar",
            description: "Soporte interdisciplinario para convivencia, salud mental y protección institucional.",
            href: "/servicios/bienestar-escolar",
        };
    }
    if (cat.includes("institucion") || cat.includes("institución") || cat.includes("política") || cat.includes("politica") || cat.includes("sociedad")) {
        return {
            label: "Consultoría institucional",
            description: "Diseño y mejora de modelos de intervención para organizaciones que trabajan con problemas complejos.",
            href: "/servicios/consultoria",
        };
    }
    return {
        label: "Servicios CRC",
        description: "Atención clínica, consultoría institucional y bienestar escolar con criterio técnico y pensamiento crítico.",
        href: "/servicios",
    };
};

const getAuthorDetails = (author: string) => {
    if (author.includes("Rocío Solar")) {
        return { image: "/images/rocio_solar_real_white.png", role: "Co-fundadora & Terapeuta Ocupacional" };
    }
    if (author.includes("Juan Carlos Rauld")) {
        return { image: "/images/juan_carlos_real_white.png", role: "Director Editorial & Consultor en Ciencias Sociales" };
    }
    return null;
};

interface ArticleDetailProps {
    article: Article;
    backHref?: string;
    backLabel?: string;
}

export default function ArticleDetail({
    article,
    backHref = "/pensamiento-critico",
    backLabel = "Volver a Pensamiento Crítico",
}: ArticleDetailProps) {
    const [copiedUpper, setCopiedUpper] = useState(false);
    const [copiedLower, setCopiedLower] = useState(false);
    const [copiedInstagramUpper, setCopiedInstagramUpper] = useState(false);
    const [copiedInstagramLower, setCopiedInstagramLower] = useState(false);

    const handleCopy = async (e: React.MouseEvent, location: 'upper' | 'lower') => {
        e.preventDefault();
        e.stopPropagation();
        const url = typeof window !== "undefined" ? window.location.href : "";
        try {
            await navigator.clipboard.writeText(url);
            if (location === 'upper') {
                setCopiedUpper(true);
                setTimeout(() => setCopiedUpper(false), 2000);
            } else {
                setCopiedLower(true);
                setTimeout(() => setCopiedLower(false), 2000);
            }
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleInstagramCopy = async (e: React.MouseEvent, location: 'upper' | 'lower') => {
        e.preventDefault();
        e.stopPropagation();
        const url = typeof window !== "undefined" ? window.location.href : "";
        try {
            await navigator.clipboard.writeText(url);
            if (location === 'upper') {
                setCopiedInstagramUpper(true);
                setTimeout(() => setCopiedInstagramUpper(false), 2000);
            } else {
                setCopiedInstagramLower(true);
                setTimeout(() => setCopiedInstagramLower(false), 2000);
            }
        } catch (err) {
            console.error("Failed to copy for Instagram:", err);
        }
    };

    return (
        <article className="min-h-screen bg-[#fffdf8] pb-16 sm:pb-24">
            {/* Hero Image */}
            <div className="relative h-[42vh] min-h-[320px] w-full sm:h-[50vh] sm:min-h-[400px]">
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-10 lg:p-20">
                    <MotionDiv className="max-w-4xl mx-auto text-white">
                        <Link
                            href={backHref}
                            className="inline-flex items-center text-sm font-medium text-[#d8d0c4] hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> {backLabel}
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-3 py-1 rounded-full bg-[#bd6f3c]/90 text-xs font-bold uppercase tracking-wider">
                                {article.category}
                            </span>
                        </div>
                        <h1 className="mb-4 text-3xl font-bold leading-tight sm:mb-6 sm:text-4xl lg:text-4xl font-serif">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base text-[#eee8dc]">
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const details = getAuthorDetails(article.author);
                                    return (
                                        <>
                                            {details?.image ? (
                                                <Image src={details.image} alt={article.author} width={24} height={24} className="h-6 w-6 rounded-full object-cover ring-1 ring-white/50" />
                                            ) : (
                                                <User className="h-4 w-4" />
                                            )}
                                            <span className="font-semibold">{article.author}</span>
                                        </>
                                    );
                                })()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{article.date}</span>
                            </div>
                        </div>
                    </MotionDiv>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-20">

                {/* Social Share & Actions */}
                <div className="mb-10 flex flex-col gap-6 border-b border-[#eee8dc] pb-8 sm:mb-12 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-lg font-serif italic leading-relaxed text-[#70695f] sm:text-xl">
                        {article.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Guardar */}
                        <button
                            aria-label="Guardar"
                            className="p-2 rounded-full border border-[#ded5c7] bg-[#fffdf8] text-[#8a8276] hover:text-[#171713] hover:bg-[#f8f5ee] transition-all duration-200 mr-1"
                        >
                            <Bookmark className="h-4 w-4" />
                        </button>

                        {/* WhatsApp */}
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#20ba5a] hover:shadow-md transition-all duration-200"
                        >
                            <WhatsAppIcon className="h-4 w-4 fill-white" />
                            <span>WhatsApp</span>
                        </a>

                        {/* Instagram */}
                        <div className="relative">
                            <button
                                onClick={(e) => handleInstagramCopy(e, 'upper')}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-xs font-sans font-bold uppercase tracking-wider hover:brightness-105 hover:shadow-md transition-all duration-200"
                            >
                                <Instagram className="h-4 w-4" />
                                <span>Instagram</span>
                            </button>
                            <AnimatePresence>
                                {copiedInstagramUpper && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 whitespace-nowrap bg-[#171713] text-white text-[10px] font-sans font-semibold py-1.5 px-3 rounded-[4px] shadow-lg border border-white/10"
                                    >
                                        ¡Copiado! Pégalo en tu Historia
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[4px] border-4 border-transparent border-t-[#171713]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Copiar enlace */}
                        <div className="relative">
                            <button
                                onClick={(e) => handleCopy(e, 'upper')}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[#ded5c7] bg-[#fffdf8] text-[#171713] text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#f8f5ee] transition-all duration-200"
                            >
                                {copiedUpper ? <Check className="h-4 w-4 text-[#25D366]" /> : <LinkIcon className="h-4 w-4 text-[#8a8276]" />}
                                <span>{copiedUpper ? "Copiado" : "Enlace"}</span>
                            </button>
                            <AnimatePresence>
                                {copiedUpper && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 whitespace-nowrap bg-[#171713] text-white text-[10px] font-sans font-semibold py-1.5 px-3 rounded-[4px] shadow-lg border border-white/10"
                                    >
                                        ¡Enlace copiado!
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[4px] border-4 border-transparent border-t-[#171713]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <MotionDiv transition={{ delay: 0.2 }}>
                    <div className="prose prose-stone max-w-none font-serif leading-8 text-[#23241f] prose-headings:font-serif prose-a:text-[#bd6f3c] hover:prose-a:text-[#bd6f3c] sm:prose-lg">
                        {article.content.map((paragraph, index, arr) => {
                            const isReferenceHeader = paragraph.toLowerCase().startsWith("referencias integradas") || paragraph.toLowerCase().startsWith("referencias bibliográficas");
                            const refHeaderIndex = arr.findIndex(p => p.toLowerCase().startsWith("referencias integradas") || p.toLowerCase().startsWith("referencias bibliográficas"));
                            
                            const isReference = refHeaderIndex !== -1 && index > refHeaderIndex;

                            if (isReferenceHeader) {
                                return (
                                    <h3 key={index} className="text-lg font-bold mt-12 mb-6 text-[#171713] border-b pb-2">
                                        Referencias
                                    </h3>
                                );
                            }

                            if (isReference) {
                                // Clean up bullet points if they exist
                                const cleanRef = paragraph.replace(/^•\s*/, '');
                                return (
                                    <p key={index} className="pl-6 -indent-6 mb-3 text-sm text-[#70695f] leading-relaxed font-serif italic">
                                        {cleanRef}
                                    </p>
                                );
                            }

                            return (
                                <p key={index} className="mb-6 first-letter:text-4xl first-letter:font-bold first-letter:text-[#171713] first-letter:mr-3 first-letter:float-left">
                                    {paragraph}
                                </p>
                            );
                        })}
                    </div>
                </MotionDiv>

                {/* Share Section at the bottom */}
                <div className="my-12 py-6 border-t border-b border-[#eee8dc] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span className="text-sm font-serif font-bold text-[#70695f]">¿Te pareció interesante? Comparte esta columna:</span>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* WhatsApp */}
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#20ba5a] hover:shadow-md transition-all duration-200"
                        >
                            <WhatsAppIcon className="h-4 w-4 fill-white" />
                            <span>WhatsApp</span>
                        </a>

                        {/* Instagram */}
                        <div className="relative">
                            <button
                                onClick={(e) => handleInstagramCopy(e, 'lower')}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-xs font-sans font-bold uppercase tracking-wider hover:brightness-105 hover:shadow-md transition-all duration-200"
                            >
                                <Instagram className="h-4 w-4" />
                                <span>Instagram</span>
                            </button>
                            <AnimatePresence>
                                {copiedInstagramLower && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 whitespace-nowrap bg-[#171713] text-white text-[10px] font-sans font-semibold py-1.5 px-3 rounded-[4px] shadow-lg border border-white/10"
                                    >
                                        ¡Copiado! Pégalo en tu Historia
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[4px] border-4 border-transparent border-t-[#171713]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Copiar enlace */}
                        <div className="relative">
                            <button
                                onClick={(e) => handleCopy(e, 'lower')}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[#ded5c7] bg-[#fffdf8] text-[#171713] text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#f8f5ee] transition-all duration-200"
                            >
                                {copiedLower ? <Check className="h-4 w-4 text-[#25D366]" /> : <LinkIcon className="h-4 w-4 text-[#8a8276]" />}
                                <span>{copiedLower ? "Copiado" : "Copiar enlace"}</span>
                            </button>
                            <AnimatePresence>
                                {copiedLower && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 whitespace-nowrap bg-[#171713] text-white text-[10px] font-sans font-semibold py-1.5 px-3 rounded-[4px] shadow-lg border border-white/10"
                                    >
                                        ¡Enlace copiado!
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[4px] border-4 border-transparent border-t-[#171713]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Newsletter capture */}
                <NewsletterBlock origen={article.category} />

                {/* Author Bio / Footer */}
                <div className="mt-16 pt-10 border-t border-[#eee8dc]">
                    <div className="flex flex-col items-start gap-4 rounded-[6px] bg-[#f8f5ee] p-5 sm:flex-row sm:items-center sm:p-6">
                        {(() => {
                            const details = getAuthorDetails(article.author);
                            return (
                                <>
                                    {details?.image ? (
                                        <Image src={details.image} alt={article.author} width={64} height={64} className="h-16 w-16 rounded-full object-cover ring-2 ring-[#ded5c7]" />
                                    ) : (
                                        <div className="h-16 w-16 rounded-full bg-[#ded5c7] flex items-center justify-center text-xl font-bold text-[#70695f]">
                                            {article.author.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-[#171713]">Escrito por {article.author}</h3>
                                        <p className="text-sm text-[#70695f]">
                                            {details?.role || "Analista y colaborador en Centro de Reflexiones Críticas."}
                                        </p>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* CTA contextual */}
                {(() => {
                    const cta = getServiceCTA(article.category);
                    return (
                        <MotionItem className="mt-16 rounded-[8px] bg-[#171713] p-6 text-white shadow-md sm:mt-20 sm:p-10">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d3976d]">Servicio relacionado</span>
                            <h3 className="mt-3 text-2xl font-bold font-serif">{cta.label}</h3>
                            <p className="mt-3 text-sm leading-7 text-[#d8d0c4]">{cta.description}</p>
                            <Link href={cta.href} className="mt-6 inline-flex items-center gap-2 rounded-[5px] bg-[#bd6f3c] px-5 py-3 text-sm font-bold text-white hover:bg-[#9f5528]">
                                Conocer servicio
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </MotionItem>
                    );
                })()}

                <JsonLd article={article} />

            </div>
        </article>
    );
}
