import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cierre comercial de cada columna. Va antes del NewsletterBlock: primero una
 * oferta ligada al tema que se acaba de leer, después la suscripción.
 *
 * Sin hooks ni estado: se puede usar desde componentes cliente o servidor.
 */

/**
 * Fin de la campaña del seminario (cohorte 1). La matrícula cierra el martes
 * 13 de octubre y la primera sesión es el jueves 15; desde el 15 de octubre,
 * hora de Chile (UTC-3 en octubre), la tarjeta del seminario pasa a
 * "Formación para equipos" y la navbar deja de invitar a postular.
 */
export const SEMINAR_CAMPAIGN_ENDS_AT = new Date("2026-10-15T00:00:00-03:00");

export function isSeminarCampaignActive(now: Date = new Date()) {
    return now.getTime() < SEMINAR_CAMPAIGN_ENDS_AT.getTime();
}

export const SEMINAR_PATH = "/seminarios/desproteccion-infancia";

export type ColumnCtaTopic = "seminario" | "compliance" | "salud-mental";

type CtaContent = {
    eyebrow: string;
    title: string;
    detail: string;
    label: string;
    href: string;
};

const CTA_BY_KIND: Record<ColumnCtaTopic | "formacion", CtaContent> = {
    seminario: {
        eyebrow: "Seminario en vivo",
        title: "Ocho jueves para leer el sistema de protección por dentro, con Juan Carlos Rauld.",
        detail: "Seminario Desprotección de la infancia · cohorte cerrada de 15 · cierra el 13 de octubre",
        label: "Ver el programa",
        href: `${SEMINAR_PATH}?utm_source=web&utm_medium=columna&utm_campaign=seminario-c1`,
    },
    compliance: {
        eyebrow: "Compliance escolar · Ley 21.809",
        title: "Cuando un caso de convivencia llega a tribunales, se revisa cómo decidió el colegio.",
        detail: "Revisamos protocolos, registros y rutas de decisión con el equipo directivo y de convivencia.",
        label: "Ver compliance escolar",
        href: "/servicios/compliance-escolar",
    },
    "salud-mental": {
        eyebrow: "Formación para equipos",
        title: "Salud mental infantil para equipos que trabajan con niños, niñas y adolescentes.",
        detail: "Jornadas y supervisión para escuelas, programas y fundaciones, a partir de los casos del propio equipo.",
        label: "Ver formación para instituciones",
        href: "/instituciones",
    },
    formacion: {
        eyebrow: "Formación para equipos",
        title: "Formación y supervisión para equipos que trabajan con infancia.",
        detail: "Programas cerrados para una institución, con fechas propias y casos del propio equipo.",
        label: "Ver formación",
        href: "/servicios/formacion",
    },
};

/** Minúsculas y sin tildes, para comparar categorías, títulos y etiquetas. */
function normalize(value: string) {
    return value
        .toLocaleLowerCase("es-CL")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
}

// Temas del sistema de protección: ganan aunque la categoría sea otra
// (p. ej. "Medicalizar la infancia... residencias de Mejor Niñez" es Salud Mental).
const PROTECTION_RE =
    /(proteccion|desproteccion|residencia|mejor ninez|sename|foucault|biopolitic|dictadura|tecnocrat|adopcion|institucionaliz|interes superior|derecho de familia)/;
const SCHOOL_RE = /(educacion|escuela|escolar|colegio|convivencia|docente)/;
const MENTAL_HEALTH_RE = /(salud mental|psiqui|psicoanal|suicid|medicaliz)/;

export function resolveColumnTopic({
    category = "",
    title = "",
    tags = [],
}: {
    category?: string;
    title?: string;
    tags?: string[];
}): ColumnCtaTopic {
    const cat = normalize(category);
    const text = normalize([title, ...tags].join(" "));

    if (PROTECTION_RE.test(text)) return "seminario";
    if (SCHOOL_RE.test(cat) || SCHOOL_RE.test(text)) return "compliance";
    if (MENTAL_HEALTH_RE.test(cat) || MENTAL_HEALTH_RE.test(text)) return "salud-mental";
    // Infancia, niñez, filosofía, política y todo lo demás: seminario.
    return "seminario";
}

type ColumnCtaProps = {
    category?: string;
    title?: string;
    tags?: string[];
    className?: string;
};

export function ColumnCta({ category, title, tags, className }: ColumnCtaProps) {
    const topic = resolveColumnTopic({ category, title, tags });
    const kind = topic === "seminario" && !isSeminarCampaignActive() ? "formacion" : topic;
    const cta = CTA_BY_KIND[kind];

    return (
        <aside
            aria-label={cta.eyebrow}
            data-column-cta={kind}
            className={cn(
                "mt-12 rounded-[6px] bg-[#15120e] p-6 text-[#f8f5ee] sm:mt-16 sm:p-8",
                className,
            )}
        >
            <p className="text-[0.8125rem] font-semibold text-[#e4935d]">{cta.eyebrow}</p>
            <span aria-hidden="true" className="mt-4 block h-[2px] w-10 bg-[#e4935d]" />
            <h2 className="crc-serif mt-4 max-w-[30ch] text-balance text-[1.35rem] font-semibold leading-[1.2] tracking-[-0.01em] text-[#fffdf8] sm:text-[1.6rem]">
                {cta.title}
            </h2>
            <p className="mt-3 max-w-[60ch] text-[0.9375rem] leading-[1.7] text-[#d8cfc0]">{cta.detail}</p>
            <Link
                href={cta.href}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#bd6f3c] px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-[#a85f31] sm:w-auto"
            >
                {cta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
        </aside>
    );
}
