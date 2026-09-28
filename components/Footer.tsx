"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Mail, MapPin, MessageCircle, Youtube } from "lucide-react";
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
    const youtubeHref   = footer?.youtubeHref   || get<string>("footer.youtubeHref")   || "https://www.youtube.com/@CentrodeReflexionesCr%C3%ADticas";
    const columns = (footer?.columns ?? get<FooterColumn[]>("footer.columns") ?? []) as FooterColumn[];

    // Un icono social sin URL real es un enlace muerto: mejor no mostrarlo.
    const hasHref = (href: string) => Boolean(href) && href !== "#";

    return (
        <footer className="border-t border-white/10 bg-[#15120e]">
            {/* ── Top section ──────────────────────────────────────── */}
            <div className="mx-auto max-w-[1640px] px-5 pb-12 pt-16 sm:px-8 lg:px-14 xl:px-20">
                <div className="mb-10 flex flex-col gap-6 border-b border-white/12 pb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-fit items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] bg-[#f8f5ee] p-1">
                            <Image
                                src="/logo-crc.png"
                                alt="CRC"
                                width={44}
                                height={44}
                                className="h-11 w-11 object-contain"
                            />
                        </div>
                        <span className="crc-serif text-[1.125rem] font-semibold leading-tight text-white">
                            Centro de Reflexiones Críticas
                        </span>
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
                            <span className="mb-1 block text-[0.8125rem] font-semibold text-[#e4935d]">
                                Respaldo editorial
                            </span>
                            <span className="block text-[0.875rem] leading-relaxed text-[#a99f91]">
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

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)]">

                    {/* Brand / Logo column */}
                    <div className="lg:col-span-1">
                        <p className="mb-7 max-w-[40ch] text-[0.9375rem] leading-[1.7] text-[#a99f91]">
                            <EditableText path="footer.description" ariaLabel="Footer descripción" multiline />
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-4">
                            <a
                                href={instagramHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-white/15 text-[#a99f91] transition-colors duration-200 hover:border-[#e4935d] hover:text-white"
                                onClick={(e) => { if (adminEnabled) { e.preventDefault(); e.stopPropagation(); } }}
                            >
                                <Instagram className="h-4 w-4" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            {(hasHref(linkedinHref) || adminEnabled) && (
                                <a
                                    href={linkedinHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-white/15 text-[#a99f91] transition-colors duration-200 hover:border-[#e4935d] hover:text-white"
                                    onClick={(e) => { if (adminEnabled) { e.preventDefault(); e.stopPropagation(); } }}
                                >
                                    <Linkedin className="h-4 w-4" />
                                    <span className="sr-only">LinkedIn</span>
                                </a>
                            )}
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-white/15 text-[#a99f91] transition-colors duration-200 hover:border-[#e4935d] hover:text-white"
                                onClick={(e) => { if (adminEnabled) { e.preventDefault(); e.stopPropagation(); } }}
                            >
                                <MessageCircle className="h-4 w-4" />
                                <span className="sr-only">WhatsApp</span>
                            </a>
                            <a
                                href={youtubeHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-white/15 text-[#a99f91] transition-colors duration-200 hover:border-[#e4935d] hover:text-white"
                                onClick={(e) => { if (adminEnabled) { e.preventDefault(); e.stopPropagation(); } }}
                            >
                                <Youtube className="h-4 w-4" />
                                <span className="sr-only">YouTube</span>
                            </a>
                        </div>
                    </div>

                    {/* Dynamic columns */}
                    {columns
                        .filter((c) => c?.visible !== false)
                        .map((col, colIdx) => (
                            <div key={col.id || colIdx}>
                                <h4 className="mb-4 text-[0.8125rem] font-semibold text-[#e4935d]">
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
                                                    className="text-[0.9375rem] text-[#a99f91] transition-colors duration-200 hover:text-white"
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
                        <h4 className="mb-4 text-[0.8125rem] font-semibold text-[#e4935d]">Contacto</h4>
                        <ul className="space-y-4 text-[0.9375rem] text-[#a99f91]">
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

            {/* ── Bottom bar ──────────────────────────────────────── */}
            <div className="mx-auto flex max-w-[1640px] flex-col items-start justify-between gap-2 border-t border-white/12 px-5 py-6 sm:flex-row sm:items-center sm:px-8 lg:px-14 xl:px-20">
                <p className="text-[0.8125rem] text-[#8a8276]">
                    © {new Date().getFullYear()}{" "}
                    <EditableText path="footer.copyrightName" ariaLabel="Footer copyright" />.{" "}
                    Todos los derechos reservados.
                </p>
                <p className="text-[0.8125rem] text-[#8a8276]">
                    Infancia · Salud mental · Instituciones
                </p>
            </div>
        </footer>
    );
}
