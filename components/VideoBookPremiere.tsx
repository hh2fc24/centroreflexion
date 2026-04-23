"use client";

import { MotionDiv } from "@/components/ui/Motion";
import { ArrowRight, BookOpen, Clapperboard, Sparkles } from "lucide-react";

const BOOK_URL =
    "https://www.editorialhammurabi.com/shop/colecciones-hammurabi/tecnocratas-de-la-infancia/";

export function VideoBookPremiere() {
    return (
        <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[2rem] border border-slate-800/70 bg-slate-950 text-white shadow-[0_30px_100px_-40px_rgba(15,23,42,0.9)]"
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.14),transparent_28%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#020617_100%)]" />
                <div
                    className="absolute inset-y-0 right-0 hidden w-1/2 opacity-20 lg:block"
                    style={{
                        backgroundImage: "url('/images/tecnocratas_abstract_1771965880554.png')",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                />
            </div>

            <div className="relative z-10 grid gap-10 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,420px)] lg:items-center lg:gap-14 lg:px-12 lg:py-12">
                <div className="text-left">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-sm">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                        Último lanzamiento editorial
                    </div>

                    <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl font-serif">
                        Tecnócratas de la Infancia
                    </h2>
                    <p className="mt-3 max-w-2xl text-lg text-slate-300 sm:text-xl">
                        Desprotección y neoliberalismo en Chile
                    </p>
                    <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                        Juan Carlos Rauld examina la racionalidad tecnocrática que administra la infancia pobre en Chile y muestra
                        cómo la desprotección opera como una consecuencia estructural del orden neoliberal.
                    </p>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                        El libro articula una crítica genealógica de la institucionalización, el sufrimiento infantil y las lógicas
                        de gestión que han normalizado la violencia estatal sobre niños, niñas y adolescentes.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2">
                            <BookOpen className="h-4 w-4 text-cyan-300" />
                            Juan Carlos Rauld
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2">
                            <Clapperboard className="h-4 w-4 text-amber-300" />
                            Pieza editorial
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2">
                            <Sparkles className="h-4 w-4 text-emerald-300" />2 min 05 s
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a
                            href={BOOK_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5"
                        >
                            Comprar aquí
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                        <a
                            href="#catalogo-editorial"
                            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition-colors duration-300 hover:border-white/20 hover:bg-white/8 hover:text-white"
                        >
                            Explorar publicaciones
                        </a>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-400">
                        Disponible en Editorial Hammurabi.
                    </p>
                </div>

                <MotionDiv
                    initial={{ opacity: 0, scale: 0.96, y: 24 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="relative mx-auto w-full max-w-[360px]"
                >
                    <div className="absolute inset-x-6 bottom-0 h-20 rounded-full bg-cyan-400/15 blur-3xl" />
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900 p-3 shadow-[0_25px_90px_-45px_rgba(34,211,238,0.7)]">
                        <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.16em] text-slate-400">
                            <span>Presentación editorial</span>
                            <span>Lanzamiento 2026</span>
                        </div>
                        <div className="relative overflow-hidden rounded-[1.25rem] border border-white/8 bg-black">
                            <video
                                className="aspect-[9/16] w-full bg-black object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                poster="/images/tecnocratas_abstract_1771965880554.png"
                                aria-label="Presentación audiovisual del libro Tecnócratas de la Infancia"
                            >
                                <source src="/videos/tecnocratas-lanzamiento.mp4" type="video/mp4" />
                                Tu navegador no soporta el elemento de video.
                            </video>
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/28 via-black/6 to-transparent" />
                        </div>
                        <div className="mt-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-300">
                            Registro audiovisual que acompaña la aparición de la obra y su apertura en la sección editorial.
                        </div>
                    </div>
                </MotionDiv>
            </div>
        </MotionDiv>
    );
}
