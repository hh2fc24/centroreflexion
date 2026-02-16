"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Hero() {
    const [currentVideo, setCurrentVideo] = useState(0);
    const videos = ["/111.mp4", "/222.mp4"];
    const videoRef = useRef<HTMLVideoElement>(null);

    // Auto-play ensuring
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.error("Autoplay prevented:", e));
        }
    }, [currentVideo]);

    return (
        <section className="relative overflow-hidden bg-gray-900 py-32 sm:py-48 lg:pb-48 xl:pb-52 min-h-[90vh] flex items-center">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentVideo}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0"
                    >
                        <video
                            ref={videoRef}
                            src={videos[currentVideo]}
                            autoPlay
                            muted
                            loop={false}
                            playsInline
                            className="h-full w-full object-cover opacity-60"
                            onEnded={() => setCurrentVideo((prev) => (prev + 1) % videos.length)}
                        />
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                <div className="max-w-3xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
                    >
                        Centro de Reflexiones <span className="text-blue-400">Críticas</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-6 text-lg leading-8 text-gray-300"
                    >
                        Un espacio dedicado al pensamiento crítico, la literatura, la cultura y las ciencias sociales.
                        Explora nuestras columnas de opinión y análisis profundos donde la academia se encuentra con la realidad.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-10 flex flex-col sm:flex-row items-center gap-y-4 gap-x-6 sm:justify-start justify-center"
                    >
                        <Link href="/columnas">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white border-transparent">
                                Leer Columnas
                            </Button>
                        </Link>
                        <Link href="/conocenos">
                            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10 hover:text-white">
                                Quiénes Somos
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
