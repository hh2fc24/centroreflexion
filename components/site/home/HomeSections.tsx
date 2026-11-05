"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type RefObject } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Compass, ShieldCheck, Sparkles, LineChart, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { books } from "@/lib/books";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Secciones comerciales de la portada. Único movimiento: una aparición sutil
 * (opacidad y 12px) la primera vez que cada bloque entra en pantalla, solo si
 * la persona no pidió reducir el movimiento. Sin JS el contenido se ve completo.
 * Ver docs/design-system-crc.md §5.
 */
function useReveal(root: RefObject<HTMLElement | null>) {
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
                    gsap.from(el, {
                        y: 12,
                        opacity: 0,
                        duration: 0.55,
                        ease: "power2.out",
                        scrollTrigger: { trigger: el, start: "top 90%", once: true },
                    });
                });
            });
            return () => mm.revert();
        },
        { scope: root }
    );
}

const LABEL = "text-[0.8125rem] font-semibold text-[#9f5528]";
const H2 = "crc-serif text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-balance";

/* ------------------------------------------------------------------ */
/* Tres puertas                                                        */
/* ------------------------------------------------------------------ */

const AUDIENCE_DOORS = [
    {
        who: "Colegios, programas y fundaciones",
        title: "Instituciones",
        text: "Compliance escolar ante la Ley 21.809, formación para equipos y consultoría de programas. Diagnóstico, propuesta, implementación y medición, con una persona a cargo.",
        cta: "Trabajar con el CRC",
        href: "/instituciones",
        image: "/images/interes-superior-tecnocracia-juridica-editorial.jpg",
    },
    {
        who: "Duplas, equipos y docentes",
        title: "Profesionales",
        text: "Cursos de la Academia, supervisión y seminarios con Juan Carlos Rauld para leer los casos con otro marco.",
        cta: "Ver formación",
        href: "/academia",
        image: "/images/juan-carlos-rauld-furia-del-libro.jpg",
    },
    {
        who: "Cuando algo en casa no está bien",
        title: "Familias",
        text: "Acompañamiento familiar y atención clínica en salud mental infanto-juvenil, con respaldo técnico y trato cercano.",
        cta: "Pedir orientación",
        href: "/servicios/acompanamiento-familiar",
        image: "/images/escuchar_infancia_real.png",
    },
];

export function HomeAudienceDoors() {
    const root = useRef<HTMLElement>(null);
    useReveal(root);

    return (
        <section ref={root} aria-labelledby="home-puertas-title" className="border-b border-[#d8cfc0] bg-[#f8f5ee]">
            <div className="mx-auto grid max-w-[1640px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-12 lg:gap-14 lg:px-14 xl:px-20">
                <div data-reveal="" className="lg:col-span-4">
                    <p className={LABEL}>Por dónde empezar</p>
                    <h2 id="home-puertas-title" className={`${H2} mt-3 max-w-[16ch] text-[#171713]`}>
                        Tres maneras de trabajar con el CRC
                    </h2>
                    <p className="mt-5 max-w-[42ch] text-[1rem] leading-[1.7] text-[#55574f]">
                        Cada público tiene su puerta y su siguiente paso. Elige la tuya y te llevamos directo a lo que necesitas.
                    </p>
                </div>

                <ul className="border-b border-[#d8cfc0] lg:col-span-8">
                    {AUDIENCE_DOORS.map((door, i) => (
                        <li key={door.title} data-reveal="" className="border-t border-[#d8cfc0]">
                            <Link
                                href={door.href}
                                className="group grid gap-x-8 gap-y-4 py-7 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f5ee] sm:grid-cols-[2.5rem_minmax(0,1fr)_200px] sm:items-start sm:py-9 xl:grid-cols-[3rem_minmax(0,1fr)_240px]"
                            >
                                <span className="text-[0.875rem] font-semibold tabular-nums text-[#6f675d] sm:pt-0.5">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="block">
                                    <span className="block text-[0.8125rem] font-semibold text-[#6f675d]">{door.who}</span>
                                    <span className="crc-serif mt-1.5 block text-[1.6rem] font-medium leading-[1.15] text-[#171713] transition-colors group-hover:text-[#9f5528]">
                                        {door.title}
                                    </span>
                                    <span className="mt-3 block max-w-[60ch] text-[1rem] leading-[1.7] text-[#55574f]">{door.text}</span>
                                    <span className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[#9f5528]">
                                        {door.cta}
                                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                                    </span>
                                </span>
                                <span className="relative order-first block aspect-[16/9] overflow-hidden rounded-[6px] bg-[#eee8dc] sm:order-none sm:aspect-[4/3]">
                                    <Image
                                        src={door.image}
                                        alt=""
                                        fill
                                        sizes="(max-width: 640px) 100vw, 240px"
                                        className="object-cover object-center"
                                    />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Manifiesto                                                          */
/* ------------------------------------------------------------------ */

export function HomeManifesto() {
    const root = useRef<HTMLElement>(null);
    useReveal(root);

    return (
        <section ref={root} aria-label="Pensamiento crítico" className="bg-[#15120e] text-[#fbf7ee]">
            <div className="mx-auto max-w-[1640px] px-5 py-16 sm:px-8 sm:py-24 lg:px-14 xl:px-20">
                <p data-reveal="" className="mb-6 text-[0.8125rem] font-semibold text-[#e4935d]">Pensamiento crítico</p>
                <p data-reveal="" className="crc-serif max-w-[40ch] text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.25] tracking-[-0.01em] text-balance">
                    Un protocolo no decide por nadie. Detrás de cada caso hay una institución que tiene que elegir, explicar
                    por qué eligió así y hacerse cargo. Eso es lo que enseñamos, asesoramos e instalamos:{" "}
                    <span className="italic text-[#e4935d]">criterio.</span>
                </p>
                <ul data-reveal="" className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/15 pt-6 text-[0.9375rem] text-[#ede7dc]/75">
                    <li>Formación</li>
                    <li>Consultoría</li>
                    <li>Compliance escolar</li>
                    <li>Atención clínica</li>
                    <li className="sm:ml-auto">
                        <Link
                            href="/pensamiento-critico"
                            className="font-semibold text-[#fbf7ee] underline decoration-[#e4935d] underline-offset-4 transition-colors hover:text-[#e4935d]"
                        >
                            Leer pensamiento crítico
                        </Link>
                    </li>
                </ul>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Libros                                                              */
/* ------------------------------------------------------------------ */

export function HomeBooksBand() {
    const root = useRef<HTMLElement>(null);
    useReveal(root);

    return (
        <section ref={root} aria-labelledby="home-libros-title" className="border-y border-[#d8cfc0] bg-[#fffdf8]">
            <div className="mx-auto max-w-[1640px] px-5 py-16 sm:px-8 sm:py-24 lg:px-14 xl:px-20">
                <div data-reveal="" className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className={LABEL}>Editorial Hammurabi</p>
                        <h2 id="home-libros-title" className={`${H2} mt-3 max-w-[22ch] text-[#171713]`}>
                            Lo que enseñamos está publicado
                        </h2>
                    </div>
                    <Link
                        href="/publicaciones"
                        className="group inline-flex items-center gap-2 border-b border-[#bd6f3c] py-1 text-[0.9375rem] font-semibold text-[#171713] transition-colors hover:text-[#9f5528]"
                    >
                        Ver libros y publicaciones
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                </div>

                <ul className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
                    {books.map((book) => (
                        <li key={book.title} data-reveal="">
                            <a
                                href={book.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fffdf8]"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#eee8dc]">
                                    <Image
                                        src={book.image}
                                        alt={`${book.title}, de ${book.author}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 30vw"
                                        className="object-contain p-8 drop-shadow-[0_4px_10px_rgba(60,36,18,0.16)] sm:p-10"
                                    />
                                </div>
                                <div className="mt-5">
                                    <p className="text-[0.8125rem] font-semibold tabular-nums text-[#6f675d]">{book.year}</p>
                                    <p className="crc-serif mt-1.5 text-[1.35rem] font-medium leading-[1.15] text-[#171713] transition-colors group-hover:text-[#9f5528]">
                                        {book.title}
                                    </p>
                                    <p className="mt-1.5 text-[0.9375rem] leading-snug text-[#55574f]">{book.subtitle}</p>
                                    <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-[#55574f]">{book.summary}</p>
                                    <span className="mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-[#9f5528]">
                                        Ver en Hammurabi
                                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Cierre: los directores del CRC, cada uno a cargo de su área         */
/* ------------------------------------------------------------------ */

const TEAM = [
    {
        name: "Juan Carlos Rauld",
        role: "Director del CRC · Consultor en ciencias sociales",
        area: "Formación, clínica y pensamiento",
        credential: "Doctorando en Trabajo Social · Univ. Rovira i Virgili",
        text: "Seminarios, cursos, atención clínica y supervisión de equipos. Autor de tres libros con Editorial Hammurabi.",
        cutout: "/images/juan-carlos-rauld-cutout-2026.png",
        cta: "Ver formación y Academia",
        href: "/academia",
        accentSide: "left" as const,
        floatingBadges: [
            {
                icon: BookOpen,
                kicker: "Editorial Hammurabi",
                label: "3 obras publicadas",
                pos: "top-6 left-3 sm:left-5",
                delay: 0,
                dy: -7,
            },
            {
                icon: GraduationCap,
                kicker: "Academia CRC",
                label: "Seminarios y supervisión",
                pos: "top-1/2 -translate-y-4 right-2 sm:right-4",
                delay: 1.1,
                dy: 6,
            },
            {
                icon: Compass,
                kicker: "Práctica clínica",
                label: "Niñez, trauma y criterio",
                pos: "bottom-6 left-4 sm:left-6",
                delay: 0.55,
                dy: -5,
            },
        ],
    },
    {
        name: "Hugo Felipe Hormazábal",
        role: "Socio · Director Comercial y de Desarrollo Institucional",
        area: "Instituciones, convenios y medición",
        credential: "Ingeniero Comercial · Marketing & Analytics, UAI",
        text: "Colegios, programas y fundaciones: diagnóstico, propuesta, convenio y medición de resultados con trazabilidad.",
        cutout: "/images/hugo-hormazabal-cutout-2026.png",
        cta: "Agenda con el equipo",
        href: "/instituciones#agenda",
        accentSide: "right" as const,
        floatingBadges: [
            {
                icon: ShieldCheck,
                kicker: "Comunidades educativas",
                label: "Compliance Ley 21.809",
                pos: "top-6 right-3 sm:right-5",
                delay: 0.35,
                dy: -7,
            },
            {
                icon: LineChart,
                kicker: "Gestión basada en datos",
                label: "Diagnóstico → Medición",
                pos: "top-1/2 -translate-y-4 left-2 sm:left-4",
                delay: 1.4,
                dy: 6,
            },
            {
                icon: Sparkles,
                kicker: "Desarrollo institucional",
                label: "Convenios y seguimiento",
                pos: "bottom-6 right-4 sm:right-6",
                delay: 0.85,
                dy: -5,
            },
        ],
    },
];

export function HomeTeamClose() {
    const root = useRef<HTMLElement>(null);
    useReveal(root);

    return (
        <section
            ref={root}
            aria-labelledby="home-equipo-title"
            className="relative overflow-hidden bg-[#15120e] text-[#fbf7ee]"
        >
            {/* Ambient architectural background geometry in CRC palette */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute left-1/2 top-0 h-[560px] w-[1100px] -translate-x-1/2 opacity-30"
                    style={{
                        background:
                            "radial-gradient(ellipse at 50% 25%, rgba(189,111,60,0.26) 0%, rgba(21,18,14,0) 70%)",
                    }}
                />
                <svg
                    className="absolute left-1/2 top-16 h-[680px] w-[1360px] -translate-x-1/2 text-[#e4935d]/[0.07]"
                    viewBox="0 0 1360 680"
                    fill="none"
                >
                    <circle cx="680" cy="340" r="310" stroke="currentColor" strokeWidth="1" strokeDasharray="6 8" />
                    <circle cx="680" cy="340" r="470" stroke="currentColor" strokeWidth="1" />
                    <line x1="80" y1="340" x2="1280" y2="340" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
                </svg>
            </div>

            <div className="relative mx-auto max-w-[1640px] px-5 py-16 sm:px-8 sm:py-24 lg:px-14 xl:px-20">
                <div data-reveal="" className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-[#e4935d]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#e4935d]" aria-hidden="true" />
                            Quiénes dirigen el CRC
                        </span>
                        <h2 id="home-equipo-title" className={`${H2} mt-3 max-w-[24ch]`}>
                            Detrás de cada puerta hay una persona a cargo
                        </h2>
                    </div>
                    <p className="max-w-[44ch] text-[1rem] leading-[1.7] text-[#ede7dc]/75">
                        Dos directores a cargo de cada área. Escribes a quien corresponde y te responde esa misma persona.
                    </p>
                </div>

                <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:gap-10">
                    {TEAM.map((person) => (
                        <li key={person.name} data-reveal="" className="flex">
                            <Link
                                href={person.href}
                                className="group relative flex w-full flex-col overflow-hidden rounded-[6px] border border-white/12 bg-[#1b1712] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e4935d]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#15120e]"
                            >
                                {/* Cinematic Figure Stage (ServiceNow-inspired architectural vessel + floating elements) */}
                                <div className="relative flex h-[370px] w-full items-end justify-center overflow-hidden border-b border-white/10 bg-[#14110d] px-4 pt-6 sm:h-[410px]">
                                    {/* Subtle studio grid & warm radial keylight */}
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-100"
                                        style={{
                                            background:
                                                "radial-gradient(circle at 50% 44%, rgba(228,147,93,0.22) 0%, rgba(189,111,60,0.08) 42%, rgba(20,17,13,0.95) 78%)",
                                        }}
                                    />

                                    {/* Animated orbital ring behind the figure */}
                                    <motion.svg
                                        aria-hidden="true"
                                        viewBox="0 0 360 360"
                                        className="pointer-events-none absolute top-7 h-[290px] w-[290px] text-[#e4935d]/25 sm:h-[320px] sm:w-[320px]"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
                                    >
                                        <circle
                                            cx="180"
                                            cy="180"
                                            r="166"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                            strokeDasharray="5 9"
                                        />
                                        <circle cx="180" cy="14" r="3.5" fill="#e4935d" />
                                        <circle cx="346" cy="180" r="2.5" fill="#bd6f3c" />
                                        <circle cx="14" cy="180" r="2.5" fill="#bd6f3c" />
                                    </motion.svg>

                                    {/* Sculpted Geometric Arch / Vessel containing the person */}
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none relative h-[82%] w-[240px] rounded-t-[130px] border border-[#e4935d]/35 bg-gradient-to-b from-[#2a2118] via-[#1f1913] to-[#15120e] shadow-[inset_0_1px_0_rgba(251,247,238,0.18)] transition-transform duration-500 group-hover:scale-[1.015] sm:w-[268px]"
                                    >
                                        {/* Inner warm copper rim glow */}
                                        <div
                                            className="absolute inset-2 rounded-t-[122px] border border-[#fbf7ee]/[0.07]"
                                            style={{
                                                background:
                                                    "radial-gradient(ellipse at 50% 32%, rgba(248,245,238,0.14) 0%, rgba(189,111,60,0.10) 48%, rgba(21,18,14,0.4) 100%)",
                                            }}
                                        />
                                        {/* Subtle diagonal architectural accent lines inside the vessel */}
                                        <div className="absolute inset-x-6 top-16 h-px bg-gradient-to-r from-transparent via-[#e4935d]/30 to-transparent" />
                                        <div className="absolute inset-x-10 bottom-14 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    </div>

                                    {/* Aligned Cinematic Portrait Cutout (head rises slightly above inner arch for 2.5D depth) */}
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1 z-10 mx-auto flex max-w-[340px] items-end justify-center sm:max-w-[370px]">
                                        <div className="relative h-full w-full">
                                            <Image
                                                src={person.cutout}
                                                alt={`${person.name}, ${person.role}`}
                                                fill
                                                sizes="(max-width: 768px) 90vw, 370px"
                                                className="object-contain object-bottom drop-shadow-[0_14px_28px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                                            />
                                        </div>
                                    </div>

                                    {/* Cinematic bottom vignette blend into the card body */}
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#1b1712] via-[#1b1712]/65 to-transparent"
                                    />

                                    {/* Living Floating Editorial Badges around the figure */}
                                    {person.floatingBadges.map((badge) => {
                                        const Icon = badge.icon;
                                        return (
                                            <motion.div
                                                key={badge.label}
                                                aria-hidden="true"
                                                initial={{ y: 0 }}
                                                animate={{ y: [0, badge.dy, 0] }}
                                                transition={{
                                                    duration: 4.2,
                                                    delay: badge.delay,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                                className={`pointer-events-none absolute z-20 flex items-center gap-2.5 rounded-[6px] border border-[#e4935d]/35 bg-[#17140f]/92 px-3 py-2 shadow-[0_12px_28px_-8px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.04] transition-colors duration-300 group-hover:border-[#e4935d]/65 ${badge.pos}`}
                                            >
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-[#bd6f3c]/20 text-[#e4935d]">
                                                    <Icon className="h-3.5 w-3.5" />
                                                </span>
                                                <span className="block pr-0.5 leading-tight">
                                                    <span className="block text-[0.6875rem] font-medium text-[#ede7dc]/65">
                                                        {badge.kicker}
                                                    </span>
                                                    <span className="block text-[0.78rem] font-semibold text-[#fbf7ee]">
                                                        {badge.label}
                                                    </span>
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Editorial Info Body */}
                                <div className="relative z-20 flex flex-1 flex-col p-6 sm:p-8">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-[0.8125rem] font-semibold text-[#e4935d]">{person.area}</p>
                                        <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[0.75rem] font-medium text-[#ede7dc]/70">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#bd6f3c]" aria-hidden="true" />
                                            Contacto directo
                                        </span>
                                    </div>
                                    <p className="crc-serif mt-2.5 text-[1.6rem] font-medium leading-[1.15] text-[#fbf7ee] transition-colors group-hover:text-[#e4935d]">
                                        {person.name}
                                    </p>
                                    <p className="mt-1.5 text-[0.9375rem] font-semibold leading-snug text-[#ede7dc]/90">
                                        {person.role}
                                    </p>
                                    <p className="mt-1 text-[0.8125rem] text-[#ede7dc]/60">{person.credential}</p>
                                    <p className="mt-4 flex-1 text-[0.9375rem] leading-[1.7] text-[#ede7dc]/75">{person.text}</p>
                                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                                        <span className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[#fbf7ee] transition-colors group-hover:text-[#e4935d]">
                                            {person.cta}
                                            <ArrowRight
                                                className="h-4 w-4 text-[#e4935d] transition-transform duration-200 group-hover:translate-x-1"
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <span className="text-[0.8125rem] font-medium text-[#ede7dc]/50">CRC · Chile</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
