import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { BarChart, Users, Laptop, Brain, CheckCircle2 } from "lucide-react";
import { MotionDiv, MotionList, MotionItem } from "@/components/ui/Motion";

export default function Services() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <MotionDiv className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Transforma tu Conocimiento en Influencia
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-gray-600">
                        No basta con tener la razón. Necesitas que te escuchen. Combinamos el rigor de las ciencias sociales con estrategias digitales de alto impacto.
                    </p>
                </MotionDiv>

                <MotionList className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:max-w-none lg:grid-cols-2">

                    <MotionItem>
                        <Card className="flex flex-col justify-between hover:shadow-xl transition-shadow border-t-4 border-t-blue-600 h-full">
                            <CardHeader>
                                <div className="flex items-center gap-x-3 mb-2">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-xl">Estrategia Digital para Instituciones</CardTitle>
                                </div>
                                <CardDescription className="text-base font-medium text-gray-900">
                                    Ideal para: ONGs, Universidades y Centros de Estudio.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-6 text-sm">
                                    Convertimos investigaciones complejas en narrativas digitales que movilizan audiencias y generan debate público.
                                </p>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Auditoría de reputación online.</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Gestión de crisis y comunicación estratégica.</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Crecimiento de comunidades orgánicas.</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </MotionItem>

                    <MotionItem>
                        <Card className="flex flex-col justify-between hover:shadow-xl transition-shadow border-t-4 border-t-purple-600 h-full">
                            <CardHeader>
                                <div className="flex items-center gap-x-3 mb-2">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <Laptop className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <CardTitle className="text-xl">Tecnología para Investigadores</CardTitle>
                                </div>
                                <CardDescription className="text-base font-medium text-gray-900">
                                    Ideal para: Académicos, Tesistas y Think Tanks.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-6 text-sm">
                                    Moderniza tus herramientas de recolección y análisis. La tecnología debe ser un acelerador, no un obstáculo.
                                </p>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Visualización de datos (Data Viz) impactante.</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Plataformas de publicación digital.</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Capacitación en herramientas digitales.</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </MotionItem>

                    <MotionItem>
                        <Card className="flex flex-col justify-between hover:shadow-xl transition-shadow border-t-4 border-t-indigo-600 h-full">
                            <CardHeader>
                                <div className="flex items-center gap-x-3 mb-2">
                                    <div className="p-2 bg-indigo-50 rounded-lg">
                                        <Brain className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <CardTitle className="text-xl">Neuromarketing Ético</CardTitle>
                                </div>
                                <CardDescription className="text-base font-medium text-gray-900">
                                    Ideal para: Campañas de Concientización y Cambio Social.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-6 text-sm">
                                    Conecta con las emociones profundas de tu audiencia para impulsar acciones reales, siempre desde una ética transparente.
                                </p>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Diseño persuasivo (UX/UI).</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Copywriting emocional y de alto impacto.</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Optimización de conversión (CRO).</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </MotionItem>

                    <MotionItem>
                        <Card className="flex flex-col justify-between bg-gray-900 border-none text-white h-full shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                            <CardHeader>
                                <div className="flex items-center gap-x-3 mb-2">
                                    <BarChart className="h-8 w-8 text-blue-400" />
                                    <CardTitle className="text-2xl text-white">¿Listo para elevar el nivel?</CardTitle>
                                </div>
                                <CardDescription className="text-gray-400 text-base">
                                    Agenda una sesión estratégica de 30 minutos.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col justify-end flex-grow">
                                <p className="text-gray-300 mb-8">
                                    Analizaremos tu situación actual y te daremos 3 acciones concretas que puedes aplicar de inmediato.
                                </p>
                                <Link href="/contacto" className="w-full">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 text-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]" size="lg">
                                        Agendar Consultoría
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </MotionItem>

                </MotionList>
            </div>
        </div>
    );
}
