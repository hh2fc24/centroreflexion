"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { EditorLink } from "@/components/editor/EditorLink";
import { useContent } from "@/lib/editor/hooks";

gsap.registerPlugin(useGSAP);

export function Hero() {
    const { get } = useContent();
    const root = useRef<HTMLElement>(null);

    // Entrada del hero en una sola secuencia. Solo corre si la persona no pidió
    // reducir el movimiento; si lo pidió, el hero aparece completo y quieto.
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add("(prefers-reduced-motion: no-preference)", () => {
                const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
                tl.from("[data-hero-video]", { scale: 1.08, duration: 2.4, ease: "power2.out" }, 0)
                    .from("[data-hero-in]", { y: 34, opacity: 0, duration: 1.1, stagger: 0.09 }, 0.15)
                    .from("[data-hero-rule]", { scaleX: 0, duration: 0.9 }, 0.45);
                // Si el navegador congela los cuadros (pestaña en segundo plano,
                // ahorro de batería), el hero no puede quedarse invisible.
                const failSafe = window.setTimeout(() => tl.progress(1), 2600);
                return () => window.clearTimeout(failSafe);
            });
            return () => mm.revert();
        },
        { scope: root }
    );
    const primaryHref   = get<string>("hero.primaryCtaHref")   ?? "/seminarios/desproteccion-infancia";
    const secondaryHref = get<string>("hero.secondaryCtaHref") ?? "/instituciones";

    return (
        <section
            ref={root}
            className="relative w-full overflow-hidden bg-[#15120e]"
            style={{ minHeight: "clamp(440px, calc(100svh - 220px), 620px)" }}
        >
            <div className="absolute inset-0 z-0 bg-black">
                {/* 
                  Estructura para el loop de videos. 
                  Por ahora, pondremos 3 videos de prueba (placeholders). 
                  Cuando tengas los definitivos, se reemplazarán las URLs aquí.
                */}
                <div data-hero-video="" className="absolute inset-0 transition-opacity duration-1000 opacity-100">
                    <video
                        src="https://cdn.pixabay.com/video/2021/08/24/86047-592652150_large.mp4" 
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover object-center saturate-[0.82] contrast-[1.04]"
                    />
                </div>
                
                {/* 
                  Nota técnica: Para hacer un cross-fade real entre 3 videos distintos de forma contínua,
                  se requiere un estado (useState) en React para controlar la opacidad de 3 etiquetas <video> 
                  distintas en secuencia.
                  Para simplificar y evitar problemas de rendimiento/carga en móviles, lo ideal es que 
                  tu editor de video (CapCut, Premiere) exporte los 3 clips unidos en un solo archivo de video en loop.
                  Así, solo necesitamos un único tag <video> que se reproduce infinitamente sin cortes.
                  Por ahora, he puesto un único video de prueba largo que simula el efecto.
                */}

                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,14,10,0.96)_0%,rgba(17,14,10,0.87)_26%,rgba(17,14,10,0.52)_54%,rgba(17,14,10,0.18)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,247,242,0.02)_0%,rgba(21,18,14,0.12)_47%,rgba(21,18,14,0.58)_100%)]" />
                <div className="absolute inset-0 bg-[#7c4a26]/20 mix-blend-multiply" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-[1640px] items-center px-5 py-10 sm:px-8 lg:px-14 xl:px-20">
                <div className="max-w-[980px] pt-2">
                    <p data-hero-in="" className="mb-5 text-[0.66rem] font-extrabold uppercase tracking-[0.22em] text-[#f1ede4]">
                        <EditableText path="hero.badgePrefix" ariaLabel="Hero badge" />
                        <span className="mx-2 text-[#bd6f3c]">·</span>
                        <EditableText path="hero.badgeHighlight" ariaLabel="Hero badge highlight" />
                    </p>

                    <h1 data-hero-in="" className="crc-serif max-w-[30ch] text-[clamp(2.1rem,4vw,4.2rem)] font-medium leading-[1] tracking-[-0.018em] text-[#fbf7ee] text-balance drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                        <EditableText path="hero.titleBefore" ariaLabel="Hero título (inicio)" />
                        {" "}
                        <span className="italic text-[#bd6f3c]">
                            <EditableText path="hero.titleHighlight" ariaLabel="Hero título (destacado)" />
                        </span>
                        {" "}
                        <EditableText path="hero.titleAfter" ariaLabel="Hero título (final)" />
                    </h1>

                    <div data-hero-rule="" className="my-6 h-px w-14 origin-left bg-[#bd6f3c]" />

                    <p data-hero-in="" className="max-w-[56ch] text-[0.95rem] font-medium leading-[1.65] text-[#ede7dc]/86">
                        <EditableText path="hero.subtitle" ariaLabel="Hero subtítulo" multiline />
                    </p>

                    <div data-hero-in="" className="mt-7 flex flex-wrap items-center gap-3">
                        <EditorLink href={primaryHref}>
                            <button className="inline-flex h-11 items-center gap-3 rounded-[5px] bg-[#bd6f3c] px-6 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-white shadow-[0_18px_40px_rgba(90,45,18,0.32)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#a85f31] active:translate-y-0">
                                <EditableText path="hero.primaryCtaLabel" ariaLabel="Hero CTA principal" />
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </EditorLink>

                        <EditorLink href={secondaryHref}>
                            <button className="inline-flex h-11 items-center rounded-[5px] border border-[#f1ede4]/42 bg-[#15120e]/18 px-6 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur-[2px] transition duration-200 hover:border-[#f1ede4]/72 hover:bg-white/10">
                                <EditableText path="hero.secondaryCtaLabel" ariaLabel="Hero CTA secundario" />
                            </button>
                        </EditorLink>

                    </div>

                    {/* Prueba de autoridad bajo los botones: lo que respalda la promesa del título. */}
                    <p data-hero-in="" className="mt-8 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#f1ede4]/18 pt-4 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#f1ede4]/78">
                        <EditorLink href="/publicaciones" className="transition-colors hover:text-white">3 libros · Editorial Hammurabi</EditorLink>
                        <span aria-hidden="true" className="text-[#bd6f3c]">·</span>
                        <span>16 años en programas de infancia</span>
                        <span aria-hidden="true" className="text-[#bd6f3c]">·</span>
                        <span>Docencia universitaria</span>
                    </p>
                </div>
            </div>

        </section>
    );
}
