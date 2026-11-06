"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type RefObject } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, ShieldCheck, LineChart, GraduationCap } from "lucide-react";
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
        credential: "Doctorando en Trabajo Social · Univ. Rovira i Virgili, España",
        text: "Seminarios, cursos, atención clínica y supervisión de equipos. Autor de tres libros con Editorial Hammurabi.",
        cutout: "/images/juan-carlos-rauld-cutout-2026.png",
        cta: "Ver formación y Academia",
        href: "/academia",
        pillars: ["Salud mental infantil", "Supervisión clínica", "Editorial Hammurabi"],
        floatingCardTop: {
            icon: BookOpen,
            kicker: "Editorial Hammurabi",
            label: "3 libros publicados",
        },
        floatingCardBottom: {
            icon: GraduationCap,
            kicker: "Academia CRC",
            label: "Seminarios y supervisión",
        },
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
        pillars: ["Compliance Ley 21.809", "Convenios institucionales", "Datos y medición"],
        floatingCardTop: {
            icon: ShieldCheck,
            kicker: "Comunidades educativas",
            label: "Compliance Ley 21.809",
        },
        floatingCardBottom: {
            icon: LineChart,
            kicker: "Gestión e indicadores",
            label: "Diagnóstico → Medición",
        },
    },
];

export function HomeTeamClose() {
    const root = useRef<HTMLElement>(null);
    useReveal(root);

    return (
        <section
            ref={root}
            aria-labelledby="home-equipo-title"
            className="relative overflow-hidden border-t border-[#d8cfc0] bg-[#f8f5ee] text-[#171713]"
        >
            <div className="relative mx-auto max-w-[1640px] px-5 py-16 sm:px-8 sm:py-24 lg:px-14 xl:px-20">
                <div data-reveal="" className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className={LABEL}>Quiénes dirigen el CRC</p>
                        <h2 id="home-equipo-title" className={`${H2} mt-3 max-w-[24ch] text-[#171713]`}>
                            Detrás de cada puerta hay una persona a cargo
                        </h2>
                    </div>
                    <p className="max-w-[44ch] text-[1rem] leading-[1.7] text-[#55574f]">
                        Dos directores a cargo de cada área. Escribes a quien corresponde y te responde esa misma persona.
                    </p>
                </div>

                <ul className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-10">
                    {TEAM.map((person, idx) => {
                        const TopIcon = person.floatingCardTop.icon;
                        const BottomIcon = person.floatingCardBottom.icon;

                        return (
                            <li key={person.name} data-reveal="" className="flex">
                                <Link
                                    href={person.href}
                                    className="group relative grid w-full overflow-hidden rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#bd6f3c] hover:shadow-[0_24px_48px_-20px_rgba(23,23,19,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f5ee] sm:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]"
                                >
                                    {/* Left Column: Modern Geometric Figure + Pop-Out Cutout + Floating UI Cards */}
                                    <div className="relative flex min-h-[340px] items-end justify-center overflow-hidden border-b border-[#e6decb] bg-[#f3ede1] px-4 pt-6 sm:min-h-[380px] sm:border-b-0 sm:border-r">
                                        {/* Subtle modern dot grid pattern */}
                                        <div
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 opacity-45"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(#bd6f3c 1px, transparent 1px)",
                                                backgroundSize: "18px 18px",
                                            }}
                                        />

                                        {/* ServiceNow-style asymmetric geometric shape behind the person */}
                                        <motion.div
                                            aria-hidden="true"
                                            initial={{ rotate: idx === 0 ? -3 : 3 }}
                                            whileHover={{ rotate: 0, scale: 1.02 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className="pointer-events-none absolute bottom-5 h-[74%] w-[82%] rounded-[28px] border border-[#bd6f3c]/30 bg-gradient-to-br from-[#fffdf8] via-[#efe7d6] to-[#e2d4be] shadow-[0_16px_36px_-12px_rgba(159,85,40,0.18)]"
                                        >
                                            {/* Accent copper corner bar */}
                                            <div className="absolute -right-1.5 top-6 h-12 w-1.5 rounded-full bg-[#bd6f3c]" />
                                            <div className="absolute left-5 top-5 h-2 w-2 rounded-full bg-[#bd6f3c]/60" />
                                        </motion.div>

                                        {/* Director Cutout rising above the geometric shape (2.5D pop-out) */}
                                        <div className="pointer-events-none relative z-10 h-[320px] w-full max-w-[260px] sm:h-[350px] sm:max-w-[280px]">
                                            <Image
                                                src={person.cutout}
                                                alt={`${person.name}, ${person.role}`}
                                                fill
                                                sizes="(max-width: 640px) 260px, 280px"
                                                className="object-contain object-bottom drop-shadow-[0_12px_22px_rgba(23,23,19,0.14)] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                            />
                                        </div>

                                        {/* Floating Modern UI Pill — Top */}
                                        <motion.div
                                            aria-hidden="true"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{
                                                duration: 3.8,
                                                delay: idx * 0.4,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="pointer-events-none absolute left-3 top-3.5 z-20 flex items-center gap-2 rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8]/95 px-2.5 py-1.5 shadow-[0_10px_24px_-6px_rgba(23,23,19,0.14)]"
                                        >
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-[#bd6f3c]/15 text-[#9f5528]">
                                                <TopIcon className="h-3.5 w-3.5" />
                                            </span>
                                            <span className="leading-tight">
                                                <span className="block text-[0.65rem] font-medium text-[#6f675d]">
                                                    {person.floatingCardTop.kicker}
                                                </span>
                                                <span className="block text-[0.75rem] font-semibold text-[#171713]">
                                                    {person.floatingCardTop.label}
                                                </span>
                                            </span>
                                        </motion.div>

                                        {/* Floating Modern UI Pill — Bottom Right */}
                                        <motion.div
                                            aria-hidden="true"
                                            animate={{ y: [0, 5, 0] }}
                                            transition={{
                                                duration: 4.2,
                                                delay: idx * 0.4 + 0.9,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="pointer-events-none absolute bottom-3.5 right-3 z-20 flex items-center gap-2 rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8]/95 px-2.5 py-1.5 shadow-[0_10px_24px_-6px_rgba(23,23,19,0.16)]"
                                        >
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-[#171713] text-[#fffdf8]">
                                                <BottomIcon className="h-3.5 w-3.5 text-[#e4935d]" />
                                            </span>
                                            <span className="leading-tight">
                                                <span className="block text-[0.65rem] font-medium text-[#6f675d]">
                                                    {person.floatingCardBottom.kicker}
                                                </span>
                                                <span className="block text-[0.75rem] font-semibold text-[#171713]">
                                                    {person.floatingCardBottom.label}
                                                </span>
                                            </span>
                                        </motion.div>
                                    </div>

                                    {/* Right Column: Executive Editorial Info */}
                                    <div className="flex flex-col justify-between p-6 sm:p-7 xl:p-8">
                                        <div>
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <span className="text-[0.8125rem] font-semibold text-[#9f5528]">
                                                    {person.area}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#f3ede1] px-2.5 py-0.5 text-[0.75rem] font-semibold text-[#55574f]">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#bd6f3c]" aria-hidden="true" />
                                                    Trato directo
                                                </span>
                                            </div>

                                            <h3 className="crc-serif mt-2.5 text-[1.55rem] font-medium leading-[1.15] text-[#171713] transition-colors group-hover:text-[#9f5528]">
                                                {person.name}
                                            </h3>
                                            <p className="mt-1 text-[0.9375rem] font-semibold leading-snug text-[#171713]">
                                                {person.role}
                                            </p>
                                            <p className="mt-1 text-[0.8125rem] text-[#6f675d]">
                                                {person.credential}
                                            </p>

                                            <p className="mt-4 text-[0.9375rem] leading-[1.68] text-[#55574f]">
                                                {person.text}
                                            </p>

                                            {/* Capability tags */}
                                            <div className="mt-5 flex flex-wrap gap-1.5">
                                                {person.pillars.map((pillar) => (
                                                    <span
                                                        key={pillar}
                                                        className="rounded-[4px] border border-[#e2d9c8] bg-[#f8f5ee] px-2.5 py-1 text-[0.75rem] font-medium text-[#55574f]"
                                                    >
                                                        {pillar}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-7 flex items-center justify-between border-t border-[#eee8dc] pt-4">
                                            <span className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[#171713] transition-colors group-hover:text-[#9f5528]">
                                                {person.cta}
                                                <ArrowRight
                                                    className="h-4 w-4 text-[#bd6f3c] transition-transform duration-200 group-hover:translate-x-1"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
