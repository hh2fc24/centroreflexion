import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    FileText,
    HeartHandshake,
    LifeBuoy,
    Mail,
    MessageCircle,
    Monitor,
    Phone,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Acompañamiento Familiar | Apoyo Profesional en Momentos Difíciles",
    description:
        "Acompañamiento profesional para familias que atraviesan conflictos, crisis emocionales o necesitan un informe social de discapacidad. Consultar a tiempo también es cuidar a los tuyos.",
    path: "/servicios/acompanamiento-familiar",
    ogTitle: "Acompañamiento profesional para familias en momentos difíciles",
    ogDescription:
        "Pedir ayuda no es exagerar. Orientación y acompañamiento para familias con niños, niñas, adolescentes y jóvenes.",
});

const signals = [
    "Notas cambios importantes en el ánimo o la conducta de niños, niñas, adolescentes o jóvenes",
    "Los conflictos en casa se repiten y ya no saben cómo salir de ellos",
    "Sientes que ya no puedes más",
    "Necesitas orientación para trámites de discapacidad",
];

const paths = [
    {
        icon: HeartHandshake,
        title: "Acompañamiento familiar",
        text: "Orientación e intervención cuando la familia atraviesa conflictos, crisis o preocupación por niños, niñas, adolescentes o jóvenes.",
        outcome: "Entender qué está pasando y acordar un plan de cuidado posible para esta familia, no para una familia ideal.",
    },
    {
        icon: LifeBuoy,
        title: "Contención en crisis emocionales",
        text: "Apoyo terapéutico para personas y familias que viven pensamientos de muerte o han pasado por un intento.",
        outcome: "Un espacio seguro para hablar de lo que cuesta nombrar, con resguardos claros y seguimiento cercano.",
    },
    {
        icon: FileText,
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

export default function AcompanamientoFamiliarPage() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <section className="relative overflow-hidden border-b border-[#eee8dc] bg-[#f3f7f4]">
                <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#cfe3d6]/55 blur-[2px]" aria-hidden="true" />
                <div className="pointer-events-none absolute -bottom-40 right-40 h-[320px] w-[320px] rounded-full bg-[#dcebe0]/60" aria-hidden="true" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                    <Link href="/servicios" className="inline-flex items-center gap-2 text-sm font-bold text-[#4b6b56] hover:text-[#1d3d2b]">
                        <ArrowLeft className="h-4 w-4" />
                        Volver a servicios
                    </Link>
                    <div className="mt-10 max-w-4xl">
                        <span className="inline-flex items-center rounded-[5px] border border-[#1d3d2b]/12 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2f5641]">
                            Familias
                        </span>
                        <h1 className="mt-7 font-serif text-4xl font-bold leading-[1.08] tracking-tight text-[#14392a] sm:text-5xl lg:text-6xl">
                            Acompañamiento profesional para familias en momentos difíciles.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#46614f]">
                            Consultar a tiempo también es cuidar a los tuyos.
                        </p>
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/contacto?servicio=acompanamiento-familiar"
                                className="group inline-flex items-center justify-center gap-2 rounded-[7px] bg-[#1d3d2b] px-6 py-3.5 text-sm font-bold text-white transition duration-200 hover:bg-[#2b5740]"
                            >
                                Da el primer paso
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </Link>
                            <a
                                href="https://wa.me/56949186447?text=Hola%2C%20quisiera%20orientaci%C3%B3n%20para%20mi%20familia."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-[7px] border border-[#1d3d2b]/20 bg-white/80 px-6 py-3.5 text-sm font-bold text-[#1d3d2b] transition hover:border-[#1d3d2b]/45"
                            >
                                <MessageCircle className="h-4 w-4" />
                                Escribir por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] py-14 sm:py-20">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-5">
                        <h2 className="font-serif text-3xl font-bold leading-tight text-[#171713] sm:text-4xl">
                            Pedir ayuda no es exagerar.
                        </h2>
                        <p className="mt-5 text-base leading-8 text-[#70695f]">
                            Muchas familias llegan pidiendo disculpas por consultar, convencidas de que lo suyo no es
                            suficientemente grave. Casi siempre llevaban meses sosteniendo solas una situación que ya
                            pesaba demasiado.
                        </p>
                        <p className="mt-5 font-serif text-xl italic leading-8 text-[#2f5641]">
                            No tienes que esperar a que la situación empeore.
                        </p>
                    </div>
                    <div className="lg:col-span-7">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">
                            Es momento de consultar cuando
                        </p>
                        <ul className="mt-5 space-y-3">
                            {signals.map((signal) => (
                                <li
                                    key={signal}
                                    className="flex items-start gap-4 rounded-[8px] border border-[#eee8dc] bg-[#f8f5ee] px-5 py-4"
                                >
                                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2f5641]" aria-hidden="true" />
                                    <span className="text-base leading-7 text-[#3f423a]">{signal}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#f8f5ee] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Cómo te puedo ayudar</span>
                        <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#171713] sm:text-4xl">
                            Tres formas de acompañar, según lo que estés viviendo.
                        </h2>
                    </div>
                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {paths.map((path) => {
                            const Icon = path.icon;
                            return (
                                <article
                                    key={path.title}
                                    className="flex h-full flex-col rounded-[8px] border border-[#ded5c7] bg-[#fffdf8] p-6"
                                >
                                    <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#e7efe9] text-[#2f5641]">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <h3 className="mt-6 font-serif text-2xl font-bold leading-tight text-[#171713]">
                                        {path.title}
                                    </h3>
                                    <p className="mt-4 text-base leading-7 text-[#625c52]">{path.text}</p>
                                    <p className="mt-auto border-t border-[#eee8dc] pt-5 text-sm leading-7 text-[#70695f]">
                                        <strong className="font-semibold text-[#3f423a]">Con qué te vas:</strong> {path.outcome}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                    <p className="mt-8 max-w-3xl text-sm leading-7 text-[#70695f]">
                        ¿Buscas evaluaciones de competencias parentales, informes periciales, terapia ocupacional o un
                        proceso clínico sostenido?{" "}
                        <Link href="/servicios/clinica" className="font-semibold text-[#9f5528] underline underline-offset-4 hover:text-[#bd6f3c]">
                            Eso se trabaja en atención clínica
                        </Link>
                        , con el equipo completo del CRC.
                    </p>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Cómo es el primer paso</span>
                        <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#171713] sm:text-4xl">
                            Nadie llega con todo claro. Esa es exactamente la idea.
                        </h2>
                    </div>
                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {steps.map((step, index) => (
                            <div key={step.title} className="rounded-[8px] border border-[#eee8dc] bg-[#fffdf8] p-6">
                                <span className="font-serif text-4xl font-bold leading-none text-[#171713]/12">0{index + 1}</span>
                                <h3 className="mt-5 font-serif text-xl font-bold text-[#171713]">{step.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-[#70695f]">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#f3f7f4] py-14 sm:py-20">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-4">
                        <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-[8px] border border-white/60 bg-[#e7efe9] shadow-sm">
                            <Image
                                src="/images/juan-carlos-rauld-retrato.jpg"
                                alt="Juan Carlos Rauld Farías"
                                fill
                                sizes="(min-width: 1024px) 320px, 100vw"
                                className="object-cover object-center"
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-8">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Quién te acompaña</span>
                        <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-[#14392a] sm:text-4xl">
                            Juan Carlos Rauld Farías
                        </h2>
                        <p className="mt-3 text-lg font-semibold leading-8 text-[#46614f]">
                            Trabajador social clínico en salud mental infantil y familiar
                        </p>
                        <ul className="mt-7 space-y-3">
                            {[
                                <>
                                    <strong className="font-semibold text-[#14392a]">Más de 15 años</strong> acompañando a niños y familias
                                </>,
                                <>Especialización en trauma infantil y casos complejos</>,
                                <>Doctorando en Trabajo Social, Universitat Rovira i Virgili (España)</>,
                                <>Experiencia docente universitaria en trabajo social clínico</>,
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2f5641]" aria-hidden="true" />
                                    <span className="text-base leading-7 text-[#3f423a]">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-7 font-serif text-xl italic leading-8 text-[#2f5641]">
                            Atención con mirada respetuosa y sin juicios.
                        </p>
                        <Link
                            href="/conocenos"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1d3d2b] underline underline-offset-4 hover:text-[#2b5740]"
                        >
                            Conoce al equipo del CRC
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-[#14392a] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <h2 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
                                Da el primer paso
                            </h2>
                            <p className="mt-5 text-lg leading-8 text-[#c3d6c9]">
                                La primera conversación es para escucharte y orientarte.
                            </p>
                            <Link
                                href="/contacto?servicio=acompanamiento-familiar"
                                className="group mt-8 inline-flex items-center justify-center gap-2 rounded-[7px] bg-[#fffdf8] px-6 py-3.5 text-sm font-bold text-[#14392a] transition hover:bg-white"
                            >
                                Solicitar una hora
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </Link>
                        </div>
                        <div className="grid gap-3 lg:col-span-7">
                            <a
                                href="https://wa.me/56949186447?text=Hola%2C%20quisiera%20orientaci%C3%B3n%20para%20mi%20familia."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-4 rounded-[8px] border border-white/10 bg-white/5 px-5 py-4 transition hover:border-white/25 hover:bg-white/10"
                            >
                                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#a9c6b3]" />
                                <span>
                                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a9c6b3]">WhatsApp</span>
                                    <span className="mt-1 block text-base font-semibold text-white">+56 9 4918 6447</span>
                                </span>
                            </a>
                            <a
                                href="mailto:rauldjuancarlos@gmail.com"
                                className="flex items-start gap-4 rounded-[8px] border border-white/10 bg-white/5 px-5 py-4 transition hover:border-white/25 hover:bg-white/10"
                            >
                                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#a9c6b3]" />
                                <span>
                                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a9c6b3]">Correo</span>
                                    <span className="mt-1 block break-all text-base font-semibold text-white">rauldjuancarlos@gmail.com</span>
                                </span>
                            </a>
                            <div className="flex items-start gap-4 rounded-[8px] border border-white/10 bg-white/5 px-5 py-4">
                                <Monitor className="mt-0.5 h-5 w-5 shrink-0 text-[#a9c6b3]" />
                                <span>
                                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#a9c6b3]">Modalidad</span>
                                    <span className="mt-1 block text-base font-semibold text-white">
                                        Online, y presencial cuando la situación lo requiere
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        id="ayuda-inmediata"
                        className="mt-10 flex scroll-mt-28 flex-col gap-4 rounded-[8px] border border-[#d9a066]/30 bg-[#d9a066]/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex items-start gap-4">
                            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#e5b782]" />
                            <p className="text-base leading-7 text-[#f0e4d4]">
                                Si estás en crisis ahora, llama gratis al{" "}
                                <a href="tel:*4141" className="font-bold text-white underline underline-offset-4">*4141</a>, disponible 24 horas.
                                Si es una emergencia, llama al{" "}
                                <a href="tel:131" className="font-bold text-white underline underline-offset-4">131</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
