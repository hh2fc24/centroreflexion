import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import Link from "next/link";
import { ArrowRight, Clock3, Mail, MapPin, Phone, ShieldAlert } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, CONTACT_LOCATION, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/contact";

export const metadata: Metadata = pageMetadata({
    title: "Contacto",
    description:
        "Escríbenos para agendar atención clínica, consultoría institucional, compliance escolar o formación con el Centro de Reflexiones Críticas.",
    path: "/contacto",
    ogTitle: "Contacto | Centro de Reflexiones Críticas",
    ogDescription: "Agenda una conversación sobre tu necesidad clínica, institucional o de formación.",
});

const servicioLabels: Record<string, string> = {
    "acompanamiento-familiar": "Acompañamiento familiar",
    clinica: "Atención clínica",
    consultoria: "Consultoría institucional",
    "compliance-escolar": "Compliance escolar",
    "bienestar-escolar": "Bienestar escolar",
    formacion: "Formación y supervisión",
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
                        <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Contacto</p>
                        <h1 className="crc-serif mt-3 text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713]">
                            {servicioLabel ? `Solicitar orientación: ${servicioLabel}` : "Ponte en contacto"}
                        </h1>
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
                                    <a className="break-all hover:text-[#171713] sm:break-normal" href={`mailto:${CONTACT_EMAIL}`}>
                                        {CONTACT_EMAIL}
                                    </a>
                                </dd>
                            </div>
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Teléfono</span>
                                    <Phone className="h-7 w-6 text-[#8a8276]" aria-hidden="true" />
                                </dt>
                                <dd>
                                    <a className="hover:text-[#171713]" href={CONTACT_PHONE_HREF}>
                                        {CONTACT_PHONE}
                                    </a>
                                </dd>
                            </div>
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Área de atención</span>
                                    <MapPin className="h-7 w-6 text-[#8a8276]" aria-hidden="true" />
                                </dt>
                                <dd>{CONTACT_LOCATION}</dd>
                            </div>
                            <div className="flex gap-x-4">
                                <dt className="flex-none">
                                    <span className="sr-only">Horario de atención</span>
                                    <Clock3 className="h-7 w-6 text-[#8a8276]" aria-hidden="true" />
                                </dt>
                                <dd>
                                    Lunes a viernes, 09:00 a 18:00 hrs.
                                </dd>
                            </div>
                        </dl>

                        {/* Orientación de crisis dentro de la página, no flotando. */}
                        <aside aria-labelledby="crisis-title" className="mt-10 rounded-[6px] border border-[#d8cfc0] bg-[#f8f5ee] p-5 sm:p-6">
                            <div className="flex items-start gap-3">
                                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#9f5528]" aria-hidden="true" />
                                <div>
                                    <h2 id="crisis-title" className="text-[1rem] font-semibold text-[#171713]">
                                        Si hay riesgo inmediato, no esperes respuesta a este formulario
                                    </h2>
                                    <p className="mt-2 text-[0.9375rem] leading-[1.6] text-[#55574f]">
                                        Llama gratis al{" "}
                                        <a href="tel:*4141" className="font-semibold text-[#9f5528] underline underline-offset-4">
                                            *4141
                                        </a>
                                        , línea de prevención del suicidio de Salud Responde, disponible 24 horas.
                                    </p>
                                    <Link
                                        href="/servicios/clinica"
                                        className="mt-3 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-[6px] hover:text-[#9f5528]"
                                    >
                                        Consulta prioritaria con el equipo clínico del CRC
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </aside>
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
