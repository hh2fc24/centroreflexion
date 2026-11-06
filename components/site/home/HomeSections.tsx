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
 * Una escena continua con las dos fotos de estudio reales (mismo fondo,
 * misma luz, sin recortes). Cada foto se funde con el fondo de la página por
 * una máscara de degradado, así no hay marco ni silueta pegada: los dos
 * directores aparecen de pie dentro de la página.
 *
 * Movimiento, a pedido del equipo (va más allá de la pauta de
 * docs/design-system-crc.md §5 y por eso queda documentado aquí):
 * - entrada lenta al llegar a la sección (foto desde abajo y un poco más
 *   grande, texto escalonado), una sola vez;
 * - respiración: cada foto escala 1 → 1.035 en 16 s, ida y vuelta, desfasadas;
 * - profundidad con el puntero: las fotos y el texto se desplazan unos
 *   píxeles en sentidos opuestos (solo con puntero fino);
 * - enfoque: al pasar por la ficha de una persona, la otra foto pierde color
 *   e intensidad, como un cambio de foco.
 * Todo dentro de prefers-reduced-motion: no-preference; sin JS se ve completo.
 */
const TEAM = [
    {
        name: "Juan Carlos Rauld",
        role: "Director del CRC · Consultor en ciencias sociales",
        area: "Formación, clínica y pensamiento",
        credential: "Doctorando en Trabajo Social, Univ. Rovira i Virgili",
        text: "Seminarios, cursos, atención clínica y supervisión de equipos. Autor de tres libros con Editorial Hammurabi.",
        photo: "/images/juan_carlos_real_white.png",
        cta: "Ver formación y Academia",
        href: "/academia",
    },
    {
        name: "Hugo Felipe Hormazábal",
        role: "Socio · Director Comercial y de Desarrollo Institucional",
        area: "Instituciones, convenios y medición",
        credential: "Ingeniero Comercial, Marketing & Analytics, UAI",
        text: "Colegios, programas y fundaciones: diagnóstico, propuesta, convenio y medición de resultados con trazabilidad.",
        photo: "/images/hugo-hormazabal-crc-2026-large.png",
        cta: "Agenda con el equipo",
        href: "/instituciones#agenda",
    },
];

function useTeamScene(root: RefObject<HTMLElement | null>) {
    useGSAP(
        () => {
            const section = root.current;
            if (!section) return;
            const mm = gsap.matchMedia();

            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const photos = gsap.utils.toArray<HTMLElement>("[data-photo]", section);
                const inners = gsap.utils.toArray<HTMLElement>("[data-photo-inner]", section);
                const lines = gsap.utils.toArray<HTMLElement>("[data-line]", section);

                // Entrada, una sola vez
                const tl = gsap.timeline({
                    scrollTrigger: { trigger: section, start: "top 70%", once: true },
                    defaults: { ease: "power3.out" },
                });
                tl.from(photos, { y: 48, opacity: 0, duration: 1.6, stagger: 0.18 }, 0)
                    .from(inners, { scale: 1.07, duration: 2.2, ease: "power2.out", stagger: 0.18 }, 0)
                    .from(lines, { y: 16, opacity: 0, duration: 0.8, stagger: 0.07 }, 0.35);

                // Respiración lenta, desfasada
                inners.forEach((el, i) => {
                    gsap.to(el, { scale: 1.035, duration: 16, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2.2 + i * 5 });
                });

                // Enfoque: la ficha activa trae su foto, la otra se aleja
                const fichas = gsap.utils.toArray<HTMLElement>("[data-ficha]", section);
                const focus = (active: number | null) => {
                    photos.forEach((el, i) => {
                        const dim = active !== null && active !== i;
                        gsap.to(el, {
                            opacity: dim ? 0.5 : 1,
                            filter: dim ? "saturate(0.35)" : "saturate(1)",
                            duration: 0.7,
                            ease: "power2.out",
                            overwrite: "auto",
                        });
                    });
                };
                const offs: Array<() => void> = [];
                fichas.forEach((f, i) => {
                    const on = () => focus(i);
                    const off = () => focus(null);
                    f.addEventListener("pointerenter", on);
                    f.addEventListener("pointerleave", off);
                    f.addEventListener("focusin", on);
                    f.addEventListener("focusout", off);
                    offs.push(() => {
                        f.removeEventListener("pointerenter", on);
                        f.removeEventListener("pointerleave", off);
                        f.removeEventListener("focusin", on);
                        f.removeEventListener("focusout", off);
                    });
                });
                return () => offs.forEach((o) => o());
            });

            // Profundidad con el puntero: solo con puntero fino y sin reducción de movimiento
            mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
                const photos = gsap.utils.toArray<HTMLElement>("[data-photo]", section);
                const copy = section.querySelector<HTMLElement>("[data-copy]");
                const setters = photos.map((el, i) => ({
                    x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
                    y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
                    depth: i === 0 ? 10 : 16,
                }));
                const cx = copy ? gsap.quickTo(copy, "x", { duration: 1.4, ease: "power3.out" }) : null;
                const cy = copy ? gsap.quickTo(copy, "y", { duration: 1.4, ease: "power3.out" }) : null;
                const move = (e: PointerEvent) => {
                    const r = section.getBoundingClientRect();
                    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
                    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
                    setters.forEach((s) => {
                        s.x(nx * s.depth);
                        s.y(ny * s.depth * 0.6);
                    });
                    cx?.(-nx * 5);
                    cy?.(-ny * 3);
                };
                const leave = () => {
                    setters.forEach((s) => {
                        s.x(0);
                        s.y(0);
                    });
                    cx?.(0);
                    cy?.(0);
                };
                section.addEventListener("pointermove", move);
                section.addEventListener("pointerleave", leave);
                return () => {
                    section.removeEventListener("pointermove", move);
                    section.removeEventListener("pointerleave", leave);
                };
            });

            return () => mm.revert();
        },
        { scope: root }
    );
}

export function HomeTeamClose() {
    const root = useRef<HTMLElement>(null);
    useTeamScene(root);

    return (
        <section ref={root} aria-labelledby="home-equipo-title" className="relative overflow-hidden bg-[#f8f5ee] text-[#171713]">
            <div className="mx-auto max-w-[1640px] px-5 pt-16 sm:px-8 sm:pt-24 lg:px-14 xl:px-20">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p data-line="" className={LABEL}>Quiénes dirigen el CRC</p>
                        <h2 data-line="" id="home-equipo-title" className={`${H2} mt-3 max-w-[24ch]`}>
                            Detrás de cada puerta hay una persona a cargo
                        </h2>
                    </div>
                    <p data-line="" className="max-w-[44ch] text-[1rem] leading-[1.7] text-[#55574f]">
                        Dos directores, dos áreas. Escribes a quien corresponde y te responde esa misma persona.
                    </p>
                </div>
            </div>

            {/* Escena: fichas a la izquierda, los dos directores de pie a la derecha, fundidos con la página */}
            <div className="mx-auto mt-6 grid max-w-[1640px] gap-y-8 px-5 sm:px-8 lg:px-14 xl:mt-10 xl:grid-cols-12 xl:gap-x-6 xl:px-20">
                <div data-copy="" className="order-2 xl:order-1 xl:col-span-4 xl:self-center xl:pb-20">
                    <ul>
                        {TEAM.map((person, idx) => (
                            <li key={person.name} className={idx > 0 ? "border-t border-[#d8cfc0]" : ""}>
                                <Link
                                    href={person.href}
                                    data-ficha=""
                                    className="group -mx-3 block rounded-[6px] px-3 py-6 transition-colors hover:bg-[#15120e]/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f5ee] xl:py-7"
                                >
                                    <p data-line="" className="text-[0.8125rem] font-semibold text-[#9f5528]">{person.area}</p>
                                    <p data-line="" className="crc-serif mt-2 text-[clamp(1.5rem,1.9vw,1.9rem)] font-medium leading-[1.1] tracking-[-0.01em] transition-colors group-hover:text-[#9f5528]">
                                        {person.name}
                                    </p>
                                    <p data-line="" className="mt-2 text-[0.9375rem] font-semibold leading-snug text-[#171713]">{person.role}</p>
                                    <p data-line="" className="mt-1 text-[0.8125rem] text-[#6f675d]">{person.credential}</p>
                                    <p data-line="" className="mt-3 max-w-[46ch] text-[0.9375rem] leading-[1.65] text-[#55574f]">{person.text}</p>
                                    <span data-line="" className="mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[#171713]">
                                        {person.cta}
                                        <ArrowRight className="h-4 w-4 text-[#bd6f3c] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* En móvil y tablet: dos retratos lado a lado. En escritorio: la escena con las figuras solapadas por el fondo, no por los cuerpos.
                    La máscara funde los lados y el borde superior de cada foto con la página; abajo también, salvo en escritorio, donde el retrato se apoya en el pie de página. */}
                <div className="relative order-1 grid grid-cols-2 gap-2 xl:order-2 xl:col-span-8 xl:block xl:min-h-[600px] 2xl:min-h-[680px]">
                    {TEAM.map((person, idx) => (
                        <div
                            key={person.name}
                            data-photo=""
                            className={`relative aspect-[3/4] overflow-hidden xl:absolute xl:bottom-0 xl:aspect-[1200/1350] xl:h-[92%] 2xl:h-[96%] ${
                                idx === 0 ? "xl:left-[4%] xl:z-10" : "xl:right-[-6%] xl:z-20"
                            } [mask-composite:intersect] [-webkit-mask-composite:source-in] [mask-image:linear-gradient(to_right,transparent_0%,#000_22%,#000_78%,transparent_100%),linear-gradient(to_bottom,transparent_0%,#000_16%,#000_86%,transparent_100%)] xl:[mask-image:linear-gradient(to_right,transparent_0%,#000_22%,#000_78%,transparent_100%),linear-gradient(to_bottom,transparent_0%,#000_16%)]`}
                        >
                            <div data-photo-inner="" className="absolute inset-0 origin-bottom will-change-transform">
                                <Image
                                    src={person.photo}
                                    alt={`${person.name}, ${person.role}`}
                                    fill
                                    sizes="(max-width: 1279px) 50vw, 40vw"
                                    className="object-cover object-top xl:object-contain xl:object-bottom"
                                    style={{ filter: "saturate(0.96) contrast(1.02)" }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
