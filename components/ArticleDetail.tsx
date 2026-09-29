"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Link as LinkIcon, Instagram } from "lucide-react";
import { Article } from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { ColumnCta } from "@/components/ColumnCta";
import { EditorialHero, hasCoverImage, toSentenceCase } from "@/components/TypographicCover";

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
            <path d="M16 .5C7.44.5.5 7.44.5 16c0 2.83.74 5.49 2.03 7.8L.5 31.5l7.93-2.08A15.44 15.44 0 0 0 16 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 28.22a13.7 13.7 0 0 1-7-1.92l-.5-.3-5.18 1.36 1.38-5.04-.33-.52A13.72 13.72 0 1 1 16 28.72zm7.52-10.28c-.41-.2-2.43-1.2-2.81-1.33-.37-.14-.64-.2-.91.2-.27.4-1.05 1.33-1.28 1.6-.23.27-.47.3-.88.1-.41-.2-1.73-.64-3.3-2.04-1.22-1.09-2.04-2.43-2.28-2.84-.24-.41-.03-.63.18-.83.18-.18.41-.47.61-.7.2-.23.27-.4.41-.67.14-.27.07-.5-.03-.7-.1-.2-.91-2.2-1.25-3.01-.33-.8-.67-.69-.91-.7h-.78c-.27 0-.7.1-1.07.5-.37.4-1.4 1.37-1.4 3.34s1.43 3.87 1.63 4.14c.2.27 2.82 4.3 6.83 6.03.95.41 1.7.66 2.28.84.96.3 1.83.26 2.52.16.77-.11 2.43-1 2.77-1.96.34-.97.34-1.8.24-1.97-.1-.17-.37-.27-.78-.47z" />
        </svg>
    );
}

type AuthorProfile = { match: string; image: string | null; role: string };

/**
 * Ficha de autor. La firma vive aquí y no dentro del cuerpo de la columna:
 * el bloque "Escrito por" es la única atribución de la página.
 * El orden importa — las coautorías van antes que los nombres individuales.
 * Solo se usan retratos reales (docs/design-system-crc.md §4).
 */
const AUTHOR_DIRECTORY: AuthorProfile[] = [
    {
        match: "Rocío Solar y Juan Carlos Rauld",
        image: "/images/rocio_solar_real_white.png",
        role: "Directora Clínica del CRC · Director del CRC.",
    },
    {
        match: "Rocío Solar",
        image: "/images/rocio_solar_real_white.png",
        role: "Cofundadora y Directora Clínica del CRC · Terapeuta Ocupacional.",
    },
    {
        match: "Juan Carlos Rauld",
        image: "/images/juan_carlos_real_white.png",
        role: "Director Editorial del CRC. Doctorando Internacional en Trabajo Social, Universidad Rovira i Virgili. Magíster en Pensamiento Contemporáneo en Filosofía Política. Trabajador Social, Universidad Tecnológica Metropolitana.",
    },
    {
        match: "Hormazábal",
        image: "/images/hugo-hormazabal-crc-2026-large.png",
        role: "Socio · Director Comercial y de Desarrollo Institucional del CRC. Ingeniero Comercial, especialista en uso aplicado de inteligencia artificial.",
    },
    {
        match: "Alejandro Castro",
        image: null,
        role: "Doctor en Sociología. Departamento de Trabajo Social, Universidad Alberto Hurtado. Miembro de SOSAMCHI.",
    },
    { match: "Paulina Lara Riquelme", image: null, role: "Terapeuta Ocupacional." },
    {
        match: "Jeremy Nito Rodríguez Barra",
        image: null,
        role: "Mountain Train — Carpintería de Autor. Las Montañas de La Colorada, Coquimbo, Chile.",
    },
    { match: "Camilo Gallyas", image: null, role: "Psicólogo clínico." },
    { match: "Isaac Francisco Ruiz Muñoz", image: null, role: "Profesional del Trabajo Social." },
    { match: "Mónica Monje", image: null, role: "Psicóloga clínica." },
    { match: "Maximiliano Yáñez", image: null, role: "Departamento de Formación Integral, Universidad San Sebastián." },
    { match: "Camila Belmar", image: null, role: "Periodista, Universidad de Las Américas." },
    { match: "Georgette Palominos", image: null, role: "Pediatra de NANEAS." },
];

const getAuthorDetails = (author: string) => {
    return AUTHOR_DIRECTORY.find((profile) => author.includes(profile.match)) ?? null;
};

/* ------------------------------------------------------------------ */
/*  Imagen para compartir (Estado / Historia)                          */
/* ------------------------------------------------------------------ */

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
    const words = text.split(" ");
    let lines: string[] = [];
    let line = "";
    for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
        } else {
            line = test;
        }
    }
    lines.push(line);
    if (lines.length > maxLines) lines = [...lines.slice(0, maxLines - 1), `${lines[maxLines - 1]}…`];
    return lines;
}

/** Carga la imagen de la columna; null si no se puede (la portada tipográfica la reemplaza). */
async function loadImage(src: string): Promise<HTMLImageElement | null> {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = /^https?:\/\//.test(src) ? src : `${window.location.origin}${src}`;
    try {
        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("image load failed"));
        });
        return img;
    } catch {
        return null;
    }
}

/**
 * Genera la imagen que se comparte en WhatsApp o Instagram: la imagen editorial
 * de la columna con el título y la dirección del sitio. Si la columna no tiene
 * imagen, una portada tipográfica (tinta, filete cobre, título en Source Serif).
 */
async function buildShareImage(article: Article): Promise<File> {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No canvas context");

    const serifVar = getComputedStyle(document.body).getPropertyValue("--font-source-serif").trim();
    const serif = serifVar ? `${serifVar}, Georgia, serif` : "Georgia, serif";
    const sans = "-apple-system, BlinkMacSystemFont, sans-serif";

    const img = hasCoverImage(article.image) ? await loadImage(article.image) : null;

    if (img) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        const stripH = Math.max(180, canvas.height * 0.3);
        ctx.fillStyle = "rgba(21,18,14,0.88)";
        ctx.fillRect(0, canvas.height - stripH, canvas.width, stripH);
        const size = Math.max(20, Math.round(canvas.width * 0.04));
        ctx.font = `600 ${size}px ${serif}`;
        ctx.fillStyle = "#f8f5ee";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const lines = wrapLines(ctx, article.title, canvas.width * 0.85, 3);
        const lh = size * 1.25;
        const startY = canvas.height - lines.length * lh - 35;
        lines.forEach((l, i) => ctx.fillText(l, canvas.width / 2, startY + i * lh));
        ctx.font = `600 ${Math.max(13, Math.round(canvas.width * 0.025))}px ${sans}`;
        ctx.fillStyle = "#e4935d";
        ctx.fillText("centroreflexionescriticas.com", canvas.width / 2, canvas.height - 20);
    } else {
        canvas.width = 1080;
        canvas.height = 1350;
        const pad = 96;
        ctx.fillStyle = "#15120e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textBaseline = "alphabetic";
        ctx.textAlign = "left";
        ctx.fillStyle = "#e4935d";
        ctx.font = `600 34px ${sans}`;
        ctx.fillText(toSentenceCase(article.category), pad, pad + 34);
        ctx.fillStyle = "#d8cfc0";
        ctx.font = `400 30px ${sans}`;
        ctx.fillText(article.date, pad, pad + 84);

        ctx.font = `600 76px ${serif}`;
        const lines = wrapLines(ctx, article.title, canvas.width - pad * 2, 7);
        const lh = 76 * 1.15;
        const blockBottom = canvas.height - 250;
        const startY = blockBottom - (lines.length - 1) * lh;
        ctx.fillStyle = "#e4935d";
        ctx.fillRect(pad, startY - 76 - 40, 96, 4);
        ctx.fillStyle = "#f8f5ee";
        lines.forEach((l, i) => ctx.fillText(l, pad, startY + i * lh));

        ctx.fillStyle = "#d8cfc0";
        ctx.font = `400 32px ${sans}`;
        ctx.fillText(article.author, pad, canvas.height - 170);
        ctx.fillStyle = "#e4935d";
        ctx.font = `600 30px ${sans}`;
        ctx.fillText("centroreflexionescriticas.com", pad, canvas.height - pad);
    }

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) throw new Error("Canvas toBlob failed");
    return new File([blob], "columna-crc.jpg", { type: "image/jpeg" });
}

/* ------------------------------------------------------------------ */
/*  Barra para compartir                                               */
/* ------------------------------------------------------------------ */

type ShareLocation = "upper" | "lower";

const iconButton =
    "inline-flex h-10 w-10 items-center justify-center rounded-[6px] border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bd6f3c]";
const iconIdle = "border-[#d8cfc0] text-[#55574f] hover:border-[#9f5528] hover:text-[#9f5528]";
const iconActive = "border-[#9f5528] text-[#9f5528]";
const menuClass =
    "absolute bottom-full right-0 z-50 mb-2 min-w-[168px] overflow-hidden rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8] shadow-[0_8px_24px_rgba(21,18,14,0.12)]";
const menuItem =
    "block w-full px-4 py-3 text-left text-[0.875rem] font-semibold text-[#171713] transition-colors hover:bg-[#f8f5ee] hover:text-[#9f5528]";

export default function ArticleDetail({
    article,
    backHref = "/pensamiento-critico",
    backLabel = "Volver a Pensamiento Crítico",
}: {
    article: Article;
    backHref?: string;
    backLabel?: string;
}) {
    const [copied, setCopied] = useState<ShareLocation | null>(null);
    const [openMenu, setOpenMenu] = useState<{ kind: "wa" | "ig"; at: ShareLocation } | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-share-menu]")) setOpenMenu(null);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const pageUrl = () => (typeof window !== "undefined" ? window.location.href : "");

    const handleCopy = async (at: ShareLocation) => {
        try {
            await navigator.clipboard.writeText(pageUrl());
            setCopied(at);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    /** Estado de WhatsApp / Historia de Instagram: comparte la imagen generada. */
    const shareImage = async (fallback: "whatsapp" | "none") => {
        setOpenMenu(null);
        if (typeof window === "undefined") return;
        const url = pageUrl();
        try {
            await navigator.clipboard.writeText(url);
        } catch {}
        try {
            const file = await buildShareImage(article);
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: article.title, text: url });
                return;
            }
        } catch {}
        if (navigator.share) {
            try {
                await navigator.share({ title: article.title, text: article.excerpt, url });
            } catch {}
        } else if (fallback === "whatsapp") {
            window.open(`https://wa.me/?text=${encodeURIComponent(`${article.title} - ${url}`)}`, "_blank");
        }
    };

    const handleWhatsAppMessage = () => {
        setOpenMenu(null);
        window.open(`https://wa.me/?text=${encodeURIComponent(`${article.title} - ${pageUrl()}`)}`, "_blank");
    };

    const handleInstagramShare = async () => {
        setOpenMenu(null);
        const url = pageUrl();
        if (navigator.share) {
            try {
                await navigator.share({ title: article.title, text: `${article.excerpt}\n\n${url}`, url });
            } catch {}
        } else {
            try {
                await navigator.clipboard.writeText(url);
            } catch {}
        }
    };

    const toggleMenu = (kind: "wa" | "ig", at: ShareLocation) =>
        setOpenMenu((current) => (current?.kind === kind && current.at === at ? null : { kind, at }));

    const renderShare = (at: ShareLocation) => {
        const waOpen = openMenu?.kind === "wa" && openMenu.at === at;
        const igOpen = openMenu?.kind === "ig" && openMenu.at === at;
        return (
            <div className="flex items-center gap-2">
                <div className="relative" data-share-menu>
                    <button
                        type="button"
                        aria-label="Compartir por WhatsApp"
                        aria-expanded={waOpen}
                        onClick={() => toggleMenu("wa", at)}
                        className={`${iconButton} ${waOpen ? iconActive : iconIdle}`}
                    >
                        <WhatsAppIcon className="h-[18px] w-[18px]" />
                    </button>
                    {waOpen ? (
                        <div className={menuClass}>
                            <button type="button" onClick={() => shareImage("whatsapp")} className={menuItem}>
                                Estado
                            </button>
                            <div className="h-px bg-[#eee8dc]" />
                            <button type="button" onClick={handleWhatsAppMessage} className={menuItem}>
                                Mensaje
                            </button>
                        </div>
                    ) : null}
                </div>

                <div className="relative" data-share-menu>
                    <button
                        type="button"
                        aria-label="Compartir en Instagram"
                        aria-expanded={igOpen}
                        onClick={() => toggleMenu("ig", at)}
                        className={`${iconButton} ${igOpen ? iconActive : iconIdle}`}
                    >
                        <Instagram className="h-[18px] w-[18px]" />
                    </button>
                    {igOpen ? (
                        <div className={menuClass}>
                            <button type="button" onClick={() => shareImage("none")} className={menuItem}>
                                Historia
                            </button>
                            <div className="h-px bg-[#eee8dc]" />
                            <button type="button" onClick={handleInstagramShare} className={menuItem}>
                                Mensaje o publicación
                            </button>
                        </div>
                    ) : null}
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => handleCopy(at)}
                        aria-label="Copiar enlace"
                        className={`${iconButton} ${iconIdle}`}
                    >
                        {copied === at ? <Check className="h-[18px] w-[18px]" /> : <LinkIcon className="h-[18px] w-[18px]" />}
                    </button>
                    {copied === at ? (
                        <span
                            role="status"
                            className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-[#15120e] px-3 py-1.5 text-[0.8125rem] font-semibold text-[#f8f5ee]"
                        >
                            Enlace copiado
                        </span>
                    ) : null}
                </div>
            </div>
        );
    };

    const details = getAuthorDetails(article.author);

    const renderLinkedText = (text: string) =>
        text.split(/(https?:\/\/\S+)/g).map((part, partIndex) =>
            part.startsWith("http") ? (
                <a
                    key={partIndex}
                    href={part}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-[#9f5528] underline underline-offset-2"
                >
                    {part}
                </a>
            ) : (
                part
            ),
        );

    const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const lower = article.content.map((p) => p.toLowerCase());
    const refHeaderIndex = lower.findIndex(
        (p) => p.startsWith("referencias integradas") || p.startsWith("referencias bibliográficas"),
    );
    const noteHeaderIndex = lower.findIndex(
        (p) =>
            p.startsWith("nota:") ||
            p.startsWith("nota de la redacción:") ||
            p.startsWith("columna publicada originalmente") ||
            p.startsWith("publicado originalmente"),
    );
    const authorTokens = normalize(article.author).split(/\s+/).filter((token) => token.length > 3);

    return (
        <article className="min-h-screen bg-[#fffdf8] pb-16 sm:pb-24">
            {/* Cabecera: h1 e imagen editorial (portada tipográfica si no hay imagen) */}
            <EditorialHero
                titleAs="h1"
                category={article.category}
                title={article.title}
                date={article.date}
                dek={article.excerpt}
                image={article.image}
                imageAlt={article.imageAlt}
                imageCaption={article.imageCaption}
                containerClassName="max-w-[44rem] sm:px-6"
                imageContainerClassName="max-w-[56rem] sm:px-6"
            >
                <Link
                    href={backHref}
                    className="mt-10 inline-flex items-center gap-2 text-[0.9375rem] font-semibold underline-offset-4 opacity-90 hover:underline hover:opacity-100"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {backLabel}
                </Link>
            </EditorialHero>

            <div className="mx-auto max-w-[44rem] px-4 sm:px-6">
                {/* Firma y compartir */}
                <div className="flex flex-col gap-5 border-b border-[#d8cfc0] py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        {details?.image ? (
                            <Image
                                src={details.image}
                                alt=""
                                width={44}
                                height={44}
                                className="h-11 w-11 rounded-full bg-[#eee8dc] object-cover"
                            />
                        ) : null}
                        <div>
                            <p className="text-[0.9375rem] font-semibold text-[#171713]">{article.author}</p>
                            <p className="text-[0.875rem] tabular-nums text-[#6f675d]">{article.date}</p>
                        </div>
                    </div>
                    {renderShare("upper")}
                </div>

                {/* Cuerpo: Source Serif 4, ~65 caracteres, interlineado 1.7 */}
                <div className="crc-serif mt-10 max-w-[65ch] text-[1.0625rem] leading-[1.7] text-[#171713] sm:text-[1.125rem]">
                    {article.content.map((paragraph, index, arr) => {
                        const isReferenceHeader = index === refHeaderIndex;
                        const isReference = refHeaderIndex !== -1 && index > refHeaderIndex;
                        const isNote =
                            noteHeaderIndex !== -1 && index >= noteHeaderIndex && !isReferenceHeader && !isReference;

                        // Firma de cierre: última línea con el nombre y las credenciales del autor
                        const plain = normalize(paragraph);
                        const isSignature =
                            index === arr.length - 1 &&
                            !isReferenceHeader &&
                            !isReference &&
                            !isNote &&
                            paragraph.length < 400 &&
                            (plain.startsWith("por ") ||
                                authorTokens.some((token) => plain.startsWith(token)) ||
                                /^(psicolog|trabajador|abogad|sociolog|ingenier|docente|profesor|magister|doctor|licenciad|terapeuta|antropolog|periodista)/.test(plain));

                        if (isReferenceHeader) {
                            return (
                                <h2
                                    key={index}
                                    className="mb-5 mt-14 border-b border-[#d8cfc0] pb-3 font-sans text-[1.125rem] font-semibold text-[#171713]"
                                >
                                    Referencias
                                </h2>
                            );
                        }

                        if (isReference) {
                            const cleanRef = paragraph.replace(/^•\s*/, "");
                            return (
                                <p key={index} className="mb-3 break-words pl-6 -indent-6 font-sans text-[0.9375rem] leading-[1.6] text-[#55574f]">
                                    {renderLinkedText(cleanRef)}
                                </p>
                            );
                        }

                        if (paragraph.startsWith("## ")) {
                            return (
                                <h2
                                    key={index}
                                    className="mb-5 mt-14 text-balance text-[clamp(1.4rem,2vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.01em] text-[#171713]"
                                >
                                    {paragraph.slice(3)}
                                </h2>
                            );
                        }

                        if (paragraph.startsWith("> ")) {
                            return (
                                <blockquote
                                    key={index}
                                    className="my-10 border-y border-[#d8cfc0] py-6 text-[1.2rem] italic leading-[1.6] text-[#55574f] sm:text-[1.3rem]"
                                >
                                    {paragraph.slice(2)}
                                </blockquote>
                            );
                        }

                        if (isNote) {
                            return (
                                <p
                                    key={index}
                                    className={`mb-4 font-sans text-[0.9375rem] leading-[1.6] text-[#55574f]${
                                        index === noteHeaderIndex ? " mt-10 border-t border-[#d8cfc0] pt-6" : ""
                                    }`}
                                >
                                    {renderLinkedText(paragraph)}
                                </p>
                            );
                        }

                        if (isSignature) {
                            return (
                                <p
                                    key={index}
                                    className="mt-12 border-t border-[#d8cfc0] pt-6 font-sans text-[0.9375rem] leading-[1.6] text-[#55574f]"
                                >
                                    {paragraph}
                                </p>
                            );
                        }

                        if (paragraph.startsWith("• ")) {
                            return (
                                <p key={index} className="mb-3 pl-6 -indent-5">
                                    {paragraph}
                                </p>
                            );
                        }

                        if (/^\d+\.\s/.test(paragraph)) {
                            return (
                                <p key={index} className="mb-5 pl-7 -indent-7">
                                    {paragraph}
                                </p>
                            );
                        }

                        return (
                            <p key={index} className="mb-6">
                                {paragraph}
                            </p>
                        );
                    })}
                </div>

                {/* Compartir al final */}
                <div className="mt-12 flex flex-col gap-4 border-y border-[#d8cfc0] py-6 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[0.9375rem] font-semibold text-[#171713]">Compartir este texto</span>
                    {renderShare("lower")}
                </div>

                {/* Autor */}
                <div className="mt-12 flex items-start gap-4">
                    {details?.image ? (
                        <Image
                            src={details.image}
                            alt=""
                            width={64}
                            height={64}
                            className="h-16 w-16 shrink-0 rounded-full bg-[#eee8dc] object-cover"
                        />
                    ) : null}
                    <div>
                        <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Escrito por</p>
                        <h2 className="crc-serif mt-1 text-[1.35rem] font-semibold leading-[1.2] text-[#171713]">
                            {article.author}
                        </h2>
                        {details?.role ? (
                            <p className="mt-2 max-w-[60ch] text-[0.9375rem] leading-[1.6] text-[#55574f]">{details.role}</p>
                        ) : null}
                    </div>
                </div>

                {/* Oferta ligada al tema de la columna, antes de la suscripción */}
                <ColumnCta category={article.category} title={article.title} />

                {/* Suscripción */}
                <NewsletterBlock origen={article.category} />

                <JsonLd article={article} />
            </div>
        </article>
    );
}
