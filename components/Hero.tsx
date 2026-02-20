"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { EditorLink } from "@/components/editor/EditorLink";

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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-32 lg:pb-32 xl:pb-36 min-h-[600px] flex items-center">
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
                        <img
                            src={HERO_IMAGES[currentImage].src}
                            alt={HERO_IMAGES[currentImage].alt}
                            className="w-full h-full object-cover"
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
                        <span className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-inset ring-red-500/30 mb-6 backdrop-blur-sm">
                            <EditableText path="hero.badgePrefix" ariaLabel="Hero badge" />{" "}
                            <span className="text-red-400">
                                <EditableText path="hero.badgeHighlight" ariaLabel="Hero badge highlight" />
                            </span>
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-serif leading-tight drop-shadow-lg">
                            <EditableText path="hero.titleBefore" ariaLabel="Hero título (inicio)" />{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">
                                <EditableText path="hero.titleHighlight" ariaLabel="Hero título (destacado)" />
                            </span>{" "}
                            <EditableText path="hero.titleAfter" ariaLabel="Hero título (final)" />
                        </h1>
                        <p className="mt-6 text-xl leading-8 text-slate-200 max-w-2xl drop-shadow-md">
                            <EditableText path="hero.subtitle" ariaLabel="Hero subtítulo" multiline />
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-10 flex flex-col sm:flex-row items-center gap-4"
                    >
                        <EditorLink href={"/servicios"}>
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg transition-all border border-white/10">
                                <EditableText path="hero.primaryCtaLabel" ariaLabel="Hero CTA principal" />
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </EditorLink>
                        <EditorLink href={"/pensamiento-critico"}>
                            <Button variant="outline" size="lg" className="border-slate-500 text-slate-200 hover:bg-white/10 hover:text-white px-8 py-6 text-lg rounded-full backdrop-blur-sm">
                                <EditableText path="hero.secondaryCtaLabel" ariaLabel="Hero CTA secundario" />
                            </Button>
                        </EditorLink>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
