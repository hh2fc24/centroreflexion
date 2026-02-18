"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 ring-1 ring-inset ring-blue-500/20 mb-6 backdrop-blur-sm">
                            Centro de Reflexiones Críticas
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-serif leading-tight drop-shadow-lg">
                            Pensamiento crítico para intervenir en la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">complejidad social contemporánea.</span>
                        </h1>
                        <p className="mt-6 text-xl leading-8 text-slate-200 max-w-2xl drop-shadow-md">
                            Producción editorial, atención clínica y consultoría estratégica en salud mental, infancia y educación.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-10 flex flex-col sm:flex-row items-center gap-4"
                    >
                        <Link href="/servicios">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-blue-500/25 transition-all border border-blue-400/20">
                                Conocer Servicios
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/columnas">
                            <Button variant="outline" size="lg" className="border-slate-500 text-slate-200 hover:bg-white/10 hover:text-white px-8 py-6 text-lg rounded-full backdrop-blur-sm">
                                Leer Columnas
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
