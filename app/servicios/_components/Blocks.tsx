import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Linkedin } from "lucide-react";
import { Reveal } from "./Reveal";
import { VALUE_NOTE, type Engagement } from "./engagements";
import type { Person } from "./people";
import {
    body,
    btnPrimary,
    btnPrimaryOnDark,
    btnSecondaryOnDark,
    container,
    h1,
    h2,
    h3,
    label,
    labelMuted,
    labelOnDark,
    lead,
} from "./ui";

/* ------------------------------------------------------------------ */
/* Hero tipográfico con ficha del servicio                             */
/* ------------------------------------------------------------------ */

export type Fact = { term: string; detail: ReactNode };

export function ServiceHero({
    area,
    title,
    intro,
    actions,
    facts,
    factsTitle = "Ficha del servicio",
}: {
    area: string;
    title: ReactNode;
    intro: ReactNode;
    actions?: ReactNode;
    facts: Fact[];
    factsTitle?: string;
}) {
    return (
        <section aria-labelledby="service-title" className="border-b border-[#d8cfc0] bg-[#f8f5ee]">
            <div className={`${container} pb-14 pt-10 sm:pb-20 sm:pt-14`}>
                <nav aria-label="Ruta" className="text-[0.875rem] text-[#6f675d]">
                    <Link href="/servicios" className="underline decoration-[#d8cfc0] underline-offset-4 transition-colors hover:text-[#9f5528]">
                        Servicios
                    </Link>
                    <span aria-hidden="true" className="mx-2 text-[#d8cfc0]">/</span>
                    <span className="text-[#171713]">{area}</span>
                </nav>

                <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16">
                    <div>
                        <h1 id="service-title" className={`${h1} max-w-[22ch] text-[#171713]`}>
                            {title}
                        </h1>
                        <div className={`${lead} mt-6 max-w-[60ch]`}>{intro}</div>
                        {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{actions}</div> : null}
                    </div>

                    <div className="lg:border-l lg:border-[#d8cfc0] lg:pl-10">
                        <p className={labelMuted}>{factsTitle}</p>
                        <dl className="mt-3">
                            {facts.map((fact) => (
                                <div key={fact.term} className="grid gap-1 border-t border-[#d8cfc0] py-3.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4 lg:grid-cols-1 lg:gap-0.5">
                                    <dt className="text-[0.875rem] font-semibold text-[#6f675d]">{fact.term}</dt>
                                    <dd className="text-[0.9375rem] leading-[1.6] text-[#171713]">{fact.detail}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Encabezado de sección                                               */
/* ------------------------------------------------------------------ */

export function SectionHead({
    eyebrow,
    title,
    children,
    id,
    dark = false,
    className = "",
}: {
    eyebrow: string;
    title: ReactNode;
    children?: ReactNode;
    id?: string;
    dark?: boolean;
    className?: string;
}) {
    return (
        <div className={`max-w-[46rem] ${className}`}>
            <p className={dark ? labelOnDark : label}>{eyebrow}</p>
            <h2 id={id} className={`${h2} mt-3 ${dark ? "text-[#fbf7ee]" : "text-[#171713]"}`}>
                {title}
            </h2>
            {children ? (
                <div className={`mt-4 text-[1rem] leading-[1.7] ${dark ? "text-[#ede7dc]/80" : "text-[#55574f]"}`}>{children}</div>
            ) : null}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Compromisos: lista editorial con filetes                            */
/* ------------------------------------------------------------------ */

export function EngagementList({
    engagements,
    id = "compromisos",
    eyebrow = "Compromisos",
    title,
    intro,
    className = "bg-[#fffdf8]",
}: {
    engagements: Engagement[];
    id?: string;
    eyebrow?: string;
    title: ReactNode;
    intro?: ReactNode;
    className?: string;
}) {
    return (
        <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-24 ${className}`}>
            <div className={`${container} py-16 sm:py-24`}>
                <Reveal>
                    <SectionHead eyebrow={eyebrow} title={title} id={`${id}-title`}>
                        {intro}
                    </SectionHead>
                </Reveal>

                <ol className="mt-12 border-b border-[#d8cfc0]">
                    {engagements.map((item, index) => (
                        <li key={item.id} id={item.id} className="scroll-mt-24 border-t border-[#d8cfc0]">
                            <Reveal className="grid gap-7 py-9 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)_minmax(0,0.85fr)] lg:gap-10 lg:py-11">
                                <div>
                                    <p className="text-[0.8125rem] font-semibold tabular-nums text-[#9f5528]">
                                        {String(index + 1).padStart(2, "0")}
                                    </p>
                                    <h3 className={`${h3} mt-2 text-[#171713] sm:text-[1.5rem]`}>{item.name}</h3>
                                    <p className="mt-4 text-[0.9375rem] leading-[1.65] text-[#55574f]">
                                        <span className="font-semibold text-[#171713]">Para quién. </span>
                                        {item.forWhom}
                                    </p>
                                </div>

                                <div>
                                    <p className={labelMuted}>Qué incluye</p>
                                    <ul className="mt-3 space-y-3">
                                        {item.includes.map((point) => (
                                            <li key={point} className="grid grid-cols-[0.875rem_minmax(0,1fr)] gap-2 text-[0.9375rem] leading-[1.6] text-[#171713]">
                                                <span aria-hidden="true" className="mt-[0.7rem] h-px w-2.5 bg-[#bd6f3c]" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <dl className="grid content-start gap-4 border-t border-[#eee8dc] pt-6 text-[0.9375rem] leading-[1.55] lg:border-l lg:border-t-0 lg:border-[#d8cfc0] lg:pl-8 lg:pt-0">
                                    <div>
                                        <dt className={labelMuted}>Entregable</dt>
                                        <dd className="mt-1 text-[#171713]">{item.deliverable}</dd>
                                    </div>
                                    <div>
                                        <dt className={labelMuted}>Duración habitual</dt>
                                        <dd className="mt-1 text-[#171713]">{item.duration}</dd>
                                    </div>
                                    <div>
                                        <dt className={labelMuted}>A cargo</dt>
                                        <dd className="mt-1 text-[#171713]">{item.lead}</dd>
                                    </div>
                                    <div>
                                        <dt className={labelMuted}>Valor</dt>
                                        <dd className="mt-1 font-semibold text-[#9f5528]">{VALUE_NOTE}</dd>
                                    </div>
                                </dl>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

/** Índice compacto de compromisos (para /instituciones): nombre, para quién, entregable y duración. */
export function EngagementIndex({ engagements }: { engagements: Engagement[] }) {
    return (
        <div>
            <div
                aria-hidden="true"
                className="hidden grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.75fr)_1.25rem] gap-8 pb-3 text-[0.8125rem] font-semibold text-[#6f675d] lg:grid"
            >
                <span>Compromiso</span>
                <span>Para quién</span>
                <span>Entregable</span>
                <span>Duración habitual</span>
                <span />
            </div>
            <ol className="border-b border-[#d8cfc0]">
                {engagements.map((item) => (
                    <li key={item.id} className="border-t border-[#d8cfc0]">
                        <Link
                            href={item.areaHref.includes("#") ? item.areaHref : `${item.areaHref}#${item.id}`}
                            className="group grid gap-3 py-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171713] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.75fr)_1.25rem] lg:gap-8 lg:py-7"
                        >
                            <span>
                                <span className="block text-[0.8125rem] font-semibold text-[#9f5528]">{item.area}</span>
                                <span className="crc-serif mt-1 block text-[1.3rem] font-medium leading-[1.2] text-[#171713] transition-colors group-hover:text-[#9f5528]">
                                    {item.name}
                                </span>
                            </span>
                            <span className="text-[0.9375rem] leading-[1.6] text-[#55574f]">
                                <span className="font-semibold text-[#171713] lg:hidden">Para quién. </span>
                                {item.forWhom}
                            </span>
                            <span className="text-[0.9375rem] leading-[1.6] text-[#55574f]">
                                <span className="font-semibold text-[#171713] lg:hidden">Entregable. </span>
                                {item.deliverable}
                            </span>
                            <span className="text-[0.9375rem] leading-[1.6] text-[#171713]">
                                <span className="font-semibold lg:hidden">Duración habitual. </span>
                                {item.duration}
                            </span>
                            <ArrowRight
                                className="hidden h-5 w-5 text-[#9f5528] transition-transform duration-200 group-hover:translate-x-0.5 lg:block"
                                aria-hidden="true"
                            />
                        </Link>
                    </li>
                ))}
            </ol>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Quién está a cargo                                                  */
/* ------------------------------------------------------------------ */

export function PersonInCharge({
    person,
    eyebrow = "Quién está a cargo",
    children,
    cta,
    secondary,
    className = "bg-[#f8f5ee]",
    id,
}: {
    person: Person;
    eyebrow?: string;
    children: ReactNode;
    cta?: { href: string; label: string };
    secondary?: ReactNode;
    className?: string;
    id?: string;
}) {
    return (
        <section id={id} aria-label={`${eyebrow}: ${person.name}`} className={`scroll-mt-24 border-t border-[#d8cfc0] ${className}`}>
            <Reveal className={`${container} grid gap-8 py-16 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-10 sm:py-20 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16`}>
                <div className="relative aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-[6px] bg-white ring-1 ring-[#d8cfc0] sm:max-w-none">
                    <Image
                        src={person.image}
                        alt={person.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 260px, (min-width: 640px) 200px, 240px"
                        className="object-cover object-top"
                    />
                </div>
                <div className="max-w-[44rem]">
                    <p className={label}>{eyebrow}</p>
                    <h2 className={`${h2} mt-3 text-[#171713]`}>{person.name}</h2>
                    <p className="mt-2 text-[0.9375rem] font-semibold text-[#171713]">{person.role}</p>
                    <p className="mt-1 text-[0.875rem] leading-[1.6] text-[#6f675d]">{person.credentials}</p>
                    <div className={`${body} mt-6 space-y-4`}>{children}</div>
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                        {cta ? (
                            <Link href={cta.href} className={btnPrimary}>
                                {cta.label}
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        ) : null}
                        {secondary}
                        {person.linkedin ? (
                            <a
                                href={person.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-semibold text-[#55574f] transition-colors hover:text-[#9f5528]"
                            >
                                <Linkedin className="h-4 w-4" aria-hidden="true" />
                                LinkedIn
                            </a>
                        ) : null}
                    </div>
                </div>
            </Reveal>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Cierre en banda oscura                                              */
/* ------------------------------------------------------------------ */

export function ClosingBand({
    eyebrow,
    title,
    children,
    primary,
    secondary,
}: {
    eyebrow: string;
    title: ReactNode;
    children?: ReactNode;
    primary: { href: string; label: string };
    secondary?: { href: string; label: string; external?: boolean };
}) {
    return (
        <section className="bg-[#15120e] text-[#fbf7ee]">
            <Reveal className={`${container} grid gap-8 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16`}>
                <SectionHead eyebrow={eyebrow} title={title} dark>
                    {children}
                </SectionHead>
                <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                    <Link href={primary.href} className={btnPrimaryOnDark}>
                        {primary.label}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    {secondary ? (
                        secondary.external ? (
                            <a href={secondary.href} target="_blank" rel="noopener noreferrer" className={btnSecondaryOnDark}>
                                {secondary.label}
                                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                        ) : (
                            <Link href={secondary.href} className={btnSecondaryOnDark}>
                                {secondary.label}
                            </Link>
                        )
                    ) : null}
                </div>
            </Reveal>
        </section>
    );
}
