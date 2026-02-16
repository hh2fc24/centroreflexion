import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function About() {
    return (
        <div>
            {/* Hero Section with Video Background */}
            <div className="relative isolate overflow-hidden bg-gray-900 py-32 sm:py-48">
                <video
                    className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40 filter mix-blend-overlay"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/333.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-white" />

                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-md">
                        Quiénes Somos
                    </h2>
                    <p className="mt-6 text-xl leading-8 text-gray-100 max-w-2xl mx-auto font-medium drop-shadow-sm">
                        Detrás de Centro de Reflexiones Críticas hay un equipo apasionado por el pensamiento, la cultura y la tecnología.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 -mt-20 relative z-20">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Juan Carlos */}
                    <div className="flex flex-col items-center p-8 rounded-3xl bg-white shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                        <div className="h-48 w-48 shrink-0 rounded-full bg-gray-200 border-[6px] border-white shadow-lg mb-8 relative overflow-hidden group-hover:border-blue-50 transition-colors">
                            <Image
                                src="/images/juan_carlos.png"
                                alt="Juan Carlos Rauld"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Juan Carlos Rauld</h3>
                            <p className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide text-xs">Co-Fundador & Director Editorial</p>
                            <p className="text-base leading-relaxed text-gray-600 px-4">
                                Juan Carlos aporta una visión profunda desde el análisis biopolítico y legal. Su trabajo se centra en el análisis crítico de la infancia, el neoliberalismo y la salud mental, desafiando las narrativas convencionales.
                            </p>
                        </div>
                    </div>

                    {/* Rocío */}
                    <div className="flex flex-col items-center p-8 rounded-3xl bg-white shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                        <div className="h-48 w-48 shrink-0 rounded-full bg-gray-200 border-[6px] border-white shadow-lg mb-8 relative overflow-hidden group-hover:border-blue-50 transition-colors">
                            <Image
                                src="/images/rocio_solar.png"
                                alt="Rocío Solar"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Rocío Solar</h3>
                            <p className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide text-xs">Co-Fundadora & Estratega Digital</p>
                            <p className="text-base leading-relaxed text-gray-600 px-4">
                                Rocío lidera las iniciativas de comunicación y estrategia digital. Con vasta experiencia en gestión cultural, es el puente vital entre el contenido académico riguroso y las nuevas audiencias globales.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Nuestra Misión</h3>
                    <p className="max-w-2xl mx-auto text-lg leading-8 text-gray-600 mb-10">
                        Fomentar un espacio de diálogo y reflexión que trascienda lo académico, haciendo accesibles las ideas complejas para transformar nuestra comprensión de la realidad social y cultural.
                    </p>
                    <Link href="/contacto">
                        <Button variant="default" className="px-8">Contactar al equipo</Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
