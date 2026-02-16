import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function About() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Quiénes Somos
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-gray-600">
                        Detrás de Centro de Reflexiones Críticas hay un equipo apasionado por el pensamiento, la cultura y la tecnología.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
                    {/* Juan Carlos */}
                    <div className="flex flex-col gap-6 sm:flex-row items-center sm:items-start p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="h-24 w-24 flex-shrink-0 rounded-full bg-gray-300 overflow-hidden">
                            {/* Placeholder for Image */}
                            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500 text-xs">
                                Foto JC
                            </div>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl font-semibold leading-7 tracking-tight text-gray-900">Juan Carlos</h3>
                            <p className="text-sm font-semibold leading-6 text-blue-600">Co-Fundador & Director Editorial</p>
                            <p className="mt-4 text-base leading-7 text-gray-600">
                                Juan Carlos aporta una visión profunda desde [Insertar especialidad basada en bio real]. Su trabajo se centra en el análisis crítico de [temas] y la intersección con [temas].
                            </p>
                        </div>
                    </div>

                    {/* Rocío */}
                    <div className="flex flex-col gap-6 sm:flex-row items-center sm:items-start p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="h-24 w-24 flex-shrink-0 rounded-full bg-gray-300 overflow-hidden">
                            {/* Placeholder for Image */}
                            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500 text-xs">
                                Foto Rocío
                            </div>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl font-semibold leading-7 tracking-tight text-gray-900">Rocío</h3>
                            <p className="text-sm font-semibold leading-6 text-blue-600">Co-Fundadora & Estratega Digital</p>
                            <p className="mt-4 text-base leading-7 text-gray-600">
                                Rocío lidera las iniciativas de [Insertar especialidad]. Con experiencia en [áreas], impulsa la conexión entre el contenido académico y las audiencias digitales.
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
                        <Button variant="outline">Contactar al equipo</Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
