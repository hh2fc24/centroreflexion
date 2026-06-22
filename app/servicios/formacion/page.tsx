import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Check, GraduationCap, Mail, MessageSquareText, Users } from "lucide-react";

export const metadata: Metadata = {
    title: "Formación y Capacitación | Intervención en Crisis y Equipos",
    description:
        "Capacitación en intervención de crisis, salud mental, inclusión y trabajo con comunidad. Aprendizaje situado, supervisión reflexiva y aplicación práctica para equipos e instituciones.",
    openGraph: {
        title: "Formación CRC para equipos e instituciones",
        description: "Programas de capacitación con fundamento técnico y transferencia a casos y protocolos reales.",
    },
};

const juanTraining = [
    { name: "Capacitación en intervención de crisis", detail: "Modalidad presencial u online. Programas de 4 a 8 horas.", price: "Desde 5 UF" },
    { name: "Supervisión clínica de casos", detail: "Para equipos de protección infantil, infancia, familia y programas sociales.", price: "2.5 UF / sesión" },
    { name: "Formación en gestión de programas sociales", detail: "Diseño, implementación, evaluación y criterios de mejora.", price: "Desde 8 UF" },
    { name: "Taller de evaluación pericial", detail: "Competencias parentales, riesgo psicosocial y lectura de antecedentes.", price: "Desde 6 UF" },
    { name: "Asesoría estratégica institucional", detail: "Diseño de modelos de intervención y criterios de decisión.", price: "A cotizar" },
];

const rocioTraining = [
    { name: "Charlas en salud mental y género", detail: "Instancias presenciales u online de 60 a 90 minutos.", price: "Consultar" },
    { name: "Formación de equipos en VIF", detail: "Actualización conceptual, abordaje situado y criterios de cuidado.", price: "Consultar" },
    { name: "Asesorías PIE", detail: "Supervisión reflexiva para Programas de Integración Escolar.", price: "Plan" },
    { name: "Taller de terapia ocupacional comunitaria", detail: "Enfoque de derechos humanos, participación y territorio.", price: "Consultar" },
    { name: "Acompañamiento en terreno", detail: "Capacitación para equipos de salud mental comunitaria.", price: "Consultar" },
];

const advisory = [
    "Supervisión de casos en salud mental",
    "Orientación en evaluación e intervención",
    "Supervisión individual o grupal",
    "Apoyo en planificación e intervenciones",
    "Charlas clínicas y espacios de reflexión sobre buenas prácticas",
    "Trabajo interdisciplinario con equipos de salud y educación",
];

function TrainingCard({ item }: { item: { name: string; detail: string; price: string } }) {
    return (
        <article className="rounded-[8px] border border-[#eee8dc] bg-[#fffdf8] p-5">
            <h3 className="text-lg font-bold text-[#171713]">{item.name}</h3>
            <p className="mt-2 text-sm leading-7 text-[#70695f]">{item.detail}</p>
            <span className="mt-4 inline-flex rounded-[5px] border border-[#dec0a8] bg-[#f8f5ee] px-3 py-1 text-sm font-bold text-[#9f5528]">{item.price}</span>
        </article>
    );
}

export default function FormacionPage() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <section className="relative overflow-hidden border-b border-[#eee8dc] bg-[#171713] py-20 sm:py-28">
                <video className="absolute inset-0 h-full w-full object-cover opacity-25" src="/333.mp4" autoPlay muted loop playsInline preload="metadata" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#171713] via-[#171713]/90 to-[#171713]/55" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Link href="/servicios" className="inline-flex items-center gap-2 text-sm font-bold text-[#d8d0c4] hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                        Volver a servicios
                    </Link>
                    <div className="mt-8 max-w-4xl">
                        <span className="inline-flex items-center rounded-[5px] bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d8d0c4]">Formación y supervisión</span>
                        <h1 className="mt-7 text-4xl font-bold leading-tight text-white sm:text-5xl font-serif">
                            Formación aplicada, supervisión y asesoría para equipos.
                        </h1>
                        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#d8d0c4]">
                            Capacitaciones, jornadas clínicas, supervisión de casos y actualización técnica para profesionales, instituciones, comunidades educativas y equipos de intervención.
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#fffdf8] py-12">
                <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
                    {[
                        { video: "/111.mp4", title: "Aprendizaje situado", text: "Formación conectada con casos, equipos y contextos reales." },
                        { video: "/222.mp4", title: "Supervisión reflexiva", text: "Espacios para pensar decisiones, límites y buenas prácticas." },
                        { video: "/44.mp4", title: "Trabajo con comunidad", text: "Salud mental, inclusión, género y enfoque territorial." },
                    ].map((item) => (
                        <article key={item.title} className="overflow-hidden rounded-[8px] border border-[#eee8dc] bg-[#fffdf8] shadow-sm">
                            <div className="h-56 overflow-hidden bg-[#171713]">
                                <video className="h-full w-full object-cover opacity-90" src={item.video} autoPlay muted loop playsInline preload="metadata" />
                            </div>
                            <div className="p-5">
                                <h2 className="text-xl font-bold font-serif">{item.title}</h2>
                                <p className="mt-2 text-sm leading-7 text-[#70695f]">{item.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="border-b border-[#eee8dc] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Juan Carlos Rauld</span>
                            <h2 className="mt-3 text-3xl font-bold text-[#171713] font-serif">Crisis, infancia, evaluación y programas sociales</h2>
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#70695f]">
                                Formación para equipos que trabajan con infancia, familia, protección, intervención social y toma de decisiones complejas.
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {juanTraining.map((item) => <TrainingCard key={item.name} item={item} />)}
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] bg-[#f8f5ee] py-14 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-9">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bd6f3c]">Rocío Solar</span>
                        <h2 className="mt-3 text-3xl font-bold text-[#171713] font-serif">Salud mental, género, VIF, PIE y terapia ocupacional comunitaria</h2>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#70695f]">
                            Formación situada para equipos de salud, educación e intervención comunitaria, con foco en bienestar, derechos y buenas prácticas.
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {rocioTraining.map((item) => <TrainingCard key={item.name} item={item} />)}
                    </div>
                </div>
            </section>

            <section className="border-b border-[#eee8dc] py-14 sm:py-20">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
                    <div className="lg:col-span-4">
                        <MessageSquareText className="h-10 w-10 text-[#bd6f3c]" />
                        <h2 className="mt-5 text-3xl font-bold text-[#171713] font-serif">Supervisión y asesorías</h2>
                        <p className="mt-4 text-base leading-8 text-[#70695f]">
                            Instancias para colegas y equipos que requieren reflexión técnica, bienestar profesional, cuidado de la práctica y revisión de casos.
                        </p>
                    </div>
                    <div className="grid gap-3 lg:col-span-8">
                        {advisory.map((item) => (
                            <div key={item} className="flex items-start gap-3 rounded-[6px] border border-[#eee8dc] bg-[#f8f5ee] px-4 py-4">
                                <Check className="mt-1 h-4 w-4 shrink-0 text-[#bd6f3c]" />
                                <span className="text-sm font-semibold leading-7 text-[#3f423a]">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#f8f5ee] py-14">
                <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
                    {[
                        { icon: BookOpen, title: "Contenido con fundamento", text: "Marco conceptual, casos, discusión técnica y herramientas aplicables al trabajo cotidiano." },
                        { icon: Users, title: "Diseño para equipos", text: "Ajustamos duración, modalidad y profundidad según el contexto institucional." },
                        { icon: GraduationCap, title: "Aplicación práctica", text: "No solo exposición: buscamos transferencia a casos, protocolos y decisiones reales." },
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
                <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
                    <Link href="/contacto" className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#171713] px-6 py-3 text-sm font-bold text-white hover:bg-[#34362f]">
                        <Mail className="h-4 w-4" />
                        Solicitar propuesta formativa
                    </Link>
                    <Link href="/servicios" className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[#ded5c7] bg-[#fffdf8] px-6 py-3 text-sm font-bold text-[#171713] hover:border-[#bd6f3c]/50">
                        Ver otros servicios
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
