import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { InstitucionesSections } from "./InstitucionesSections";

export const metadata: Metadata = pageMetadata({
    title: "Instituciones | Criterio experto en infancia para colegios y programas",
    description:
        "Compliance escolar, formación de equipos y consultoría para colegios, programas de protección, fundaciones y municipios que deben tomar decisiones difíciles sobre niños, niñas y adolescentes.",
    path: "/instituciones",
    keywords: [
        "compliance escolar",
        "Ley 21.809",
        "capacitación programas de protección",
        "consultoría infancia",
        "formación equipos PRM PPF DAM OPD",
        "oficinas locales de niñez",
    ],
    ogTitle: "Criterio experto para decisiones difíciles sobre infancia",
    ogDescription:
        "El CRC trabaja con colegios, programas de protección, fundaciones y municipios. Agenda 20 minutos con Hugo Hormazábal.",
});

/**
 * /instituciones: la puerta comercial para colegios, programas de protección,
 * fundaciones y municipios. Las secciones (con movimiento GSAP) viven en
 * InstitucionesSections; el formulario y el WhatsApp, en InstitucionesContact.
 */
export default function InstitucionesPage() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <InstitucionesSections />
        </main>
    );
}
