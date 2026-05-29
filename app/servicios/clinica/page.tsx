import Link from "next/link";
import { ArrowLeft, Check, ClipboardCheck, HeartPulse, Home, Mail, MapPin, ShieldCheck, Stethoscope, Users } from "lucide-react";

const juanServices = [
    { name: "Evaluación de competencias parentales", detail: "Análisis psicosocial, contexto familiar, factores protectores y riesgo.", price: "Desde 3 UF" },
    { name: "Consultoría psicosocial clínica", detail: "Orientación técnica para casos complejos de infancia, familia y protección.", price: "2.5 UF / sesión" },
    { name: "Evaluación de riesgo psicosocial", detail: "Lectura situada de vulneración, exposición, redes y trayectorias institucionales.", price: "A cotizar" },
    { name: "Informes sociales periciales", detail: "Documentos técnicos para contextos judiciales, institucionales o familiares.", price: "Desde 4 UF" },
    { name: "Visitas domiciliarias", detail: "Observación de entorno, rutinas, vínculos y condiciones materiales de cuidado.", price: "Desde 3 UF" },
];

const rocioServices = [
    "Evaluación e intervención en salud mental infanto-juvenil e integral",
    "Observación en aula y trabajo colaborativo con comunidad educativa",
    "Integración sensorial en niñeces, juventudes y personas adultas",
    "Asesoría ocupacional para autonomía, rutinas, hábitos y regulación emocional",
    "Análisis del entorno y visitas domiciliarias",
];

const conditions = [
    "TEA, TDAH, discapacidad intelectual, aprendizaje y coordinación",
    "Depresión, distimia, bipolaridad y alteraciones del ánimo",
    "Ansiedad generalizada, pánico, fobias, ansiedad social y TOC",
    "Primer episodio psicótico, esquizofrenia y cuadros relacionados",
    "Dificultades de autonomía, habilidades sociales y participación",
];

const addictionAreas = [
    "Alcohol y sustancias",
    "Pantallas y tecnología",
    "Juego patológico",
    "Compras compulsivas",
    "Co-dependencia",
    "Tabaquismo",
];

export default function ClinicaPage() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <section className="relative overflow-hidden border-b border-[#eee8dc] bg-[#171713] py-20 sm:py-28">
                <video className="absolute inset-0 h-full w-full object-cover opacity-30" src="/22.mp4" autoPlay muted loop playsInline preload="metadata" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#171713] via-[#171713]/88 to-[#171713]/35" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-end gap-10 lg:grid-cols-12">
                        <div className="lg:col-span-7">
                            <Link href="/servicios" className="inline-flex items-center gap-2 text-sm font-bold text-[#d8d0c4] hover:text-white">
                                <ArrowLeft className="h-4 w-4" />
                                Volver a servicios
                            </Link>
                            <div className="mt-8 max-w-4xl">
                                <span className="inline-flex items-center rounded-[5px] bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d8d0c4]">Atención clínica</span>
                                <h1 className="mt-7 text-4xl font-bold leading-tight text-white sm:text-5xl font-serif">
                                    Evaluación, intervención y acompañamiento clínico integral.
                                </h1>
                                <p className="mt-6 max-w-3xl text-lg leading-8 text-[#d8d0c4]">
                                    Reunimos trabajo social clínico, terapia ocupacional, salud mental, infancia, familia y análisis del entorno para orientar decisiones con criterio técnico y calidez.
                                </p>
                            </div>
                        </div>
                        <div className="hidden lg:col-span-5 lg:block">
                            <div className="relative h-[420px] overflow-hidden rounded-[8px] border border-white/10 shadow-2xl">
                                <video className="h-full w-full object-cover" src="/44.mp4" autoPlay muted loop playsInline preload="metadata" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#171713]/40 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] py-14 sm:py-20">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-4">
                        <Stethoscope className="h-10 w-10 text-[#bd6f3c]" />
                        <h2 className="mt-5 text-3xl font-bold text-[#171713] font-serif">Evaluación psicosocial</h2>
                        <p className="mt-4 text-base leading-8 text-[#70695f]">
                            Servicios especializados en infancia, trauma psicosocial, familia, protección de derechos y casos que requieren respaldo documental.
                        </p>
                    </div>
                    <div className="grid gap-4 lg:col-span-8">
                        {juanServices.map((item) => (
                            <article key={item.name} className="rounded-[8px] border border-[#eee8dc] bg-[#f8f5ee] p-5 sm:grid sm:grid-cols-[1fr_auto] sm:gap-6">
                                <div>
                                    <h3 className="font-bold text-[#171713]">{item.name}</h3>
                                    <p className="mt-2 text-sm leading-7 text-[#70695f]">{item.detail}</p>
                                </div>
                                <span className="mt-4 inline-flex h-max rounded-[5px] border border-[#dec0a8] bg-[#fffdf8] px-3 py-1 text-sm font-bold text-[#9f5528] sm:mt-0">
                                    {item.price}
                                </span>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#fffdf8] py-14 sm:py-20">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <div className="relative overflow-hidden rounded-[8px] border border-[#eee8dc] shadow-sm">
                        <img src="/images/informes_socioocupacionales.png" alt="Informes socioocupacionales" className="h-full min-h-[320px] w-full object-cover" />
                        <div className="absolute bottom-4 left-4 rounded-[5px] border border-[#eee8dc] bg-[#fffdf8]/90 px-4 py-2 text-xs font-bold text-[#23241f] shadow-sm backdrop-blur">
                            Servicio destacado · presencial y online
                        </div>
                    </div>
                    <div>
                        <span className="inline-flex rounded-[5px] bg-[#bd6f3c] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                            Informes socioocupacionales
                        </span>
                        <h2 className="mt-5 text-3xl font-bold leading-tight text-[#171713] font-serif">
                            El documento que cambia el rumbo.
                        </h2>
                        <p className="mt-4 text-base leading-8 text-[#55574f]">
                            Cuando una decisión depende de evidencia técnica, la calidad del informe importa. Elaboramos documentos con respaldo clínico, social y ocupacional para contextos educativos, judiciales, laborales e institucionales.
                        </p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {["Niños y adolescentes", "Personas adultas", "Familias y cuidadores", "Organizaciones"].map((item) => (
                                <div key={item} className="rounded-[6px] border border-[#eee8dc] bg-[#f8f5ee] px-4 py-3 text-sm font-semibold text-[#3f423a]">{item}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#f8f5ee] py-14 sm:py-20">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-4">
                        <HeartPulse className="h-10 w-10 text-[#bd6f3c]" />
                        <h2 className="mt-5 text-3xl font-bold text-[#171713] font-serif">Terapia ocupacional y salud mental</h2>
                        <p className="mt-4 text-base leading-8 text-[#70695f]">
                            Acompañamiento individual, familiar, educativo y comunitario, considerando singularidad, funcionamiento cotidiano y contexto.
                        </p>
                    </div>
                    <div className="grid gap-3 lg:col-span-8">
                        {rocioServices.map((service) => (
                            <div key={service} className="flex items-start gap-3 rounded-[6px] border border-[#eee8dc] bg-[#fffdf8] px-4 py-4">
                                <Check className="mt-1 h-4 w-4 shrink-0 text-[#bd6f3c]" />
                                <span className="text-sm font-semibold leading-7 text-[#3f423a]">{service}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 max-w-3xl">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Condiciones y señales de derivación</span>
                        <h2 className="mt-4 text-3xl font-bold text-[#171713] font-serif">Cuándo puede ser pertinente consultar</h2>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        {conditions.map((item) => (
                            <div key={item} className="flex items-start gap-3 rounded-[6px] border border-[#eee8dc] bg-[#fffdf8] p-4">
                                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[#bd6f3c]" />
                                <p className="text-sm leading-7 text-[#55574f]">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#171713] py-14 sm:py-20">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-5">
                        <span className="inline-flex rounded-[5px] border border-[#737d69]/30 bg-[#737d69]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#b8c2ad]">
                            Psicología clínica y adicciones
                        </span>
                        <h2 className="mt-5 text-3xl font-bold leading-tight text-white font-serif">Recuperar control, sin juicio y con método.</h2>
                        <p className="mt-4 text-base leading-8 text-[#d8d0c4]">
                            Abordaje de consumo problemático, adicciones conductuales y comorbilidades asociadas desde una intervención compasiva, sostenida y libre de estigma.
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
                        {addictionAreas.map((area) => (
                            <div key={area} className="rounded-[6px] border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#d8d0c4]">{area}</div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#f8f5ee] py-14">
                <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
                    {[
                        { icon: ClipboardCheck, title: "Informes socioocupacionales", text: "Documentos técnicos con respaldo clínico, social y ocupacional para contextos educativos, judiciales, laborales o institucionales." },
                        { icon: Home, title: "Análisis del entorno", text: "Visitas, observación y lectura de condiciones reales de vida, autonomía, redes y desempeño cotidiano." },
                        { icon: MapPin, title: "Modalidad flexible", text: "Atención presencial, online, domiciliaria o en terreno, según pertinencia clínica y contexto." },
                    ].map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.title} className="rounded-[8px] border border-[#eee8dc] bg-[#fffdf8] p-6">
                                <Icon className="h-7 w-7 text-[#bd6f3c]" />
                                <h3 className="mt-4 text-xl font-bold font-serif">{card.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-[#70695f]">{card.text}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Link href="/contacto?servicio=clinica" className="inline-flex items-center gap-2 rounded-[5px] bg-[#171713] px-6 py-3 text-sm font-bold text-white hover:bg-[#34362f]">
                        <Mail className="h-4 w-4" />
                        Solicitar orientación clínica
                    </Link>
                </div>
            </section>
        </main>
    );
}
