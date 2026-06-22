import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
    title: "Contacto",
    description:
        "Escríbenos para agendar atención clínica, consultoría institucional, compliance escolar o formación con el Centro de Reflexiones Críticas.",
    openGraph: {
        title: "Contacto | Centro de Reflexiones Críticas",
        description: "Agenda una conversación sobre tu necesidad clínica, institucional o de formación.",
    },
};

const servicioLabels: Record<string, string> = {
    clinica: "Atención clínica",
    consultoria: "Consultoría institucional",
    "compliance-escolar": "Compliance escolar",
    "bienestar-escolar": "Bienestar escolar",
};

export default async function Contact({
    searchParams,
}: {
    searchParams: Promise<{ servicio?: string }>;
}) {
    const { servicio } = await searchParams;
    const servicioLabel = servicio ? servicioLabels[servicio] : null;

    return (
        <div className="bg-[#fffdf8] py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">

                    {/* Contact Info */}
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-[#171713] sm:text-4xl">
                            {servicioLabel ? `Solicitar orientación: ${servicioLabel}` : "Ponte en contacto"}
                        </h2>
                        <p className="mt-4 text-base leading-7 text-[#55574f] sm:text-lg sm:leading-8">
                            {servicioLabel
                                ? `Cuéntanos tu situación y te orientamos sobre cómo podemos ayudarte con ${servicioLabel}.`
                                : "¿Tienes alguna pregunta sobre nuestros servicios, columnas o quieres colaborar? Escríbenos."}
                        </p>

                        <dl className="mt-8 space-y-6 text-base leading-7 text-[#55574f]">
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Email</span>
                                    <Mail className="h-7 w-6 text-[#8a8276]" aria-hidden="true" />
                                </dt>
                                <dd>
                                    <a className="break-all hover:text-[#171713] sm:break-normal" href="mailto:centrodereflexionescriticas@gmail.com">
                                        centrodereflexionescriticas@gmail.com
                                    </a>
                                </dd>
                            </div>
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Dirección</span>
                                    <MapPin className="h-7 w-6 text-[#8a8276]" aria-hidden="true" />
                                </dt>
                                <dd>
                                    Santiago de Chile
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Envíanos un mensaje</CardTitle>
                            <CardDescription>Te responderemos lo antes posible.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ContactForm servicio={servicio} />
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
