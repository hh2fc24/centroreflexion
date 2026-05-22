"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Mail, MapPin, MessageCircle } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { useContent, useEditor } from "@/lib/editor/hooks";
import type { FooterColumn, FooterContent, FooterLink } from "@/lib/editor/types";

export function Footer({ initialFooter }: { initialFooter?: FooterContent }) {
    const { adminEnabled } = useEditor();
    const { content, get } = useContent();

    const footer = adminEnabled ? content.footer : initialFooter ?? content.footer;

    const instagramHref = footer?.instagramHref || get<string>("footer.instagramHref") || "#";
    const linkedinHref  = footer?.linkedinHref  || get<string>("footer.linkedinHref")  || "#";
    const whatsappHref  = footer?.whatsappHref  || get<string>("footer.whatsappHref")  || "#";
    const columns = (footer?.columns ?? get<FooterColumn[]>("footer.columns") ?? []) as FooterColumn[];

    return (
        <footer style={{ background: "#171713" }} className="border-t border-[rgba(176,145,100,0.18)]">
            {/* ── Top section ──────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                <div className="mb-10 flex flex-col gap-6 border-b border-[rgba(193,127,62,0.22)] pb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-fit items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f8f5ee] p-1 opacity-95">
                            <Image
                                src="/logo-crc.png"
                                alt="CRC"
                                width={44}
                                height={44}
                                className="h-11 w-11 object-contain"
                            />
                        </div>
                        <div className="flex min-w-fit flex-col">
                            <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#a99f91] leading-none">Centro de</span>
                            <span
                                className="whitespace-nowrap text-[13px] font-bold tracking-[0.08em] text-white leading-snug"
                                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                            >
                                Reflexiones Críticas
                            </span>
                        </div>
                    </div>

                    <a
                        href="https://www.editorialhammurabi.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex max-w-sm items-center gap-4 sm:justify-end sm:text-right"
                        aria-label="Editorial Hammurabi"
                        onClick={(e) => { if (adminEnabled) { e.preventDefault(); e.stopPropagation(); } }}
                    >
                        <span className="block">
                            <span className="mb-1 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#bd6f3c]">
                                Respaldo editorial
                            </span>
                            <span className="block text-xs leading-relaxed text-[#a99f91]">
                                Cursos y talleres CRC cuentan con respaldo de Editorial Hammurabi.
                            </span>
                        </span>
                        <Image
                            src="/images/editorial-hammurabi-logo-transparent.png"
                            alt="Editorial Hammurabi"
                            width={180}
                            height={177}
                            className="h-auto w-16 shrink-0 opacity-85 invert transition-opacity duration-200 group-hover:opacity-100 sm:w-20"
                        />
                    </a>
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand / Logo column */}
                    <div className="lg:col-span-1">
                        {/* Gold rule */}
                        <div className="w-8 h-[1px] bg-[#bd6f3c] mb-5" />

                        <p className="text-[#a99f91] text-sm leading-relaxed mb-7">
                            <EditableText path="footer.description" ariaLabel="Footer descripción" multiline />
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-4">
                            <a
                                href={instagramHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 border border-[rgba(193,127,62,0.35)] flex items-center justify-center text-[#a99f91] hover:text-white hover:border-[#bd6f3c] transition-all duration-200"
                                onClick={(e) => { if (adminEnabled) { e.preventDefault(); e.stopPropagation(); } }}
                            >
                                <Instagram className="h-4 w-4" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a
                                href={linkedinHref}
                                className="w-8 h-8 border border-[rgba(193,127,62,0.35)] flex items-center justify-center text-[#a99f91] hover:text-white hover:border-[#bd6f3c] transition-all duration-200"
                                onClick={(e) => { if (adminEnabled) { e.preventDefault(); e.stopPropagation(); } }}
                            >
                                <Linkedin className="h-4 w-4" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 border border-[rgba(193,127,62,0.35)] flex items-center justify-center text-[#a99f91] hover:text-white hover:border-[#bd6f3c] transition-all duration-200"
                                onClick={(e) => { if (adminEnabled) { e.preventDefault(); e.stopPropagation(); } }}
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span className="sr-only">WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    {/* Dynamic columns */}
                    {columns
                        .filter((c) => c?.visible !== false)
                        .map((col, colIdx) => (
                            <div key={col.id || colIdx}>
                                <h4 className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[#bd6f3c] mb-5">
                                    <EditableText path={`footer.columns.${colIdx}.title`} ariaLabel="Footer columna" />
                                </h4>
                                <ul className="space-y-3">
                                    {(col.links ?? [])
                                        .filter((l: FooterLink) => l?.visible !== false)
                                        .map((l: FooterLink, linkIdx: number) => (
                                            <li key={l.id || linkIdx}>
                                                <Link
                                                    href={l.href || "#"}
                                                    onClick={(e) => { if (adminEnabled) { e.preventDefault(); e.stopPropagation(); } }}
                                                    className="text-sm text-[#a99f91] hover:text-white transition-colors duration-200"
                                                >
                                                    <EditableText
                                                        path={`footer.columns.${colIdx}.links.${linkIdx}.label`}
                                                        ariaLabel="Footer link"
                                                    />
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        ))}

                    {/* Contact */}
                    <div>
                        <h4 className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-[#bd6f3c] mb-5">Contacto</h4>
                        <ul className="space-y-5 text-sm text-[#a99f91]">
                            <li className="flex items-start gap-3">
                                <Mail className="h-4 w-4 mt-0.5 text-[#bd6f3c] flex-shrink-0" />
                                <span className="break-all sm:break-normal">
                                    <Link href="/contacto" className="hover:text-white transition-colors duration-200">
                                        <EditableText path="footer.contactEmail" ariaLabel="Footer email" />
                                    </Link>
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 mt-0.5 text-[#bd6f3c] flex-shrink-0" />
                                <span>
                                    <EditableText path="footer.contactLocation" ariaLabel="Footer ubicación" />
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── Gold divider ────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(193,127,62,0.4)] to-transparent" />
            </div>

            {/* ── Bottom bar ──────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[0.72rem] text-[#7a6f61] tracking-wide text-center sm:text-left">
                    © {new Date().getFullYear()}{" "}
                    <EditableText path="footer.copyrightName" ariaLabel="Footer copyright" />.{" "}
                    Todos los derechos reservados.
                </p>
                <p className="text-[0.65rem] text-[#6f6254] tracking-[0.12em] uppercase">
                    Pensamiento · Evidencia · Diálogo · Transformación
                </p>
            </div>
        </footer>
    );
}
