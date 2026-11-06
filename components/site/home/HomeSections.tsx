"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type RefObject } from "react";
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

/**
 * Una sola composición en vez de dos tarjetas espejo: un campo de tinta,
 * un plano de cobre detrás y los dos directores a escala real, con el corte
 * de la foto coincidiendo con el borde inferior del bloque y la cabeza por
 * encima del borde superior. La geometría es plana (colores del sistema,
 * radio de 6px, sin degradados ni sombras); el peso lo ponen la escala y el
 * contraste. Juan Carlos va delante como figura principal; Hugo detrás, sobre el
 * plano de cobre. Al pasar por la ficha de una persona, la otra figura baja
 * de intensidad para que se lea quién es quién.
 */
const TEAM = [
    {
        name: "Juan Carlos Rauld",
        role: "Director del CRC · Consultor en ciencias sociales",
        area: "Formación, clínica y pensamiento",
        credential: "Doctorando en Trabajo Social, Univ. Rovira i Virgili",
        text: "Seminarios, cursos, atención clínica y supervisión de equipos. Autor de tres libros con Editorial Hammurabi.",
        cutout: "/images/juan-carlos-rauld-cutout-2026.png",
        cta: "Ver formación y Academia",
        href: "/academia",
    },
    {
        name: "Hugo Felipe Hormazábal",
        role: "Socio · Director Comercial y de Desarrollo Institucional",
        area: "Instituciones, convenios y medición",
        credential: "Ingeniero Comercial, Marketing & Analytics, UAI",
        text: "Colegios, programas y fundaciones: diagnóstico, propuesta, convenio y medición de resultados con trazabilidad.",
        cutout: "/images/hugo-hormazabal-cutout-2026.png",
        cta: "Agenda con el equipo",
        href: "/instituciones#agenda",
    },
];

export function HomeTeamClose() {
    const root = useRef<HTMLElement>(null);
    const [active, setActive] = useState<number | null>(null);
    useReveal(root);

    return (
        <section
            ref={root}
            aria-labelledby="home-equipo-title"
            className="overflow-hidden bg-[#f8f5ee] text-[#171713]"
        >
            <div className="mx-auto max-w-[1640px] px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:px-14 xl:px-20">
                <div data-reveal="" className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className={LABEL}>Quiénes dirigen el CRC</p>
                        <h2 id="home-equipo-title" className={`${H2} mt-3 max-w-[24ch]`}>
                            Detrás de cada puerta hay una persona a cargo
                        </h2>
                    </div>
                    <p className="max-w-[44ch] text-[1rem] leading-[1.7] text-[#55574f]">
                        Dos directores, dos áreas. Escribes a quien corresponde y te responde esa misma persona.
                    </p>
                </div>

                {/* Campo de tinta: texto a la izquierda, plano de cobre y figuras a la derecha */}
                <div
                    data-reveal=""
                    className="relative mt-10 grid rounded-[6px] bg-[#15120e] text-[#fbf7ee] xl:mt-24 xl:grid-cols-12"
                >
                    <ul className="flex flex-col justify-center px-6 pb-2 pt-6 sm:px-8 sm:pt-8 lg:px-12 xl:col-span-4 xl:py-12 xl:pl-14 xl:pr-6">
                        {TEAM.map((person, idx) => (
                            <li key={person.name} className={idx > 0 ? "border-t border-white/12" : ""}>
                                <Link
                                    href={person.href}
                                    onMouseEnter={() => setActive(idx)}
                                    onMouseLeave={() => setActive(null)}
                                    onFocus={() => setActive(idx)}
                                    onBlur={() => setActive(null)}
                                    className="group -mx-3 block rounded-[6px] px-3 py-6 transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#15120e] lg:py-7"
                                >
                                    <p className="text-[0.8125rem] font-semibold text-[#e4935d]">{person.area}</p>
                                    <p className="crc-serif mt-2 text-[clamp(1.5rem,1.9vw,1.9rem)] font-medium leading-[1.1] tracking-[-0.01em]">
                                        {person.name}
                                    </p>
                                    <p className="mt-2 text-[0.9375rem] font-semibold leading-snug text-[#ede7dc]/90">{person.role}</p>
                                    <p className="mt-1 text-[0.8125rem] text-[#ede7dc]/60">{person.credential}</p>
                                    <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-[1.65] text-[#ede7dc]/72">{person.text}</p>
                                    <span className="mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[#fbf7ee]">
                                        {person.cta}
                                        <ArrowRight
                                            className="h-4 w-4 text-[#e4935d] transition-transform duration-200 group-hover:translate-x-1"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Composición: plano de cobre + dos figuras apoyadas en el borde inferior */}
                    <div className="relative h-[260px] sm:h-[360px] md:h-[440px] lg:h-[520px] xl:col-span-8 xl:h-auto xl:min-h-[520px]">
                        <div
                            aria-hidden="true"
                            className="absolute bottom-0 right-[12%] top-8 w-[44%] rounded-t-[6px] bg-[#bd6f3c] xl:-top-7 xl:right-[10%] xl:w-[40%]"
                        />
                        {TEAM.map((person, idx) => {
                            const dim = active !== null && active !== idx;
                            const pos =
                                idx === 0
                                    ? "left-[2%] z-20 h-[92%] md:h-[96%] xl:left-0 xl:h-[104%] 2xl:h-[112%]"
                                    : "right-[4%] z-10 h-[84%] md:h-[90%] xl:right-[2%] xl:h-[96%] 2xl:h-[102%]";
                            return (
                                <div
                                    key={person.name}
                                    className={`absolute bottom-0 aspect-[1200/1350] transition-opacity duration-300 ${pos}`}
                                    style={{ opacity: dim ? 0.45 : 1 }}
                                >
                                    <Image
                                        src={person.cutout}
                                        alt={`${person.name}, ${person.role}`}
                                        fill
                                        sizes="(max-width: 1279px) 60vw, 45vw"
                                        className="object-contain object-bottom"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
