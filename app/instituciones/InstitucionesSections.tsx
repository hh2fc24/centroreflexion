"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, CalendarCheck, Linkedin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { books } from "@/lib/books";
import { InstitucionesContactForm, InstitucionesWhatsAppLink } from "./InstitucionesContact";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Secciones de /instituciones. Igual que la portada: todo el movimiento vive
 * dentro de gsap.matchMedia con "prefers-reduced-motion: no-preference", así
 * que quien pide menos movimiento ve la página completa y quieta.
 */
const MOTION_OK = "(prefers-reduced-motion: no-preference)";

const GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

function Grain({ className = "opacity-[0.06] mix-blend-multiply" }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${className}`}
            style={{ backgroundImage: GRAIN }}
        />
    );
}

const HUGO_PHOTO = "/images/hugo-hormazabal-crc-2026-large.png";
const HUGO_LINKEDIN = "https://www.linkedin.com/in/hugo-felipe-hormazabal-561005332/";
const HUGO_TITLE = "Socio · Director Comercial y de Desarrollo Institucional";

const eyebrow = "text-[0.66rem] font-extrabold uppercase tracking-[0.22em]";
const sectionTitle =
    "crc-serif mt-4 text-[clamp(2.3rem,4.4vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.02em] text-balance";
const container = "relative mx-auto max-w-[1640px] px-5 sm:px-8 lg:px-14 xl:px-20";

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const AUDIENCES = [
    "Direcciones de colegios y sostenedores",
    "Programas PIE, PRM, PPF, DAM y OPD",
    "Oficinas locales de niñez",
    "Fundaciones y ONG de infancia",
    "Municipios",
];

function Hero() {
    const root = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.from("[data-hero-item]", {
                    y: 44,
                    opacity: 0,
                    duration: 1.2,
                    stagger: 0.09,
                    ease: "expo.out",
                });
                gsap.from("[data-hero-audience]", {
                    x: -18,
                    opacity: 0,
                    duration: 0.9,
                    stagger: 0.06,
                    delay: 0.45,
                    ease: "expo.out",
                });
            });
            return () => mm.revert();
        },
        { scope: root }
    );

    return (
        <section ref={root} aria-labelledby="inst-hero-title" className="relative overflow-hidden border-b border-[#d8cfc0] bg-[#f8f5ee]">
            <Grain />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#bd6f3c]/10 blur-[140px]"
            />
            <div className={`${container} grid gap-14 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)] lg:items-end lg:gap-20`}>
                <div>
                    <p data-hero-item="" className={`${eyebrow} text-[#9f5528]`}>Para instituciones</p>
                    <h1
                        id="inst-hero-title"
                        data-hero-item=""
                        className="crc-serif mt-5 max-w-[20ch] text-[clamp(2.7rem,6.2vw,6rem)] font-medium leading-[0.95] tracking-[-0.025em] text-[#171713] text-balance"
                    >
                        Criterio experto para decisiones <span className="italic text-[#9f5528]">difíciles</span> sobre infancia
                    </h1>
                    <p data-hero-item="" className="mt-7 max-w-[58ch] text-[1.02rem] leading-[1.75] text-[#55574f] sm:text-[1.1rem]">
                        Hay decisiones en que la ley, el caso y la institución empujan hacia lados distintos. Ayudamos a
                        colegios, programas de protección, fundaciones y municipios a decidir con fundamento y a dejarlo registrado.
                    </p>
                    <div data-hero-item="" className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                        <a
                            href="#agenda"
                            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-[6px] bg-[#bd6f3c] px-7 py-3.5 text-[0.74rem] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_24px_50px_-22px_rgba(189,111,60,0.75)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#9f5528] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f5ee] active:translate-y-0"
                        >
                            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                            Agenda 20 minutos con Hugo
                        </a>
                        <a
                            href="#como-trabajamos"
                            className="group inline-flex min-h-12 items-center justify-center gap-2 border-b border-[#bd6f3c] px-1 py-3 text-[0.74rem] font-extrabold uppercase tracking-[0.14em] text-[#171713] transition-colors hover:text-[#9f5528]"
                        >
                            Ver cómo trabajamos
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                        </a>
                    </div>
                </div>

                <div className="border-t border-[#d8cfc0] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <p className={`${eyebrow} text-[#6f675d]`}>Con quién trabajamos</p>
                    <ul className="mt-4">
                        {AUDIENCES.map((item) => (
                            <li
                                key={item}
                                data-hero-audience=""
                                className="crc-serif border-b border-[#d8cfc0]/80 py-3 text-[1.3rem] font-medium leading-tight text-[#171713] last:border-b-0"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Oferta: lista editorial con imagen que crece al pasar el cursor     */
/* ------------------------------------------------------------------ */

const OFFERS = [
    {
        who: "Colegios y sostenedores",
        title: "Compliance escolar · Ley 21.809",
        text: "Revisamos protocolos, registros y rutas de decisión frente a acoso, violencia y discriminación, para que el colegio pueda demostrar que actuó a tiempo.",
        href: "/servicios/compliance-escolar",
        cta: "Ver compliance escolar",
        image: "/images/bienestar-escolar/hero-proteccion-institucional.png",
    },
    {
        who: "Equipos de intervención y educación",
        title: "Formación para equipos",
        text: "Capacitación en crisis, supervisión de casos y el seminario Desprotección de la infancia en formato cerrado para un solo equipo, con fechas propias.",
        href: "/servicios/formacion",
        cta: "Ver formación",
        image: "/images/desproteccion-institucionalizacion-editorial.png",
    },
    {
        who: "Programas, fundaciones y municipios",
        title: "Consultoría de programas",
        text: "Diagnóstico y mejora de modelos de intervención: criterios de decisión, procesos, registros e indicadores que el equipo pueda sostener.",
        href: "/servicios/consultoria",
        cta: "Ver consultoría",
        image: "/images/consultoria_arquitectura_editorial.png",
    },
];

function Offers() {
    const root = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.from("[data-offers-head]", {
                    y: 36,
                    opacity: 0,
                    duration: 1.1,
                    ease: "expo.out",
                    scrollTrigger: { trigger: "[data-offers-head]", start: "top 85%", once: true },
                });
                gsap.utils.toArray<HTMLElement>("[data-offer]").forEach((row) => {
                    gsap.from(row, {
                        y: 56,
                        opacity: 0,
                        duration: 1.05,
                        ease: "expo.out",
                        scrollTrigger: { trigger: row, start: "top 88%", once: true },
                    });
                });
            });
            return () => mm.revert();
        },
        { scope: root }
    );

    return (
        <section ref={root} aria-labelledby="inst-oferta-title" className="relative bg-[#fffdf8]">
            <div className={`${container} pb-20 pt-20 sm:pb-28 sm:pt-28`}>
                <div data-offers-head="" className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className={`${eyebrow} text-[#9f5528]`}>Qué hacemos</p>
                        <h2 id="inst-oferta-title" className={`${sectionTitle} max-w-[16ch] text-[#171713]`}>
                            Tres formas de trabajar con tu <span className="italic text-[#9f5528]">institución</span>
                        </h2>
                    </div>
                    <p className="max-w-[44ch] text-[0.98rem] leading-[1.7] text-[#55574f]">
                        Se pueden contratar por separado. Lo habitual es partir por un diagnóstico y definir juntos qué conviene.
                    </p>
                </div>

                <ul className="mt-14 border-t border-[#d8cfc0]">
                    {OFFERS.map((offer) => (
                        <li key={offer.href} data-offer="" className="border-b border-[#d8cfc0]">
                            <Link
                                href={offer.href}
                                className="group grid gap-6 py-8 transition-[background-color,padding] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] active:bg-[#f8f5ee] sm:py-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_220px] md:items-center md:gap-10 lg:hover:bg-[#f8f5ee] lg:hover:px-6"
                            >
                                <div>
                                    <p className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#6f675d]">{offer.who}</p>
                                    <h3 className="crc-serif mt-3 text-[clamp(1.9rem,3.2vw,3rem)] font-medium leading-[1.02] tracking-[-0.015em] text-[#171713] transition-colors duration-300 group-hover:text-[#9f5528]">
                                        {offer.title}
                                    </h3>
                                </div>
                                <div>
                                    <p className="max-w-[52ch] text-[0.96rem] leading-[1.7] text-[#55574f]">{offer.text}</p>
                                    <span className="mt-5 inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-[#9f5528]">
                                        {offer.cta}
                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
                                    </span>
                                </div>
                                <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[8px] bg-[#eee8dc] md:block">
                                    <Image
                                        src={offer.image}
                                        alt=""
                                        fill
                                        sizes="220px"
                                        className="object-cover object-center grayscale-[0.35] saturate-[0.8] transition-[transform,filter] duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
                                    />
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Cómo trabajamos: línea de progreso con scrub                        */
/* ------------------------------------------------------------------ */

const STEPS = [
    {
        name: "Diagnóstico",
        text: "Conversamos con la dirección y el equipo, revisamos documentos, registros y algunos casos tipo.",
        receives: "Un informe breve con brechas, riesgos y prioridades.",
        duration: "Habitualmente 2 a 3 semanas",
    },
    {
        name: "Propuesta",
        text: "Convertimos el diagnóstico en un plan con alcance, responsables, entregables y costo.",
        receives: "Propuesta técnica y económica con cronograma.",
        duration: "Habitualmente 1 semana",
    },
    {
        name: "Implementación",
        text: "Formación, supervisión, ajuste de protocolos o acompañamiento de casos, según lo acordado.",
        receives: "Sesiones realizadas, documentos ajustados y registro de lo trabajado.",
        duration: "Habitualmente entre 1 y 4 meses, según el alcance",
    },
    {
        name: "Medición",
        text: "Volvemos a los indicadores del diagnóstico para ver qué cambió y qué falta.",
        receives: "Informe de cierre con resultados y recomendaciones.",
        duration: "Habitualmente 2 semanas al cierre",
    },
];

function Process() {
    const root = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.fromTo(
                    "[data-step-progress]",
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: "[data-step-list]",
                            start: "top 65%",
                            end: "bottom 60%",
                            scrub: true,
                        },
                    }
                );
                gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
                    gsap.from(step, {
                        y: 48,
                        opacity: 0,
                        duration: 1.05,
                        ease: "expo.out",
                        scrollTrigger: {
                            trigger: step,
                            start: "top 84%",
                            once: true,
                        },
                    });
                    // El punto del paso se enciende cuando la línea lo alcanza.
                    ScrollTrigger.create({
                        trigger: step,
                        start: "top 62%",
                        onEnter: () => step.setAttribute("data-active", "true"),
                        onLeaveBack: () => step.removeAttribute("data-active"),
                    });
                });
                gsap.from("[data-process-sign]", {
                    y: 30,
                    opacity: 0,
                    duration: 1.1,
                    ease: "expo.out",
                    scrollTrigger: { trigger: "[data-process-sign]", start: "top 88%", once: true },
                });
            });
            return () => mm.revert();
        },
        { scope: root }
    );

    return (
        <section
            id="como-trabajamos"
            ref={root}
            aria-labelledby="inst-proceso-title"
            className="relative scroll-mt-24 overflow-hidden bg-[#15120e] text-[#fbf7ee]"
        >
            <Grain className="opacity-[0.09] mix-blend-screen" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-[#bd6f3c]/16 blur-[140px]"
            />
            <div className={`${container} grid gap-14 py-24 sm:py-32 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20`}>
                <div className="lg:sticky lg:top-32 lg:self-start">
                    <p className={`${eyebrow} text-[#e4935d]`}>Cómo trabajamos</p>
                    <h2 id="inst-proceso-title" className={`${sectionTitle} max-w-[14ch]`}>
                        Cuatro pasos, un <span className="italic text-[#e4935d]">entregable</span> en cada uno
                    </h2>
                    <p className="mt-6 max-w-[44ch] text-[0.98rem] leading-[1.7] text-[#ede7dc]/75">
                        Los plazos son los habituales para un colegio o un programa. Se ajustan al tamaño de la institución y a lo
                        que se acuerde en la propuesta.
                    </p>
                </div>

                <div>
                    <div data-step-list="" className="relative">
                        <span aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-white/15" />
                        <span
                            aria-hidden="true"
                            data-step-progress=""
                            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-[#e4935d]"
                        />
                        <ol className="grid gap-12 sm:gap-16">
                            {STEPS.map((step) => (
                                <li key={step.name} data-step="" className="group/step relative pl-10 sm:pl-14">
                                    <span
                                        aria-hidden="true"
                                        className="absolute left-0 top-3 h-[15px] w-[15px] rounded-full border border-white/35 bg-[#15120e] transition-[background-color,border-color,box-shadow] duration-500 group-data-[active=true]/step:border-[#e4935d] group-data-[active=true]/step:bg-[#e4935d] group-data-[active=true]/step:shadow-[0_0_0_6px_rgba(228,147,93,0.18)] motion-reduce:border-[#e4935d] motion-reduce:bg-[#e4935d]"
                                    />
                                    <h3 className="crc-serif text-[clamp(2rem,3.4vw,3.2rem)] font-medium leading-none tracking-[-0.015em]">
                                        {step.name}
                                    </h3>
                                    <p className="mt-4 max-w-[54ch] text-[0.98rem] leading-[1.7] text-[#ede7dc]/80">{step.text}</p>
                                    <div className="mt-6 max-w-[54ch] border-t border-white/12 pt-5">
                                        <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#ede7dc]/55">Qué recibe la institución</p>
                                        <p className="mt-2 text-[0.98rem] leading-[1.6] text-white">{step.receives}</p>
                                        <p className="mt-4 inline-flex w-fit rounded-full border border-[#e4935d]/40 px-3 py-1.5 text-[0.68rem] font-bold text-[#e4935d]">
                                            {step.duration}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <figure data-process-sign="" className="relative mt-16 border-t border-white/12 pt-8 sm:ml-14">
                        <blockquote className="crc-serif max-w-[30ch] text-[1.45rem] italic leading-[1.3] text-[#fbf7ee]">
                            “Coordino este proceso de principio a fin: el alcance, los plazos, el contrato y la medición. Si algo no
                            está funcionando, me lo dicen a mí.”
                        </blockquote>
                        <figcaption className="mt-6 flex items-center gap-4">
                            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#f8f5ee]">
                                <Image src={HUGO_PHOTO} alt="" fill sizes="56px" className="object-cover object-top" />
                            </span>
                            <span>
                                <span className="block text-[0.95rem] font-semibold text-white">Hugo Felipe Hormazábal</span>
                                <span className="mt-0.5 block text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#e4935d]">{HUGO_TITLE}</span>
                            </span>
                        </figcaption>
                    </figure>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Respaldo                                                            */
/* ------------------------------------------------------------------ */

// Del más reciente al más antiguo.
const BOOKS = [...books].sort((a, b) => Number(b.year) - Number(a.year));

function Proof() {
    const root = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.from("[data-proof-item]", {
                    y: 40,
                    opacity: 0,
                    duration: 1.05,
                    stagger: 0.1,
                    ease: "expo.out",
                    scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
                });
                gsap.fromTo(
                    "[data-proof-portrait]",
                    { clipPath: "inset(14% 14% 14% 14% round 10px)" },
                    {
                        clipPath: "inset(0% 0% 0% 0% round 10px)",
                        ease: "none",
                        scrollTrigger: { trigger: "[data-proof-portrait]", start: "top 90%", end: "top 40%", scrub: 0.8 },
                    }
                );
            });
            return () => mm.revert();
        },
        { scope: root }
    );

    return (
        <section ref={root} aria-labelledby="inst-respaldo-title" className="relative overflow-hidden border-b border-[#d8cfc0] bg-[#f8f5ee]">
            <Grain />
            <div className={`${container} py-20 sm:py-28`}>
                <div data-proof-item="">
                    <p className={`${eyebrow} text-[#9f5528]`}>Respaldo</p>
                    <h2 id="inst-respaldo-title" className={`${sectionTitle} max-w-[18ch] text-[#171713]`}>
                        Quiénes están detrás del <span className="italic text-[#9f5528]">criterio</span>
                    </h2>
                </div>

                <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-16">
                    <div data-proof-portrait="" className="group relative aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[10px] bg-[#eee8dc]">
                        <Image
                            src="/images/juan-carlos-rauld-retrato.jpg"
                            alt="Juan Carlos Rauld, director del CRC"
                            fill
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(21,18,14,0.85))] p-6 pt-20">
                            <p className="crc-serif text-[1.7rem] font-medium leading-tight text-white">Juan Carlos Rauld</p>
                            <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#e4935d]">Director del CRC</p>
                        </div>
                    </div>

                    <div>
                        <p data-proof-item="" className="crc-serif max-w-[30ch] text-[clamp(1.5rem,2.2vw,2.1rem)] leading-[1.25] text-[#171713]">
                            Trabajador social con 16 años dirigiendo programas de infancia y gestión pública en Chile, y autor de tres libros con
                            Editorial Hammurabi.
                        </p>

                        <ul data-proof-item="" className="mt-10 border-t border-[#d8cfc0]">
                            {BOOKS.map((book) => (
                                <li key={book.title} className="border-b border-[#d8cfc0]">
                                    <a
                                        href={book.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-5 transition-colors hover:text-[#9f5528] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713]"
                                    >
                                        <span>
                                            <span className="crc-serif block text-[1.45rem] font-medium leading-tight text-[#171713] transition-colors group-hover:text-[#9f5528]">
                                                {book.title}
                                            </span>
                                            <span className="crc-serif mt-1 block text-[1.02rem] italic text-[#55574f]">{book.subtitle}</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-extrabold tracking-[0.12em] text-[#9f5528]">
                                            {book.year}
                                            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div data-proof-item="" className="mt-12 grid gap-8 sm:grid-cols-2">
                            <div className="flex items-start gap-4">
                                <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[6px] bg-[#eee8dc]">
                                    <Image src="/images/rocio-solar-crc-2026.png" alt="Rocío Solar" fill sizes="64px" className="object-cover object-top" />
                                </span>
                                <span>
                                    <span className="crc-serif block text-[1.35rem] font-medium leading-tight text-[#171713]">Rocío Solar</span>
                                    <span className="mt-1 block text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#9f5528]">Terapeuta ocupacional</span>
                                    <span className="mt-2 block text-[0.92rem] leading-[1.6] text-[#55574f]">
                                        Práctica clínica con niños, niñas, adolescentes y sus familias en salud mental infanto-juvenil.
                                    </span>
                                </span>
                            </div>
                            <div className="border-l-2 border-[#bd6f3c] pl-5">
                                <span className="block text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#6f675d]">Lo que ya dicen los tribunales</span>
                                <span className="mt-2 block text-[0.92rem] leading-[1.6] text-[#55574f]">
                                    Fallos recientes condenan a colegios que tenían protocolo pero no lo aplicaron a tiempo. Tener el documento no basta.
                                </span>
                                <Link
                                    href="/servicios/compliance-escolar"
                                    className="group mt-3 inline-flex items-center gap-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-[#9f5528] hover:text-[#bd6f3c]"
                                >
                                    Ver los fallos
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Agenda                                                              */
/* ------------------------------------------------------------------ */

function Agenda() {
    const root = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                gsap.from("[data-agenda-item]", {
                    y: 40,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: "expo.out",
                    scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
                });
                gsap.fromTo(
                    "[data-agenda-portrait]",
                    { clipPath: "inset(16% 16% 16% 16% round 12px)" },
                    {
                        clipPath: "inset(0% 0% 0% 0% round 12px)",
                        ease: "none",
                        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 35%", scrub: 0.8 },
                    }
                );
            });
            return () => mm.revert();
        },
        { scope: root }
    );

    return (
        <section id="agenda" ref={root} aria-labelledby="inst-agenda-title" className="relative scroll-mt-24 overflow-hidden bg-[#fffdf8]">
            <div className={`${container} grid gap-12 py-20 sm:py-28 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20`}>
                <div>
                    <p data-agenda-item="" className={`${eyebrow} text-[#9f5528]`}>Agenda</p>
                    <h2 id="inst-agenda-title" data-agenda-item="" className={`${sectionTitle} max-w-[14ch] text-[#171713]`}>
                        20 minutos para ver si podemos <span className="italic text-[#9f5528]">ayudar</span>
                    </h2>

                    <div className="mt-10 grid grid-cols-[112px_minmax(0,1fr)] items-end gap-5 sm:grid-cols-[160px_minmax(0,1fr)]">
                        <div data-agenda-portrait="" className="relative aspect-[3/4] overflow-hidden rounded-[12px] bg-[#f8f5ee] ring-1 ring-[#d8cfc0]">
                            <Image src={HUGO_PHOTO} alt="Hugo Felipe Hormazábal" fill sizes="(max-width: 640px) 112px, 160px" className="object-cover object-top" />
                        </div>
                        <div data-agenda-item="">
                            <p className="crc-serif text-[1.6rem] font-medium leading-tight text-[#171713]">Hugo Felipe Hormazábal</p>
                            <p className="mt-1.5 text-[0.6rem] font-bold uppercase leading-5 tracking-[0.16em] text-[#9f5528]">{HUGO_TITLE}</p>
                            <a
                                href={HUGO_LINKEDIN}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#55574f] transition-colors hover:text-[#bd6f3c]"
                            >
                                <Linkedin className="h-4 w-4" aria-hidden="true" />
                                LinkedIn
                            </a>
                        </div>
                    </div>

                    <p data-agenda-item="" className="crc-serif mt-8 max-w-[34ch] text-[1.35rem] italic leading-[1.4] text-[#171713]">
                        “Soy quien conversa con las instituciones sobre implementación, medición y contratos. En 20 minutos entiendo qué
                        necesitan y les digo con franqueza si el CRC es la ayuda correcta.”
                    </p>

                    <div data-agenda-item="" className="mt-8">
                        <InstitucionesWhatsAppLink />
                    </div>
                </div>

                <div data-agenda-item="" className="rounded-[10px] border border-[#d8cfc0] bg-[#f8f5ee] p-5 shadow-[0_40px_80px_-50px_rgba(60,36,18,0.4)] sm:p-8">
                    <InstitucionesContactForm />
                </div>
            </div>
        </section>
    );
}

export function InstitucionesSections() {
    return (
        <>
            <Hero />
            <Offers />
            <Process />
            <Proof />
            <Agenda />
        </>
    );
}
