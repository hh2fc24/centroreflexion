import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Portada tipográfica para columnas, reseñas y trabajos académicos.
 *
 * Reemplaza las ilustraciones generadas: bloque de color de la paleta según
 * la categoría, la categoría en tipo oración, un filete cobre y el título en
 * Source Serif. Sin imágenes, sin degradados, sin animación.
 * Ver docs/design-system-crc.md (§4 Imágenes).
 */

/* ------------------------------------------------------------------ */
/*  Imágenes reales permitidas                                         */
/* ------------------------------------------------------------------ */

/** Archivos de /public que son fotos o portadas reales (guía §4). */
const REAL_PHOTO_FILES = new Set([
    // Retratos del equipo
    "juan_carlos_real_white.png",
    "juan-carlos-rauld-retrato.jpg",
    "juan-carlos-rauld-furia-del-libro.jpg",
    "rocio-solar-crc-2026.png",
    "rocio_solar_real_white.png",
    "hugo-hormazabal-crc-2026-large.png",
    "fernanda-gumucio.jpg",
    // Portadas de libros y afiche real
    "book_desproteccion.png",
    "book_perspectivas.png",
    "tecnocratas-portada.jpg",
    "tecnocratas-evento-uah.jpeg",
]);

/**
 * true solo si `src` apunta a una foto real permitida. Todo lo demás
 * (archivos con _abstract_, timestamps, -editorial, *_real.*, hero_*, etc.)
 * se trata como ilustración y se reemplaza por la portada tipográfica.
 */
export function isRealPhoto(src?: string | null): boolean {
    if (!src) return false;
    const clean = src.split(/[?#]/)[0];
    const file = clean.slice(clean.lastIndexOf("/") + 1).toLowerCase();
    return REAL_PHOTO_FILES.has(file);
}

/* ------------------------------------------------------------------ */
/*  Tono según categoría                                               */
/* ------------------------------------------------------------------ */

export type CoverTone = "ink" | "copper" | "sand";

function normalize(value: string) {
    return value
        .toLocaleLowerCase("es-CL")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
}

export function coverToneForCategory(category = ""): CoverTone {
    const cat = normalize(category);
    if (/salud mental|psico|psiqui/.test(cat)) return "copper";
    if (/infancia|ninez|investigacion|academic|proteccion/.test(cat)) return "ink";
    return "sand";
}

const TONES: Record<
    CoverTone,
    { block: string; label: string; rule: string; title: string; meta: string }
> = {
    ink: {
        block: "bg-[#15120e] text-[#f8f5ee]",
        label: "text-[#e4935d]",
        rule: "bg-[#e4935d]",
        title: "text-[#f8f5ee]",
        meta: "text-[#d8cfc0]",
    },
    copper: {
        block: "bg-[#9f5528] text-[#f8f5ee]",
        label: "text-[#f8f5ee]",
        rule: "bg-[#f8f5ee]/70",
        title: "text-[#fffdf8]",
        meta: "text-[#eee8dc]",
    },
    sand: {
        block: "bg-[#eee8dc] text-[#171713]",
        label: "text-[#9f5528]",
        rule: "bg-[#bd6f3c]",
        title: "text-[#171713]",
        meta: "text-[#55574f]",
    },
};

const PROPER_NOUNS: Record<string, string> = {
    chile: "Chile",
    "américa": "América",
    latina: "Latina",
    foucault: "Foucault",
    sename: "Sename",
};

/** Títulos escritos enteros en mayúsculas pasan a tipo oración; el resto se respeta. */
export function displayTitle(title = ""): string {
    return title === title.toLocaleUpperCase("es-CL") && /[A-ZÁÉÍÓÚÑ]{3}/.test(title) ? toSentenceCase(title) : title;
}

/**
 * Pasa "Infancia y Niñez" a "Infancia y niñez" y "INTRODUCCIÓN" a
 * "Introducción". En textos con mayúsculas y minúsculas respeta las
 * abreviaturas reales (CRC, PIE, OPD, UF, NANEAS).
 */
export function toSentenceCase(value = ""): string {
    const words = value.trim().split(/\s+/).filter(Boolean);
    const allCaps = value === value.toLocaleUpperCase("es-CL");
    return words
        .map((word, index) => {
            const isAbbreviation =
                !allCaps && word.length > 1 && word === word.toLocaleUpperCase("es-CL") && /[A-ZÁÉÍÓÚÑ]/.test(word);
            if (isAbbreviation) return word;
            const lower = word.toLocaleLowerCase("es-CL");
            const startsSentence = index === 0 || /[.:?!]["”»]?$/.test(words[index - 1]);
            if (startsSentence) {
                const first = lower.search(/[a-záéíóúñü]/);
                return first < 0 ? lower : lower.slice(0, first) + lower.charAt(first).toLocaleUpperCase("es-CL") + lower.slice(first + 1);
            }
            const bare = lower.replace(/[.,;:]$/, "");
            return PROPER_NOUNS[bare] ? PROPER_NOUNS[bare] + lower.slice(bare.length) : lower;
        })
        .join(" ");
}

/* ------------------------------------------------------------------ */
/*  Componente                                                         */
/* ------------------------------------------------------------------ */

type HeadingTag = "h1" | "h2" | "h3" | "p";

export type TypographicCoverProps = {
    category: string;
    title: string;
    date?: string;
    author?: string;
    /** "card" para listados, "hero" para cabecera de columna o artículo. */
    size?: "card" | "hero";
    /** Etiqueta del título. En la cabecera de un artículo es el h1. */
    titleAs?: HeadingTag;
    /** Bajada (solo hero). */
    dek?: string;
    /** Fuerza un tono; por defecto se deduce de la categoría. */
    tone?: CoverTone;
    /** Contenido extra al pie del hero (enlace de vuelta, metadatos). */
    children?: ReactNode;
    className?: string;
    /** Ancho del contenido del hero, para alinearlo con la columna de lectura. */
    containerClassName?: string;
};

export function TypographicCover({
    category,
    title,
    date,
    author,
    size = "card",
    titleAs = "p",
    dek,
    tone,
    children,
    className,
    containerClassName,
}: TypographicCoverProps) {
    const palette = TONES[tone ?? coverToneForCategory(category)];
    const Title = titleAs;
    const label = toSentenceCase(category);

    if (size === "hero") {
        return (
            <div className={cn("w-full", palette.block, className)}>
                <div className={cn("mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16 lg:py-20", containerClassName)}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.8125rem] font-semibold">
                        <span className={palette.label}>{label}</span>
                        {date ? <span className={cn("font-normal tabular-nums", palette.meta)}>{date}</span> : null}
                    </div>
                    <span aria-hidden="true" className={cn("mt-5 block h-[2px] w-12", palette.rule)} />
                    <Title
                        className={cn(
                            "crc-serif mt-5 max-w-[22ch] text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.01em]",
                            palette.title,
                        )}
                    >
                        {displayTitle(title)}
                    </Title>
                    {dek ? (
                        <p className={cn("mt-6 max-w-[60ch] text-[1.0625rem] leading-[1.7]", palette.meta)}>{dek}</p>
                    ) : null}
                    {author ? (
                        <p className={cn("mt-6 text-[0.9375rem] font-semibold", palette.title)}>{author}</p>
                    ) : null}
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "flex aspect-[3/2] w-full flex-col justify-between rounded-[6px] p-5 sm:aspect-[4/3] sm:p-6",
                palette.block,
                className,
            )}
        >
            <div className="flex items-baseline justify-between gap-3 text-[0.8125rem] font-semibold">
                <span className={cn("truncate", palette.label)}>{label}</span>
                {date ? <span className={cn("shrink-0 font-normal tabular-nums", palette.meta)}>{date}</span> : null}
            </div>
            <div>
                <span aria-hidden="true" className={cn("block h-[2px] w-10", palette.rule)} />
                <Title
                    className={cn(
                        "crc-serif mt-4 line-clamp-4 text-balance text-[1.3rem] font-semibold leading-[1.15] tracking-[-0.01em] sm:text-[1.4rem]",
                        palette.title,
                    )}
                >
                    {displayTitle(title)}
                </Title>
                {author ? (
                    <p className={cn("mt-3 truncate text-[0.875rem]", palette.meta)}>{author}</p>
                ) : null}
            </div>
        </div>
    );
}
