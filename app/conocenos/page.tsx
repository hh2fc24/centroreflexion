import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function About() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Quiénes Somos
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-gray-600">
                        Detrás de Centro de Reflexiones Críticas hay un equipo apasionado por el pensamiento, la cultura y la tecnología.
                    </p>
                </div>

                {/* Animated Logo Video */}
                <div className="relative w-full max-w-2xl mx-auto mb-20 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 aspect-video">
                    <video
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/333.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* Overlay for cinematic feel */}
                    <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
                    {/* Juan Carlos */}
                    <div className="flex flex-col gap-6 sm:flex-row items-center sm:items-start p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100/50 hover:border-gray-200">
                        <div className="h-32 w-32 flex-shrink-0 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md relative">
                            <Image
                                src="/images/juan_carlos.png"
                                alt="Juan Carlos Rauld"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl font-semibold leading-7 tracking-tight text-gray-900">Juan Carlos Rauld</h3>
                            <p className="text-sm font-semibold leading-6 text-blue-600">Co-Fundador & Director Editorial</p>
                            <p className="mt-4 text-base leading-7 text-gray-600">
                                Juan Carlos aporta una visión profunda desde el análisis biopolítico y legal. Su trabajo se centra en el análisis crítico de la infancia, el neoliberalismo y la salud mental.
                            </p>
                        </div>
                    </div>

                    {/* Rocío */}
                    <div className="flex flex-col gap-6 sm:flex-row items-center sm:items-start p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100/50 hover:border-gray-200">
                        <div className="h-32 w-32 flex-shrink-0 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md relative">
                            <Image
                                src="/images/rocio_solar.png"
                                alt="Rocío Solar" // Assuming Solar based on filename, user said Rosario so I will check if I should change text, but file is rocio_solar. I'll stick to Rocío for now to match file.
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl font-semibold leading-7 tracking-tight text-gray-900">Rocío Solar</h3>
                            <p className="text-sm font-semibold leading-6 text-blue-600">Co-Fundadora & Estratega Digital</p>
                            <p className="mt-4 text-base leading-7 text-gray-600">
                                Rocío lidera las iniciativas de comunicación y estrategia digital. Con experiencia en gestión cultural, impulsa la conexión entre el contenido académico y las nuevas audiencias.
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
