"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { EditorLink } from "@/components/editor/EditorLink";
import { useContent } from "@/lib/editor/hooks";

const HERO_IMAGES = [
    {
        src: "/images/hero_critical.png",
        alt: "Pensamiento Crítico y Filosofía",
        opacity: "opacity-40"
    },
    {
        src: "/images/hero_clinical.png",
        alt: "Diálogo Clínico y Salud Mental",
        opacity: "opacity-50"
    },
    {
        src: "/images/hero_community.png",
        alt: "Complejidad Social y Estrategia",
        opacity: "opacity-40"
    }
];

export function Hero() {
    const [currentImage, setCurrentImage] = useState(0);
    const { get } = useContent();
    const primaryHref = get<string>("hero.primaryCtaHref") ?? "/servicios";
    const secondaryHref = get<string>("hero.secondaryCtaHref") ?? "/pensamiento-critico";

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative flex min-h-[520px] items-center overflow-hidden bg-slate-900 py-16 sm:min-h-[600px] sm:py-24 lg:pb-32 xl:pb-36">
            {/* Background Carousel */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={HERO_IMAGES[currentImage].src}
                            alt={HERO_IMAGES[currentImage].alt}
                            fill
                            sizes="100vw"
                            priority={currentImage === 0}
                            className="object-cover"
                        />
                        {/* Dynamic overlay per image for better text contrast if needed, currently uniform */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/20 mix-blend-multiply" />
                    </motion.div>
                </AnimatePresence>

                {/* Global uniform overlay for consistency */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/20" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="mb-5 inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-red-500/30 backdrop-blur-sm sm:mb-6 sm:text-sm">
                            <EditableText path="hero.badgePrefix" ariaLabel="Hero badge" />{" "}
                            <span className="text-red-400">
                                <EditableText path="hero.badgeHighlight" ariaLabel="Hero badge highlight" />
                            </span>
                        </span>
                        <h1 className="text-[2.5rem] font-bold leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl font-serif">
                            <EditableText path="hero.titleBefore" ariaLabel="Hero título (inicio)" />{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">
                                <EditableText path="hero.titleHighlight" ariaLabel="Hero título (destacado)" />
                            </span>{" "}
                            <EditableText path="hero.titleAfter" ariaLabel="Hero título (final)" />
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 drop-shadow-md sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl">
                            <EditableText path="hero.subtitle" ariaLabel="Hero subtítulo" multiline />
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4"
                    >
                        <EditorLink href={primaryHref}>
                            <Button size="lg" className="w-full rounded-full border border-white/10 bg-primary px-6 py-5 text-base text-white shadow-lg transition-all hover:bg-primary/90 sm:w-auto sm:px-8 sm:py-6 sm:text-lg">
                                <EditableText path="hero.primaryCtaLabel" ariaLabel="Hero CTA principal" />
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </EditorLink>
                        <EditorLink href={secondaryHref}>
                            <Button variant="outline" size="lg" className="w-full rounded-full border-slate-500 px-6 py-5 text-base text-slate-200 backdrop-blur-sm hover:bg-white/10 hover:text-white sm:w-auto sm:px-8 sm:py-6 sm:text-lg">
                                <EditableText path="hero.secondaryCtaLabel" ariaLabel="Hero CTA secundario" />
                            </Button>
                        </EditorLink>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
