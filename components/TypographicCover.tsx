import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Imagen editorial y portada tipográfica para columnas, reseñas y trabajos.
 *
 * Las imágenes editoriales del CRC son la línea del centro: cada contenido
 * muestra la suya con `CoverImage`. La portada tipográfica (bloque de color
 * según la categoría, filete cobre y título en Source Serif) queda solo como
 * respaldo cuando un contenido no tiene imagen.
 * Ver docs/design-system-crc.md (§4 Imágenes).
 */

/* ------------------------------------------------------------------ */
/*  Imagen editorial                                                   */
/* ------------------------------------------------------------------ */

/** true si el contenido tiene imagen editorial propia (guía §4). */
export function hasCoverImage(src?: string | null): src is string {
    return typeof src === "string" && src.trim().length > 0;
}

/** Imagen de respaldo de los trabajos intelectuales sin imagen propia. */
export const ACADEMIC_FALLBACK_IMAGE = "/images/infancia_estado_hero.jpg";

export type CoverImageProps = {
    src: string;
    alt: string;
    /** Atributo `sizes` de next/image. */
    sizes?: string;
    priority?: boolean;
    /** Clases del marco (proporción, ancho). Por defecto 3:2 en móvil y 4:3 desde sm. */
    className?: string;
};

/**
 * Imagen editorial con el tratamiento sobrio de la guía: encuadre limpio,
 * `rounded-[6px]`, `object-cover`, sin filtros, sin grano y sin degradados.
 */
export function CoverImage({ src, alt, sizes = "100vw", priority, className }: CoverImageProps) {
    return (
        <div className={cn("relative aspect-[3/2] w-full overflow-hidden rounded-[6px] bg-[#eee8dc] sm:aspect-[4/3]", className)}>
            <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        </div>
    );
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

/* ------------------------------------------------------------------ */
/*  Cabecera de detalle con imagen editorial                           */
/* ------------------------------------------------------------------ */

export type EditorialHeroProps = Omit<TypographicCoverProps, "size"> & {
    image?: string | null;
    imageAlt?: string;
    imageCaption?: string;
    /** Ancho del bloque de la imagen. */
    imageContainerClassName?: string;
};

/**
 * Cabecera de columnas, reseñas y artículos. Con imagen: texto sobre papel
 * (categoría, filete cobre, h1, bajada) y la imagen editorial debajo, limpia,
 * sin texto encima. Sin imagen: portada tipográfica como respaldo.
 */
export function EditorialHero({
    image,
    imageAlt,
    imageCaption,
    imageContainerClassName,
    category,
    title,
    date,
    author,
    titleAs = "h1",
    dek,
    tone,
    children,
    className,
    containerClassName,
}: EditorialHeroProps) {
    if (!hasCoverImage(image)) {
        return (
            <TypographicCover
                size="hero"
                category={category}
                title={title}
                date={date}
                author={author}
                titleAs={titleAs}
                dek={dek}
                tone={tone}
                className={className}
                containerClassName={containerClassName}
            >
                {children}
            </TypographicCover>
        );
    }

    const Title = titleAs;
    return (
        <header className={cn("w-full border-b border-[#d8cfc0] bg-[#fffdf8] text-[#171713]", className)}>
            <div className={cn("mx-auto max-w-5xl px-4 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-16", containerClassName)}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.8125rem] font-semibold">
                    <span className="text-[#9f5528]">{toSentenceCase(category)}</span>
                    {date ? <span className="font-normal tabular-nums text-[#6f675d]">{date}</span> : null}
                </div>
                <span aria-hidden="true" className="mt-5 block h-[2px] w-12 bg-[#bd6f3c]" />
                <Title className="crc-serif mt-5 max-w-[24ch] text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-[#171713]">
                    {displayTitle(title)}
                </Title>
                {dek ? <p className="mt-6 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">{dek}</p> : null}
                {author ? <p className="mt-6 text-[0.9375rem] font-semibold text-[#171713]">{author}</p> : null}
                {children}
            </div>
            <figure className={cn("mx-auto max-w-5xl px-4 pb-10 sm:px-8 sm:pb-14", imageContainerClassName)}>
                <CoverImage
                    src={image}
                    alt={imageAlt || title}
                    priority
                    sizes="(min-width: 1024px) 960px, 100vw"
                    className="aspect-[3/2] sm:aspect-[16/9]"
                />
                {imageCaption ? (
                    <figcaption className="mt-3 text-[0.875rem] text-[#6f675d]">{imageCaption}</figcaption>
                ) : null}
            </figure>
        </header>
    );
}
