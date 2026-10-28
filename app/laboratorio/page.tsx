import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { AltiusLogo } from "@/components/altius/AltiusLogo";
import { CaseTrackingPreview } from "@/components/altius/CaseTrackingPreview";
import {
    body,
    btnPrimary,
    btnPrimaryOnDark,
    btnSecondary,
    btnSecondaryOnDark,
    container,
    h1,
    h2,
    h3,
    label,
    labelOnDark,
    lead,
} from "@/app/servicios/_components/ui";

export const metadata: Metadata = pageMetadata({
    title: "Laboratorio CRC × Altius Ignite",
    description:
        "Metodologías del Centro de Reflexiones Críticas convertidas en herramientas digitales junto a Altius Ignite: autodiagnóstico de convivencia escolar, seguimiento de casos, indicadores y formación en línea.",
    path: "/laboratorio",
});

/**
 * Laboratorio CRC × Altius: la alianza tecnológica mostrada con herramientas
 * que funcionan, no con un banner. Cada herramienta dice en qué estado está.
 */

type Tool = {
    name: string;
    status: "Disponible" | "Para convenios";
    text: string;
    crc: string;
    altius: string;
    href?: string;
    cta?: string;
};

const TOOLS: Tool[] = [
    {
        name: "Autodiagnóstico de convivencia escolar",
        status: "Disponible",
        text: "Doce preguntas para que un equipo directivo vea dónde está su colegio frente a la Ley 21.809: protocolos, registros, rutas de decisión y seguimiento.",
        crc: "Criterios de compliance escolar y lectura de casos que llegan a tribunales.",
        altius: "Cuestionario, puntaje por área e informe imprimible.",
        href: "/autodiagnostico-convivencia-escolar",
        cta: "Hacer el autodiagnóstico",
    },
    {
        name: "Academia CRC",
        status: "Disponible",
        text: "Cursos en línea para profesionales de niñez y salud mental, con avance por lección, certificado y panel para docentes.",
        crc: "Contenidos, docentes y evaluación.",
        altius: "Plataforma, cuentas por rol, pagos y seguimiento de avance.",
        href: "/academia",
        cta: "Ver la Academia",
    },
    {
        name: "Seguimiento de casos para programas",
        status: "Para convenios",
        text: "Etapas, responsables y plazos de cada caso en un solo tablero, con alertas antes de que venza un informe o una derivación.",
        crc: "Modelo de intervención, etapas y criterios de decisión.",
        altius: "Flujo digital, CRM, alertas y tableros.",
        href: "/instituciones?servicio=consultoria#agenda",
        cta: "Conversar un piloto",
    },
    {
        name: "Indicadores para directorios y financistas",
        status: "Para convenios",
        text: "Reportería periódica sobre lo que el programa hace y logra, armada desde los registros que el equipo ya lleva.",
        crc: "Qué medir y cómo leerlo sin reducir la intervención a un número.",
        altius: "Integración de datos, tableros y reportes automáticos.",
        href: "/instituciones?servicio=consultoria#agenda",
        cta: "Conversar un piloto",
    },
];

const PRINCIPLES = [
    ["El criterio va primero", "La herramienta implementa un modelo de intervención definido por el equipo; no lo reemplaza."],
    ["Solo lo necesario", "Se registra lo que sirve para decidir y dar cuenta. Datos de niñez, con el mínimo indispensable."],
    ["Acceso por rol", "Cada persona ve lo que su función requiere, y cada cambio queda registrado."],
    ["Los datos son de la institución", "El programa puede exportar su información en cualquier momento."],
] as const;

export default function LaboratorioPage() {
    return (
        <div className="bg-[#f8f5ee] text-[#171713]">
            {/* Encabezado */}
            <section className="border-b border-[#d8cfc0]">
                <div className={`${container} grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16`}>
                    <div>
                        <p className={label}>Laboratorio CRC × Altius Ignite</p>
                        <h1 className={`${h1} mt-4 max-w-[22ch]`}>Metodologías del CRC convertidas en herramientas que se usan</h1>
                        <p className={`${lead} mt-6 max-w-[60ch]`}>
                            El CRC aporta el criterio técnico y la lectura crítica de la niñez y sus instituciones. Altius Ignite,
                            su partner tecnológico, lo convierte en flujos, datos y herramientas digitales que un equipo puede
                            operar el lunes.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="#herramientas" className={btnPrimary}>
                                Ver las herramientas <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                            <Link href="/instituciones?servicio=consultoria#agenda" className={btnSecondary}>
                                Conversar un proyecto
                            </Link>
                        </div>
                    </div>
                    <dl className="grid grid-cols-2 border-t border-[#d8cfc0]">
                        <div className="border-b border-r border-[#d8cfc0] py-5 pr-5">
                            <dt className="crc-serif text-[1.35rem] font-medium">CRC</dt>
                            <dd className={`${body} mt-2 text-[0.9375rem]`}>Investigación, modelos de intervención, formación y supervisión.</dd>
                        </div>
                        <div className="border-b border-[#d8cfc0] py-5 pl-5">
                            <dt className="text-[1.05rem] text-[#171713]">
                                <AltiusLogo />
                            </dt>
                            <dd className={`${body} mt-2 text-[0.9375rem]`}>Automatización, datos, CRM, IA aplicada y arquitectura digital.</dd>
                        </div>
                    </dl>
                </div>
            </section>

            {/* Herramientas */}
            <section id="herramientas" aria-labelledby="herramientas-title" className="scroll-mt-24 bg-[#fffdf8]">
                <div className={`${container} py-16 sm:py-24`}>
                    <p className={label}>Herramientas</p>
                    <h2 id="herramientas-title" className={`${h2} mt-3 max-w-[30ch]`}>
                        Lo que ya funciona y lo que se implementa por convenio
                    </h2>
                    <ul className="mt-12 border-t border-[#d8cfc0]">
                        {TOOLS.map((tool) => (
                            <li key={tool.name} className="grid gap-6 border-b border-[#d8cfc0] py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto] lg:items-start lg:gap-12">
                                <div>
                                    <p className="text-[0.8125rem] font-semibold text-[#6f675d]">{tool.status}</p>
                                    <h3 className={`${h3} mt-1`}>{tool.name}</h3>
                                    <p className={`${body} mt-3 max-w-[52ch]`}>{tool.text}</p>
                                </div>
                                <dl className="grid gap-4 text-[0.9375rem] leading-[1.6] sm:grid-cols-2">
                                    <div>
                                        <dt className="font-semibold text-[#171713]">Aporta el CRC</dt>
                                        <dd className="mt-1 text-[#55574f]">{tool.crc}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-semibold text-[#171713]">Aporta Altius</dt>
                                        <dd className="mt-1 text-[#55574f]">{tool.altius}</dd>
                                    </div>
                                </dl>
                                {tool.href ? (
                                    <Link
                                        href={tool.href}
                                        className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[#9f5528] underline decoration-[#bd6f3c]/45 underline-offset-4 hover:text-[#171713]"
                                    >
                                        {tool.cta}
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Ejemplo: seguimiento de casos */}
            <section aria-labelledby="ejemplo-title" className="bg-[#15120e] text-[#fbf7ee]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16`}>
                    <div>
                        <p className={labelOnDark}>Cómo se ve</p>
                        <h2 id="ejemplo-title" className={`${h2} mt-3`}>
                            Cada caso con su etapa, su responsable y su plazo
                        </h2>
                        <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-[#ede7dc]/80">
                            Un programa de protección no falla por falta de criterio, sino porque el criterio se pierde entre
                            planillas, correos y carpetas. El tablero hace visible qué caso necesita una acción hoy.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/instituciones?servicio=consultoria#agenda" className={btnPrimaryOnDark}>
                                Conversar un piloto <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                            <a href="https://www.altiusignite.com" target="_blank" rel="noopener noreferrer" className={btnSecondaryOnDark}>
                                Conocer Altius Ignite <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                    <CaseTrackingPreview />
                </div>
            </section>

            {/* Principios */}
            <section aria-labelledby="principios-title" className="border-t border-[#d8cfc0]">
                <div className={`${container} grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16`}>
                    <div>
                        <p className={label}>Principios</p>
                        <h2 id="principios-title" className={`${h2} mt-3`}>
                            Tecnología para instituciones que trabajan con niñez
                        </h2>
                    </div>
                    <dl className="grid gap-x-10 border-t border-[#d8cfc0] sm:grid-cols-2">
                        {PRINCIPLES.map(([title, text]) => (
                            <div key={title} className="border-b border-[#d8cfc0] py-6">
                                <dt className="crc-serif text-[1.2rem] font-medium">{title}</dt>
                                <dd className={`${body} mt-2`}>{text}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>
        </div>
    );
}
