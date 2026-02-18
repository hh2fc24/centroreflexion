"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-white py-20 sm:py-32 lg:pb-32 xl:pb-36">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl font-serif leading-tight">
                            Pensamiento crítico para intervenir en la <span className="text-blue-600">complejidad social contemporánea.</span>
                        </h1>
                        <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl">
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
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                                Conocer Servicios
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/columnas">
                            <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg rounded-full">
                                Leer Columnas
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -z-10 opacity-30 blur-3xl overflow-hidden pointer-events-none">
                <div className="relative w-[50rem] h-[50rem] bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            </div>
            <div className="absolute bottom-0 left-0 -z-10 opacity-30 blur-3xl overflow-hidden pointer-events-none">
                <div className="relative w-[50rem] h-[50rem] bg-gradient-to-tr from-gray-100 to-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
        </section>
    );
}
