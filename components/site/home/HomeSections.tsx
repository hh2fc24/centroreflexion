"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type RefObject } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
    },
    {
        who: "Duplas, equipos y docentes",
        title: "Profesionales",
        text: "Seminario en vivo con Juan Carlos Rauld, cursos de la Academia y supervisión para leer los casos con otro marco.",
        cta: "Ver el seminario",
        href: "/seminarios/desproteccion-infancia",
    },
    {
        who: "Cuando algo en casa no está bien",
        title: "Familias",
        text: "Acompañamiento familiar y atención clínica en salud mental infanto-juvenil, con respaldo técnico y trato cercano.",
        cta: "Pedir orientación",
        href: "/servicios/acompanamiento-familiar",
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
                                className="group grid gap-x-8 gap-y-3 py-7 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f5ee] sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:py-9"
                            >
                                <span className="text-[0.875rem] font-semibold tabular-nums text-[#6f675d]">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="block">
                                    <span className="block text-[0.8125rem] font-semibold text-[#6f675d]">{door.who}</span>
                                    <span className="crc-serif mt-1.5 block text-[1.6rem] font-medium leading-[1.15] text-[#171713] transition-colors group-hover:text-[#9f5528]">
                                        {door.title}
                                    </span>
                                    <span className="mt-3 block max-w-[60ch] text-[1rem] leading-[1.7] text-[#55574f]">{door.text}</span>
                                </span>
                                <span className="inline-flex items-center gap-2 self-end text-[0.9375rem] font-semibold text-[#9f5528] sm:self-center">
                                    {door.cta}
                                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
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
        <section ref={root} aria-label="Qué hace el CRC" className="bg-[#15120e] text-[#fbf7ee]">
            <div className="mx-auto max-w-[1640px] px-5 py-16 sm:px-8 sm:py-24 lg:px-14 xl:px-20">
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
/* Cierre: los tres directores, cada uno a cargo de una puerta          */
/* Orden y peso fijos: tres columnas iguales, Rocío al centro.          */
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
    useReveal(root);

    return (
        <section ref={root} aria-labelledby="home-equipo-title" className="bg-[#15120e] text-[#fbf7ee]">
            <div className="mx-auto max-w-[1640px] px-5 py-16 sm:px-8 sm:py-24 lg:px-14 xl:px-20">
                <div data-reveal="" className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="text-[0.8125rem] font-semibold text-[#e4935d]">Quiénes dirigen el CRC</p>
                        <h2 id="home-equipo-title" className={`${H2} mt-3 max-w-[24ch]`}>
                            Detrás de cada puerta hay una persona a cargo
                        </h2>
                    </div>
                    <p className="max-w-[42ch] text-[1rem] leading-[1.7] text-[#ede7dc]/75">
                        Tres directores, tres áreas. Escribes a quien corresponde y te responde esa misma persona.
                    </p>
                </div>

                <ul className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
                    {TEAM.map((person) => (
                        <li key={person.name} data-reveal="" className="flex">
                            <Link
                                href={person.href}
                                className="group flex w-full flex-col overflow-hidden rounded-[6px] border border-white/12 transition-colors hover:border-[#e4935d]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#15120e]"
                            >
                                <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
                                    <Image
                                        src={person.image}
                                        alt={`${person.name}, ${person.role} del CRC`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 30vw"
                                        className="object-contain object-bottom"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col p-6 sm:p-7">
                                    <p className="text-[0.8125rem] font-semibold text-[#e4935d]">{person.area}</p>
                                    <p className="crc-serif mt-2 text-[1.5rem] font-medium leading-[1.15]">{person.name}</p>
                                    <p className="mt-1.5 text-[0.875rem] font-semibold leading-snug text-[#ede7dc]/85">{person.role}</p>
                                    <p className="mt-4 flex-1 text-[0.9375rem] leading-[1.7] text-[#ede7dc]/70">{person.text}</p>
                                    <span className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[#fbf7ee]">
                                        {person.cta}
                                        <ArrowRight className="h-4 w-4 text-[#e4935d] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
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
