"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, User, Calendar, Bookmark, Check, Link as LinkIcon, Facebook, Twitter, Instagram, Menu, X } from "lucide-react";
import { MotionDiv, MotionItem } from "@/components/ui/Motion";
import { motion, AnimatePresence } from "framer-motion";
import { Article } from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterBlock } from "@/components/NewsletterBlock";

// Include WhatsAppIcon, getServiceCTA, getAuthorDetails from original ArticleDetail.tsx...
function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
            <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.83.74 5.49 2.03 7.8L.5 31.5l7.93-2.08A15.44 15.44 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 28.22a13.7 13.7 0 0 1-7-1.92l-.5-.3-5.18 1.36 1.38-5.04-.33-.52A13.72 13.72 0 1 1 16 28.72zm7.52-10.28c-.41-.2-2.43-1.2-2.81-1.33-.37-.14-.64-.2-.91.2-.27.4-1.05 1.33-1.28 1.6-.23.27-.47.3-.88.1-.41-.2-1.73-.64-3.3-2.04-1.22-1.09-2.04-2.43-2.28-2.84-.24-.41-.03-.63.18-.83.18-.18.41-.47.61-.7.2-.23.27-.4.41-.67.14-.27.07-.5-.03-.7-.1-.2-.91-2.2-1.25-3.01-.33-.8-.67-.69-.91-.7h-.78c-.27 0-.7.1-1.07.5-.37.4-1.4 1.37-1.4 3.34s1.43 3.87 1.63 4.14c.2.27 2.82 4.3 6.83 6.03.95.41 1.7.66 2.28.84.96.3 1.83.26 2.52.16.77-.11 2.43-1 2.77-1.96.34-.97.34-1.8.24-1.97-.1-.17-.37-.27-.78-.47z" />
        </svg>
    );
}

const getServiceCTA = (category: string) => {
    return {
        label: "Servicios CRC",
        description: "Atención clínica, consultoría institucional y bienestar escolar con criterio técnico y pensamiento crítico.",
        href: "/servicios",
    };
};

const getAuthorDetails = (author: string) => {
    if (author.includes("Rocío Solar")) return { image: "/images/rocio_solar_real_white.png", role: "Cofundadora & Terapeuta Ocupacional" };
    if (author.includes("Juan Carlos Rauld")) return { image: "/images/juan_carlos_real_white.png", role: "Director Editorial & Consultor en Ciencias Sociales" };
    if (author.includes("Alejandro Castro")) return { image: null, role: "Doctor en Sociología. Académico Departamento Trabajo Social, Universidad Alberto Hurtado." };
    return null;
};

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
    const [copiedUpper, setCopiedUpper] = useState(false);
    const [copiedLower, setCopiedLower] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [mobileTocOpen, setMobileTocOpen] = useState(false);

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

    const handleCopy = async (e: React.MouseEvent, loc: 'upper' | 'lower') => {
        e.preventDefault();
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        if (loc === 'upper') { setCopiedUpper(true); setTimeout(() => setCopiedUpper(false), 2000); }
        else { setCopiedLower(true); setTimeout(() => setCopiedLower(false), 2000); }
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
        let injectedHeader = false;
        headerMapping.forEach(mapping => {
            if (para.includes(mapping.match)) {
                contentNodes.push(
                    <h2 key={`h-${mapping.text}`} id={slugify(mapping.text)} className="mt-14 mb-6 text-2xl font-bold font-serif text-[#171713] scroll-mt-24">
                        {mapping.text}
                    </h2>
                );
                injectedHeader = true;
            }
        });

        // Split "Lo que Foucault enseñó" if needed because it's in the middle of a paragraph
        if (para.includes("Lo que Foucault enseñó") && !para.startsWith("Lo que Foucault enseñó")) {
            const parts = para.split("Lo que Foucault enseñó");
            contentNodes.push(<p key={`p-${i}-a`} className="mb-6 font-serif leading-8 text-[#23241f] text-lg lg:text-xl">{parts[0]}</p>);
            contentNodes.push(
                <h2 key="h-infancia-biopolitica" id={slugify("La infancia como biopolítica")} className="mt-14 mb-6 text-2xl font-bold font-serif text-[#171713] scroll-mt-24">
                    La infancia como biopolítica
                </h2>
            );
            contentNodes.push(<p key={`p-${i}-b`} className="mb-6 font-serif leading-8 text-[#23241f] text-lg lg:text-xl">Lo que Foucault enseñó{parts[1]}</p>);
            return;
        }

        // Check for pull quotes
        pullQuotes.forEach(pq => {
            if (para.includes(pq.match)) {
                contentNodes.push(
                    <blockquote key={`pq-${pq.match}`} className="my-10 pl-6 border-l-4 border-[#d3976d] text-2xl font-serif italic text-[#d3976d] leading-relaxed">
                        {pq.quote}
                    </blockquote>
                );
            }
        });

        // First paragraph drop cap
        if (i === 1) {
            contentNodes.push(
                <p key={`p-${i}`} className="mb-6 font-serif leading-8 text-[#23241f] text-lg lg:text-xl first-letter:text-6xl first-letter:font-bold first-letter:text-[#d3976d] first-letter:mr-3 first-letter:float-left first-letter:mt-1">
                    {para}
                </p>
            );
        } else {
            contentNodes.push(
                <p key={`p-${i}`} className="mb-6 font-serif leading-8 text-[#23241f] text-lg lg:text-xl">
                    {para}
                </p>
            );
        }
    });

    return (
        <article className="min-h-screen bg-[#fffdf8] pb-16">
            {/* Enhanced Hero Section 100vh parallax */}
            <div className="relative h-[100vh] w-full overflow-hidden flex flex-col justify-end">
                <div className="absolute inset-0 z-0">
                    <Image src={article.image} alt={article.title} fill sizes="100vw" className="object-cover object-top" priority />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#171713]/90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171713] via-[#171713]/50 to-transparent" />
                </div>

                <div className="relative z-10 w-full px-4 sm:px-10 lg:px-20 pb-20">
                    <MotionDiv initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="max-w-5xl mx-auto text-white">
                        <Link href="/pensamiento-critico" className="inline-flex items-center text-sm font-medium text-[#d8d0c4] hover:text-white mb-8 transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                        </Link>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-[#d8d0c4] mb-4">
                            <span className="font-semibold text-[#d3976d] uppercase tracking-widest text-xs">{article.category}</span>
                            <span className="opacity-50">|</span>
                            <span>{article.date}</span>
                        </div>
                        
                        <h1 className="mb-6 text-4xl sm:text-5xl lg:text-[4rem] font-bold leading-[1.1] font-serif text-[#fffdf8]">
                            {article.title}
                        </h1>

                        {/* Subtitle Banner */}
                        <div className="mt-8 border-l-2 border-[#d3976d] pl-6 py-2">
                            <p className="text-xl sm:text-2xl font-serif italic text-[#eee8dc]">
                                A 42 años de la muerte de Michel Foucault (1926-1984)
                            </p>
                        </div>
                    </MotionDiv>
                </div>
            </div>

            {/* Layout Container */}
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-12 lg:py-20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    
                    {/* Mobile TOC */}
                    <div className="lg:hidden w-full border-b border-[#eee8dc] pb-4 mb-8">
                        <button onClick={() => setMobileTocOpen(!mobileTocOpen)} className="flex items-center justify-between w-full font-serif font-bold text-lg text-[#171713]">
                            Índice de contenidos
                            {mobileTocOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                        <AnimatePresence>
                            {mobileTocOpen && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <ul className="pt-4 space-y-3">
                                        {TOC_SECTIONS.map(section => (
                                            <li key={section}>
                                                <a href={`#${slugify(section)}`} onClick={() => setMobileTocOpen(false)} className={`block text-sm font-serif transition-colors ${activeSection === slugify(section) ? 'text-[#d3976d] font-bold' : 'text-[#70695f] hover:text-[#171713]'}`}>
                                                    {section}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Desktop TOC Sticky Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[#70695f] mb-6">Contenido</h4>
                            <ul className="space-y-4 border-l border-[#eee8dc]">
                                {TOC_SECTIONS.map(section => {
                                    const slug = slugify(section);
                                    const isActive = activeSection === slug;
                                    return (
                                        <li key={slug} className="relative">
                                            {isActive && (
                                                <motion.div layoutId="tocIndicator" className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-[#d3976d]" />
                                            )}
                                            <a href={`#${slug}`} className={`block pl-4 text-sm font-serif transition-colors ${isActive ? 'text-[#171713] font-bold' : 'text-[#70695f] hover:text-[#171713]'}`}>
                                                {section}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Share floating */}
                            <div className="mt-12 pt-8 border-t border-[#eee8dc]">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#70695f] mb-4 block">Compartir</span>
                                <div className="flex gap-2">
                                    <button onClick={(e) => handleCopy(e, 'upper')} className="p-2 rounded-full border border-[#ded5c7] text-[#70695f] hover:text-[#d3976d] hover:border-[#d3976d] transition-all">
                                        {copiedUpper ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 max-w-3xl">
                        {/* Excerpt */}
                        <p className="text-xl lg:text-2xl font-serif italic leading-relaxed text-[#70695f] mb-12 pb-12 border-b border-[#eee8dc]">
                            {article.excerpt}
                        </p>

                        {/* Article Body */}
                        <div className="prose prose-stone max-w-none">
                            {contentNodes}
                        </div>

                        {/* Share & Author Block */}
                        <div className="mt-20 pt-10 border-t border-[#eee8dc]">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-[#f8f5ee] p-8 rounded-xl border border-[#ded5c7]">
                                <div className="flex items-center gap-6">
                                    <Image src="/images/juan_carlos_real_white.png" alt={article.author} width={80} height={80} className="rounded-full ring-4 ring-white object-cover" />
                                    <div>
                                        <h3 className="font-bold font-serif text-xl text-[#171713] mb-1">{article.author}</h3>
                                        <p className="text-sm text-[#70695f] max-w-sm">Doctorando Internacional en Trabajo Social, URV. Magíster en pensamiento contemporáneo en filosofía política. Director Editorial CRC.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="mt-16">
                            <NewsletterBlock origen={article.category} />
                        </div>
                    </div>
                </div>
            </div>
            <JsonLd article={article} />
        </article>
    );
}
