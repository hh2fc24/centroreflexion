import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { InstitucionesSections } from "./InstitucionesSections";

export const metadata: Metadata = pageMetadata({
    title: "Instituciones | Consultoría y capacitación en niñez y juventud para colegios y programas",
    description:
        "Compliance escolar, formación de equipos y consultoría para colegios, programas de protección, fundaciones y municipios que deben tomar decisiones difíciles sobre niños, niñas y adolescentes.",
    path: "/instituciones",
    keywords: [
        "compliance escolar",
        "Ley 21.809",
        "capacitación programas de protección",
        "consultoría niñez y juventud",
        "formación equipos PRM PPF DAM OPD",
        "oficinas locales de niñez",
    ],
    ogTitle: "Pensamiento crítico para decisiones difíciles sobre niñez y juventud",
    ogDescription:
        "El CRC trabaja con colegios, programas de protección, fundaciones y municipios. Agenda 20 minutos con Hugo Hormazábal.",
});

/**
 * /instituciones: la puerta comercial para colegios, programas de protección,
 * fundaciones y municipios. Las secciones viven en InstitucionesSections (la
 * oferta sale de app/servicios/_components/engagements.ts); el formulario y el
 * WhatsApp, en InstitucionesContact.
 */
export default function InstitucionesPage() {
    return (
        <main className="bg-[#fffdf8] text-[#171713]">
            <InstitucionesSections />
        </main>
    );
}
