"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { EditorLink } from "@/components/editor/EditorLink";
import { useContent } from "@/lib/editor/hooks";

export function Hero() {
    const { get } = useContent();
    const primaryHref   = get<string>("hero.primaryCtaHref")   ?? "/servicios";
    const secondaryHref = get<string>("hero.secondaryCtaHref") ?? "/pensamiento-critico";

    return (
        <section
            className="relative w-full overflow-hidden bg-[#15120e]"
            style={{ minHeight: "clamp(500px, calc(100svh - 190px), 620px)" }}
        >
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero_crc_library.jpg"
                    alt="Biblioteca y sala de trabajo del Centro de Reflexiones Críticas"
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover object-[58%_45%] saturate-[0.82] contrast-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,14,10,0.96)_0%,rgba(17,14,10,0.87)_26%,rgba(17,14,10,0.52)_54%,rgba(17,14,10,0.18)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,247,242,0.02)_0%,rgba(21,18,14,0.12)_47%,rgba(21,18,14,0.58)_100%)]" />
                <div className="absolute inset-0 bg-[#7c4a26]/15 mix-blend-multiply" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-[1640px] items-center px-5 py-10 sm:px-8 lg:px-14 xl:px-20">
                <div className="max-w-[560px] pt-2">
                    <p className="mb-5 text-[0.66rem] font-extrabold uppercase tracking-[0.22em] text-[#f1ede4]">
                        <EditableText path="hero.badgePrefix" ariaLabel="Hero badge" />
                        <span className="mx-2 text-[#bd6f3c]">·</span>
                        <EditableText path="hero.badgeHighlight" ariaLabel="Hero badge highlight" />
                        <span className="mx-2 text-[#bd6f3c]">·</span>
                        Transformación
                    </p>

                    <h1 className="crc-serif text-[clamp(2.2rem,3.35vw,3.8rem)] font-medium leading-[0.98] tracking-normal text-[#fbf7ee] drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                        <EditableText path="hero.titleBefore" ariaLabel="Hero título (inicio)" />
                        {" "}
                        <span className="italic text-[#bd6f3c]">
                            <EditableText path="hero.titleHighlight" ariaLabel="Hero título (destacado)" />
                        </span>
                        {" "}
                        <EditableText path="hero.titleAfter" ariaLabel="Hero título (final)" />
                    </h1>

                    <div className="my-5 h-px w-14 origin-left bg-[#bd6f3c]" />

                    <p className="max-w-[520px] text-[0.9rem] font-semibold leading-[1.6] text-[#ede7dc]/86">
                        <EditableText path="hero.subtitle" ariaLabel="Hero subtítulo" multiline />
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <EditorLink href={primaryHref}>
                            <button className="inline-flex h-11 items-center gap-3 rounded-[5px] bg-[#bd6f3c] px-6 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-white shadow-[0_18px_40px_rgba(90,45,18,0.32)] transition duration-200 hover:bg-[#a85f31]">
                                <EditableText path="hero.primaryCtaLabel" ariaLabel="Hero CTA principal" />
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </EditorLink>

                        <EditorLink href={secondaryHref}>
                            <button className="inline-flex h-11 items-center rounded-[5px] border border-[#f1ede4]/42 bg-[#15120e]/18 px-6 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur-[2px] transition duration-200 hover:border-[#f1ede4]/72 hover:bg-white/10">
                                <EditableText path="hero.secondaryCtaLabel" ariaLabel="Hero CTA secundario" />
                            </button>
                        </EditorLink>

                        <EditorLink href="/publicaciones">
                            <button className="inline-flex h-11 items-center border-b border-[#bd6f3c] px-1 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-[#f1ede4]/90 transition-colors hover:text-white">
                                Ver Publicaciones
                            </button>
                        </EditorLink>
                    </div>
                </div>
            </div>

            <div className="absolute right-[5vw] top-[45%] z-10 hidden h-[clamp(110px,10vw,170px)] w-[clamp(110px,10vw,170px)] -translate-y-1/2 rounded-full bg-[#f8f5ee]/72 p-3 shadow-[0_16px_42px_rgba(0,0,0,0.22)] backdrop-blur-[1px] lg:block">
                <Image
                    src="/logo-crc.png"
                    alt=""
                    fill
                    sizes="170px"
                    className="pointer-events-none select-none object-contain opacity-90"
                />
            </div>
        </section>
    );
}
