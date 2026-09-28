"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { books } from "@/lib/books";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Secciones comerciales de la portada. Todo el movimiento vive dentro de
 * gsap.matchMedia con "prefers-reduced-motion: no-preference": quien pide
 * menos movimiento ve las secciones completas y quietas desde el inicio.
 */
const MOTION_OK = "(prefers-reduced-motion: no-preference)";

const GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

function Grain({ className = "opacity-[0.06]" }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 mix-blend-multiply ${className}`}
            style={{ backgroundImage: GRAIN }}
        />
    );
}

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
        text: "Seminario en vivo con Juan Carlos Rauld, cursos de la Academia y supervisión para leer los casos con otro marco.",
        cta: "Ver el seminario",
        href: "/seminarios/desproteccion-infancia",
        image: "/images/desproteccion-institucionalizacion-editorial.png",
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

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.utils.toArray<HTMLElement>("[data-door]").forEach((row) => {
                    gsap.from(row, {
                        y: 56,
                        opacity: 0,
                        duration: 1.05,
                        ease: "expo.out",
                        scrollTrigger: { trigger: row, start: "top 86%", once: true },
                    });
                });
                gsap.fromTo(
                    "[data-door-progress]",
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: "[data-door-list]",
                            start: "top 70%",
                            end: "bottom 60%",
                            scrub: true,
                        },
                    }
                );
            });
            return () => mm.revert();
        },
        { scope: root }
    );

    return (
        <section ref={root} aria-labelledby="home-puertas-title" className="relative overflow-clip border-b border-[#d8cfc0] bg-[#f8f5ee]">
            <Grain />
            <div className="relative mx-auto grid max-w-[1640px] gap-12 px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-14 xl:px-20">
                <div className="lg:sticky lg:top-32 lg:self-start">
                    <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.22em] text-[#9f5528]">Por dónde empezar</p>
                    <h2
                        id="home-puertas-title"
                        className="crc-serif mt-4 max-w-[14ch] text-[clamp(2.4rem,4.4vw,4.6rem)] font-medium leading-[0.95] tracking-[-0.02em] text-[#171713] text-balance"
                    >
                        Tres maneras de trabajar con el <span className="italic text-[#9f5528]">CRC</span>
                    </h2>
                    <p className="mt-6 max-w-[42ch] text-[0.98rem] leading-[1.7] text-[#55574f]">
                        Cada público tiene su puerta y su siguiente paso. Elige la tuya y te llevamos directo a lo que necesitas.
                    </p>
                </div>

                <div data-door-list="" className="relative">
                    <span aria-hidden="true" className="absolute left-0 top-0 hidden h-full w-px bg-[#d8cfc0] sm:block" />
                    <span
                        aria-hidden="true"
                        data-door-progress=""
                        className="absolute left-0 top-0 hidden h-full w-px origin-top bg-[#bd6f3c] sm:block"
                    />
                    <ul className="grid gap-5 sm:pl-10">
                        {AUDIENCE_DOORS.map((door) => (
                            <li key={door.title} data-door="">
                                <Link
                                    href={door.href}
                                    className="group grid overflow-hidden rounded-[10px] border border-[#d8cfc0] bg-[#fffdf8] transition-[border-color,box-shadow,transform] duration-500 ease-out hover:-translate-y-1 hover:border-[#bd6f3c]/70 hover:shadow-[0_30px_60px_-30px_rgba(90,52,24,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] active:translate-y-0 sm:grid-cols-[minmax(0,1fr)_200px]"
                                >
                                    <div className="flex flex-col p-6 sm:p-8">
                                        <span className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#6f675d]">{door.who}</span>
                                        <span className="crc-serif mt-3 text-[clamp(2rem,3vw,2.9rem)] font-medium leading-none tracking-[-0.015em] text-[#171713]">
                                            {door.title}
                                        </span>
                                        <span className="mt-4 max-w-[52ch] text-[0.95rem] leading-[1.7] text-[#55574f]">{door.text}</span>
                                        <span className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-[#9f5528]">
                                            {door.cta}
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
                                        </span>
                                    </div>
                                    <div className="relative hidden overflow-hidden bg-[#eee8dc] sm:block">
                                        <Image
                                            src={door.image}
                                            alt=""
                                            fill
                                            sizes="200px"
                                            className="object-cover object-center grayscale-[0.35] saturate-[0.8] transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Manifiesto: el texto se ilumina palabra por palabra con el scroll    */
/* ------------------------------------------------------------------ */

const MANIFESTO =
    "Un protocolo no decide por nadie. Detrás de cada caso hay una institución que tiene que elegir, explicar por qué eligió así y hacerse cargo. Eso es lo que enseñamos, asesoramos e instalamos:";

export function HomeManifesto() {
    const root = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.fromTo(
                    "[data-word]",
                    { opacity: 0.14 },
                    {
                        opacity: 1,
                        stagger: 0.08,
                        ease: "none",
                        scrollTrigger: {
                            trigger: "[data-manifesto]",
                            start: "top 78%",
                            end: "bottom 45%",
                            scrub: 0.6,
                        },
                    }
                );
                gsap.from("[data-manifesto-key]", {
                    opacity: 0,
                    y: 24,
                    filter: "blur(6px)",
                    duration: 1.1,
                    ease: "expo.out",
                    scrollTrigger: { trigger: "[data-manifesto-key]", start: "top 88%", once: true },
                });
            });
            return () => mm.revert();
        },
        { scope: root }
    );

    return (
        <section ref={root} aria-label="Qué hace el CRC" className="relative overflow-hidden bg-[#15120e] text-[#fbf7ee]">
            <Grain className="opacity-[0.09] mix-blend-screen" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-[#bd6f3c]/18 blur-[140px]"
            />
            <div className="relative mx-auto max-w-[1640px] px-5 py-28 sm:px-8 sm:py-40 lg:px-14 xl:px-20">
                <p
                    data-manifesto=""
                    className="crc-serif max-w-[30ch] text-[clamp(2rem,4.2vw,4.4rem)] font-medium leading-[1.08] tracking-[-0.015em] text-balance"
                >
                    {MANIFESTO.split(" ").map((word, i) => (
                        <span key={i} data-word="" className="inline-block pr-[0.26em]">
                            {word}
                        </span>
                    ))}
                    <span data-manifesto-key="" className="inline-block italic text-[#e4935d]">
                        criterio.
                    </span>
                </p>
                <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/12 pt-8 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#ede7dc]/70">
                    <span>Formación</span>
                    <span>Consultoría</span>
                    <span>Compliance escolar</span>
                    <span>Atención clínica</span>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Libros                                                              */
/* ------------------------------------------------------------------ */


export function HomeBooksBand() {
    const root = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.utils.toArray<HTMLElement>("[data-book-art]").forEach((art, i) => {
                    gsap.fromTo(
                        art,
                        { scale: 0.84, opacity: 0.35 },
                        {
                            scale: 1,
                            opacity: 1,
                            ease: "none",
                            scrollTrigger: { trigger: art, start: `top ${92 - i * 3}%`, end: "top 45%", scrub: 0.8 },
                        }
                    );
                });
                gsap.from("[data-book-copy]", {
                    y: 28,
                    opacity: 0,
                    duration: 0.9,
                    stagger: 0.12,
                    ease: "expo.out",
                    scrollTrigger: { trigger: "[data-book-grid]", start: "top 75%", once: true },
                });
            });
            return () => mm.revert();
        },
        { scope: root }
    );

    return (
        <section ref={root} aria-labelledby="home-libros-title" className="relative overflow-hidden border-y border-[#d8cfc0] bg-[#fffdf8]">
            <div className="relative mx-auto max-w-[1640px] px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:px-14 xl:px-20">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.22em] text-[#9f5528]">Editorial Hammurabi</p>
                        <h2
                            id="home-libros-title"
                            className="crc-serif mt-4 max-w-[18ch] text-[clamp(2.4rem,4.4vw,4.6rem)] font-medium leading-[0.95] tracking-[-0.02em] text-[#171713] text-balance"
                        >
                            Lo que enseñamos está <span className="italic text-[#9f5528]">publicado</span>
                        </h2>
                    </div>
                    <Link
                        href="/publicaciones"
                        className="group inline-flex items-center gap-2 border-b border-[#bd6f3c] py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-[#171713] transition-colors hover:text-[#9f5528]"
                    >
                        Ver libros y publicaciones
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                </div>

                <ul data-book-grid="" className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-3">
                    {books.map((book, i) => (
                        <li key={book.title} className={i === 1 ? "md:mt-16" : i === 2 ? "md:mt-8" : undefined}>
                            <a
                                href={book.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fffdf8]"
                            >
                                <div
                                    data-book-art=""
                                    className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#eee8dc]"
                                >
                                    <Image
                                        src={book.image}
                                        alt={`${book.title}, de ${book.author}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 30vw"
                                        className="object-contain p-8 drop-shadow-[0_24px_30px_rgba(60,36,18,0.28)] transition-transform duration-700 ease-out group-hover:scale-105 sm:p-10"
                                    />
                                    <span className="absolute left-4 top-4 bg-[#15120e]/80 px-2.5 py-1.5 text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-[#fffaf0] backdrop-blur">
                                        {book.year}
                                    </span>
                                </div>
                                <div data-book-copy="" className="mt-6">
                                    <p className="crc-serif text-[1.75rem] font-medium leading-[1.05] text-[#171713]">{book.title}</p>
                                    <p className="crc-serif mt-2 text-[1.08rem] italic leading-snug text-[#55574f]">{book.subtitle}</p>
                                    <p className="mt-4 max-w-[46ch] text-[0.92rem] leading-[1.65] text-[#55574f]">{book.summary}</p>
                                    <span className="mt-5 inline-flex items-center gap-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#9f5528]">
                                        Ver en Hammurabi
                                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
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
/* Cierre: los tres directores, cada uno a cargo de una puerta          */
/* ------------------------------------------------------------------ */

const TEAM = [
    {
        name: "Juan Carlos Rauld",
        role: "Director",
        area: "Formación y pensamiento",
        text: "Seminarios, cursos y supervisión de equipos. Autor de tres libros con Editorial Hammurabi.",
        image: "/images/juan_carlos_real_white.png",
        cta: "Ver el seminario",
        href: "/seminarios/desproteccion-infancia",
    },
    {
        name: "Rocío Solar",
        role: "Cofundadora · Directora Clínica",
        area: "Clínica y familias",
        text: "Atención clínica en salud mental infanto-juvenil, acompañamiento a familias y supervisión de casos complejos.",
        image: "/images/rocio-solar-crc-2026.png",
        cta: "Pedir orientación",
        href: "/servicios/clinica",
    },
    {
        name: "Hugo Felipe Hormazábal",
        role: "Socio · Director Comercial y de Desarrollo Institucional",
        area: "Instituciones",
        text: "Colegios, programas y fundaciones: diagnóstico, propuesta, convenio y medición de resultados.",
        image: "/images/hugo-hormazabal-crc-2026-large.png",
        cta: "Agenda 20 minutos",
        href: "/instituciones#agenda",
    },
];

export function HomeTeamClose() {
    const root = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.from("[data-team-head]", {
                    y: 32,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.08,
                    ease: "expo.out",
                    scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
                });
                gsap.utils.toArray<HTMLElement>("[data-team-card]").forEach((card, i) => {
                    gsap.from(card, {
                        y: 60,
                        opacity: 0,
                        duration: 1.1,
                        delay: i * 0.12,
                        ease: "expo.out",
                        scrollTrigger: { trigger: "[data-team-grid]", start: "top 82%", once: true },
                    });
                });
                gsap.fromTo(
                    "[data-team-portrait]",
                    { clipPath: "inset(14% 10% 0% 10% round 10px)" },
                    {
                        clipPath: "inset(0% 0% 0% 0% round 10px)",
                        ease: "none",
                        scrollTrigger: { trigger: "[data-team-grid]", start: "top 90%", end: "top 40%", scrub: 0.8 },
                    }
                );
            });
            return () => mm.revert();
        },
        { scope: root }
    );

    return (
        <section ref={root} aria-labelledby="home-equipo-title" className="relative overflow-hidden bg-[#15120e] text-white">
            <Grain className="opacity-[0.09] mix-blend-screen" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#bd6f3c]/14 blur-[150px]"
            />
            <div className="relative mx-auto max-w-[1640px] px-5 py-24 sm:px-8 sm:py-32 lg:px-14 xl:px-20">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p data-team-head="" className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#e4935d]">
                            Quiénes dirigen el CRC
                        </p>
                        <h2
                            id="home-equipo-title"
                            data-team-head=""
                            className="crc-serif mt-5 max-w-[22ch] text-[clamp(2.3rem,4.4vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.02em] text-balance"
                        >
                            Detrás de cada puerta hay una persona <span className="italic text-[#e4935d]">a cargo</span>
                        </h2>
                    </div>
                    <p data-team-head="" className="max-w-[42ch] text-[1rem] leading-[1.7] text-[#ede7dc]/75">
                        Tres directores, tres áreas. Escribes a quien corresponde y te responde esa misma persona.
                    </p>
                </div>

                <ul data-team-grid="" className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
                    {TEAM.map((person) => (
                        <li key={person.name} data-team-card="" className="flex">
                            <Link
                                href={person.href}
                                className="group flex w-full flex-col overflow-hidden rounded-[12px] border border-white/10 bg-white/[0.035] transition duration-500 ease-out hover:-translate-y-1 hover:border-[#e4935d]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#15120e] active:translate-y-0"
                            >
                                <div data-team-portrait="" className="relative aspect-[4/5] w-full overflow-hidden bg-white">
                                    <Image
                                        src={person.image}
                                        alt={`${person.name}, ${person.role} del CRC`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 30vw"
                                        className="object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col p-6 sm:p-7">
                                    <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#e4935d]">{person.area}</p>
                                    <p className="crc-serif mt-3 text-[1.9rem] font-medium leading-none">{person.name}</p>
                                    <p className="mt-2 text-[0.8rem] font-semibold leading-snug text-[#ede7dc]/85">{person.role}</p>
                                    <p className="mt-4 flex-1 text-[0.92rem] leading-[1.65] text-[#ede7dc]/70">{person.text}</p>
                                    <span className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-white">
                                        {person.cta}
                                        <ArrowRight className="h-4 w-4 text-[#e4935d] transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
