"use client";

import { ArrowRight } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { EditorLink } from "@/components/editor/EditorLink";
import { useContent } from "@/lib/editor/hooks";

/**
 * Hero de portada: tipográfico sobre tinta, sin video ni animación de
 * entrada. Los textos vienen del CMS (EditableText) para que el equipo los
 * edite desde el panel.
 */
export function Hero() {
    const { get } = useContent();
    const primaryHref = get<string>("hero.primaryCtaHref") ?? "/seminarios/desproteccion-infancia";
    const secondaryHref = get<string>("hero.secondaryCtaHref") ?? "/instituciones";

    return (
        <section className="relative w-full bg-[#15120e] text-[#fbf7ee]">
            <div className="mx-auto max-w-[1640px] px-5 pb-10 pt-14 sm:px-8 sm:pb-12 sm:pt-20 lg:px-14 lg:pt-24 xl:px-20">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-14">
                    <div className="lg:col-span-7">
                        <p className="text-[0.8125rem] font-semibold text-[#e4935d]">
                            <EditableText path="hero.badgePrefix" ariaLabel="Hero badge" />
                            <span aria-hidden="true" className="mx-1.5 text-[#ede7dc]/50">·</span>
                            <EditableText path="hero.badgeHighlight" ariaLabel="Hero badge highlight" />
                        </p>

                        <h1 className="crc-serif mt-5 max-w-[30ch] text-[clamp(2rem,3.2vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] text-balance">
                            <EditableText path="hero.titleBefore" ariaLabel="Hero título (inicio)" />{" "}
                            <span className="text-[#e4935d]">
                                <EditableText path="hero.titleHighlight" ariaLabel="Hero título (destacado)" />
                            </span>{" "}
                            <EditableText path="hero.titleAfter" ariaLabel="Hero título (final)" />
                        </h1>
                    </div>

                    <div className="lg:col-span-5 lg:pb-1">
                        <p className="max-w-[52ch] text-[1.0625rem] leading-[1.7] text-[#ede7dc]/85">
                            <EditableText path="hero.subtitle" ariaLabel="Hero subtítulo" multiline />
                        </p>

                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <EditorLink
                                href={primaryHref}
                                className="group inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fbf7ee] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15120e]"
                            >
                                <EditableText path="hero.primaryCtaLabel" ariaLabel="Hero CTA principal" />
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                            </EditorLink>

                            <EditorLink
                                href={secondaryHref}
                                className="inline-flex min-h-11 items-center rounded-[6px] border border-[#fbf7ee]/45 px-5 py-2.5 text-[0.9375rem] font-semibold text-[#fbf7ee] transition-colors hover:border-[#fbf7ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fbf7ee] focus-visible:ring-offset-2 focus-visible:ring-offset-[#15120e]"
                            >
                                <EditableText path="hero.secondaryCtaLabel" ariaLabel="Hero CTA secundario" />
                            </EditorLink>
                        </div>
                    </div>
                </div>

                {/* Respaldo de la promesa del título. */}
                <p className="mt-12 flex flex-col gap-x-3 gap-y-1 border-t border-white/15 pt-5 text-[0.875rem] text-[#ede7dc]/75 sm:mt-16 sm:flex-row sm:flex-wrap">
                    <EditorLink href="/publicaciones" className="self-start underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-[#e4935d]">
                        3 libros · Editorial Hammurabi
                    </EditorLink>
                    <span aria-hidden="true" className="hidden text-[#e4935d] sm:inline">·</span>
                    <span>16 años en programas de infancia</span>
                    <span aria-hidden="true" className="hidden text-[#e4935d] sm:inline">·</span>
                    <span>Docencia universitaria</span>
                </p>
            </div>
        </section>
    );
}
