import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Monitor, Phone } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PersonInCharge, SectionHead, ServiceHero } from "../_components/Blocks";
import { JUAN_CARLOS, ROCIO, type Person } from "../_components/people";
import { Reveal } from "../_components/Reveal";
import { btnPrimary, btnPrimaryOnDark, btnSecondary, container, labelMuted, labelOnDark, textLink } from "../_components/ui";

export const metadata: Metadata = pageMetadata({
    title: "Acompañamiento Familiar | Apoyo Profesional en Momentos Difíciles",
    description:
        "Acompañamiento profesional para familias que atraviesan conflictos, crisis emocionales o necesitan un informe social de discapacidad. Consultar a tiempo también es cuidar a los tuyos.",
    path: "/servicios/acompanamiento-familiar",
    ogTitle: "Acompañamiento profesional para familias en momentos difíciles",
    ogDescription:
        "Pedir ayuda no es exagerar. Orientación y acompañamiento para familias con niños, niñas, adolescentes y jóvenes.",
});

const WHATSAPP_FAMILIAS = "https://wa.me/56949186447?text=Hola%2C%20quisiera%20orientaci%C3%B3n%20para%20mi%20familia.";

const signals = [
    "Notas cambios importantes en el ánimo o la conducta de niños, niñas, adolescentes o jóvenes",
    "Los conflictos en casa se repiten y ya no saben cómo salir de ellos",
    "Sientes que ya no puedes más",
    "Necesitas orientación para trámites de discapacidad",
];

const paths = [
    {
        title: "Acompañamiento familiar",
        text: "Orientación e intervención cuando la familia atraviesa conflictos, crisis o preocupación por niños, niñas, adolescentes o jóvenes.",
        outcome: "Entender qué está pasando y acordar un plan de cuidado posible para esta familia, no para una familia ideal.",
    },
    {
        title: "Contención en crisis emocionales",
        text: "Apoyo terapéutico para personas y familias que viven pensamientos de muerte o han pasado por un intento.",
        outcome: "Un espacio seguro para hablar de lo que cuesta nombrar, con resguardos claros y seguimiento cercano.",
    },
    {
        title: "Informe social de discapacidad",
        text: "Evaluación social profesional para trámites y apoyos.",
        outcome: "El documento que respalda la solicitud de credencial, beneficios y ajustes en el colegio o el trabajo.",
    },
];

const steps = [
    {
        title: "Escribes",
        text: "Cuentas en pocas líneas lo que está pasando. No necesitas tener el problema ordenado ni usar palabras técnicas.",
    },
    {
        title: "Conversamos",
        text: "Una primera conversación para escucharte y orientarte. Ahí se define si corresponde acompañamiento, contención o un informe.",
    },
    {
        title: "Avanzamos",
        text: "Se acuerda la frecuencia, la modalidad y los pasos siguientes, con la familia sabiendo siempre hacia dónde va el proceso.",
    },
];

// Retrato de Juan Carlos en el sitio: acá se presenta desde su práctica clínica.
const JC_CLINICO: Person = {
    ...JUAN_CARLOS,
    name: "Juan Carlos Rauld Farías",
    role: "Trabajador social clínico en salud mental infantil y familiar",
    image: "/images/juan-carlos-rauld-retrato.jpg",
    imageAlt: "Juan Carlos Rauld Farías",
    credentials: "Doctorando en Trabajo Social, Universitat Rovira i Virgili (España) · Director del CRC",
};

export default function AcompanamientoFamiliarPage() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <ServiceHero
                area="Acompañamiento familiar"
                title="Acompañamiento profesional para familias en momentos difíciles"
                intro={<p>Consultar a tiempo también es cuidar a los tuyos.</p>}
                actions={
                    <>
                        <Link href="/contacto?servicio=acompanamiento-familiar" className={btnPrimary}>
                            Da el primer paso
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <a href={WHATSAPP_FAMILIAS} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                            <MessageCircle className="h-4 w-4" aria-hidden="true" />
                            Escribir por WhatsApp
                        </a>
                    </>
                }
                factsTitle="En corto"
                facts={[
                    { term: "Para quién", detail: "Familias y cuidadores preocupados por niños, niñas, adolescentes o jóvenes." },
                    { term: "Modalidad", detail: "Online, y presencial cuando la situación lo requiere" },
                    { term: "Te acompaña", detail: JC_CLINICO.name },
                    { term: "Dirección clínica", detail: `${ROCIO.name}, Directora Clínica del CRC` },
                ]}
            />

            {/* Señales */}
            <section aria-labelledby="senales-title" className="bg-[#fffdf8]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}>
                    <Reveal>
                        <SectionHead eyebrow="Antes de consultar" title="Pedir ayuda no es exagerar." id="senales-title">
                            <p>
                                Muchas familias llegan pidiendo disculpas por consultar, convencidas de que lo suyo no es suficientemente
                                grave. Casi siempre llevaban meses sosteniendo solas una situación que ya pesaba demasiado.
                            </p>
                        </SectionHead>
                        <p className="crc-serif mt-6 border-l-2 border-[#bd6f3c] pl-5 text-[1.25rem] leading-[1.45] text-[#171713]">
                            No tienes que esperar a que la situación empeore.
                        </p>
                    </Reveal>
                    <Reveal>
                        <p className={labelMuted}>Es momento de consultar cuando</p>
                        <ul className="mt-3 border-t border-[#d8cfc0]">
                            {signals.map((signal) => (
                                <li key={signal} className="border-b border-[#d8cfc0] py-4 text-[1.0625rem] leading-[1.55] text-[#171713]">
                                    {signal}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </section>

            {/* Tres formas */}
            <section aria-labelledby="formas-title" className="border-t border-[#d8cfc0] bg-[#f8f5ee]">
                <div className={`${container} py-16 sm:py-24`}>
                    <Reveal>
                        <SectionHead eyebrow="Cómo te puedo ayudar" title="Tres formas de acompañar, según lo que estés viviendo." id="formas-title" />
                    </Reveal>
                    <ol className="mt-12 border-b border-[#d8cfc0]">
                        {paths.map((path, index) => (
                            <li key={path.title} className="border-t border-[#d8cfc0]">
                                <Reveal className="grid gap-4 py-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
                                    <div>
                                        <p className="text-[0.8125rem] font-semibold tabular-nums text-[#9f5528]">{String(index + 1).padStart(2, "0")}</p>
                                        <h3 className="crc-serif mt-2 text-[1.4rem] font-medium leading-[1.2] text-[#171713]">{path.title}</h3>
                                    </div>
                                    <p className="text-[1rem] leading-[1.7] text-[#55574f]">{path.text}</p>
                                    <p className="text-[1rem] leading-[1.7] text-[#171713] lg:border-l lg:border-[#d8cfc0] lg:pl-8">
                                        <span className="block text-[0.8125rem] font-semibold text-[#6f675d]">Con qué te vas</span>
                                        {path.outcome}
                                    </p>
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-8 max-w-[62ch] text-[1rem] leading-[1.7] text-[#55574f]">
                        ¿Buscas evaluaciones de competencias parentales, informes periciales, terapia ocupacional o un proceso clínico
                        sostenido?{" "}
                        <Link href="/servicios/clinica" className="font-semibold text-[#9f5528] underline decoration-[#d8cfc0] underline-offset-4 hover:text-[#171713]">
                            Eso se trabaja en atención clínica
                        </Link>
                        , con el equipo completo del CRC.
                    </p>
                </div>
            </section>

            {/* Primer paso */}
            <section aria-labelledby="primer-paso-title" className="border-t border-[#d8cfc0] bg-[#fffdf8]">
                <div className={`${container} py-16 sm:py-24`}>
                    <Reveal>
                        <SectionHead eyebrow="Cómo es el primer paso" title="Nadie llega con todo claro. Esa es exactamente la idea." id="primer-paso-title" />
                    </Reveal>
                    <ol className="mt-12 grid border-t border-[#d8cfc0] md:grid-cols-3">
                        {steps.map((step, index) => (
                            <li key={step.title} className="border-b border-[#d8cfc0] py-8 md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0">
                                <Reveal delay={index * 0.06}>
                                    <p className="text-[0.8125rem] font-semibold tabular-nums text-[#9f5528]">Paso {index + 1}</p>
                                    <h3 className="crc-serif mt-2 text-[1.35rem] font-medium leading-[1.2] text-[#171713]">{step.title}</h3>
                                    <p className="mt-3 text-[1rem] leading-[1.7] text-[#55574f]">{step.text}</p>
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <PersonInCharge
                person={JC_CLINICO}
                eyebrow="Quién te acompaña"
                cta={{ href: "/contacto?servicio=acompanamiento-familiar", label: "Solicitar una hora" }}
                secondary={
                    <Link href="/conocenos" className={textLink}>
                        Conoce al equipo del CRC
                    </Link>
                }
            >
                <ul className="space-y-2">
                    <li>
                        <span className="font-semibold text-[#171713]">Más de 15 años</span> acompañando a niños y familias
                    </li>
                    <li>Especialización en trauma infantil y casos complejos</li>
                    <li>Experiencia docente universitaria en trabajo social clínico</li>
                </ul>
                <p className="crc-serif text-[1.2rem] text-[#171713]">Atención con mirada respetuosa y sin juicios.</p>
            </PersonInCharge>

            <PersonInCharge person={ROCIO} eyebrow="Directora Clínica a cargo del área" className="bg-[#fffdf8]">
                <p>
                    Rocío Solar es terapeuta ocupacional, cofundadora y Directora Clínica del CRC, con 9 años de experiencia clínica y
                    psicosocial en salud mental infanto-juvenil. Define los criterios clínicos del área y revisa con el equipo los casos
                    que requieren más resguardo, como las crisis emocionales.
                </p>
            </PersonInCharge>

            {/* Cierre */}
            <section aria-labelledby="cierre-title" className="bg-[#15120e] text-[#fbf7ee]">
                <div className={`${container} py-16 sm:py-24`}>
                    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                        <Reveal>
                            <SectionHead eyebrow="Contacto" title="Da el primer paso" id="cierre-title" dark>
                                <p>La primera conversación es para escucharte y orientarte.</p>
                            </SectionHead>
                            <Link href="/contacto?servicio=acompanamiento-familiar" className={`${btnPrimaryOnDark} mt-8`}>
                                Solicitar una hora
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </Reveal>
                        <Reveal>
                            <ul className="border-t border-white/15">
                                <li className="border-b border-white/15">
                                    <a href={WHATSAPP_FAMILIAS} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 py-5">
                                        <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-[#e4935d]" aria-hidden="true" />
                                        <span>
                                            <span className={`${labelOnDark} block`}>WhatsApp</span>
                                            <span className="mt-1 block text-[1.0625rem] font-semibold tabular-nums text-white group-hover:text-[#e4935d]">+56 9 4918 6447</span>
                                        </span>
                                    </a>
                                </li>
                                <li className="border-b border-white/15">
                                    <a href="mailto:rauldjuancarlos@gmail.com" className="group flex items-start gap-4 py-5">
                                        <Mail className="mt-1 h-5 w-5 shrink-0 text-[#e4935d]" aria-hidden="true" />
                                        <span className="min-w-0">
                                            <span className={`${labelOnDark} block`}>Correo</span>
                                            <span className="mt-1 block break-all text-[1.0625rem] font-semibold text-white group-hover:text-[#e4935d]">rauldjuancarlos@gmail.com</span>
                                        </span>
                                    </a>
                                </li>
                                <li className="flex items-start gap-4 border-b border-white/15 py-5">
                                    <Monitor className="mt-1 h-5 w-5 shrink-0 text-[#e4935d]" aria-hidden="true" />
                                    <span>
                                        <span className={`${labelOnDark} block`}>Modalidad</span>
                                        <span className="mt-1 block text-[1.0625rem] font-semibold text-white">Online, y presencial cuando la situación lo requiere</span>
                                    </span>
                                </li>
                            </ul>
                        </Reveal>
                    </div>

                    <div id="ayuda-inmediata" className="mt-12 flex scroll-mt-28 items-start gap-4 rounded-[6px] border border-[#e4935d]/50 px-5 py-5">
                        <Phone className="mt-1 h-5 w-5 shrink-0 text-[#e4935d]" aria-hidden="true" />
                        <p className="text-[1rem] leading-[1.7] text-[#fbf7ee]">
                            Si estás en crisis ahora, llama gratis al{" "}
                            <a href="tel:*4141" className="font-semibold text-white underline underline-offset-4">*4141</a>, disponible 24 horas. Si
                            es una emergencia, llama al{" "}
                            <a href="tel:131" className="font-semibold text-white underline underline-offset-4">131</a>.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
